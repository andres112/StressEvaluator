from flask import Blueprint, make_response, jsonify, request, abort
import datetime

from pymongo.errors import *
from helpers import *
from db_config import Test, Step, Result

endpoint = Blueprint("endpoint", __name__, static_folder='static')


# HTTP error handlers
@endpoint.errorhandler(400)
def handle_400_error(_error):
    """Return a http 400 error to client"""
    return make_response(jsonify({'error': 'Bad request'}), 400)


@endpoint.errorhandler(404)
def handle_404_error(_error):
    """Return a http 404 error to client"""
    return make_response(jsonify({'error': 'Not found'}), 404)


@endpoint.errorhandler(500)
def handle_500_error(_error):
    """Return a http 500 error to client"""
    return make_response(jsonify({'error': 'Server error'}), 500)


# CRUD operation for Test
##########################
@endpoint.route('/find_test', methods=['GET'])
def get_all_test():
    try:
        if request.method == 'GET':
            name = request.args.get('name')
            owner = request.args.get('owner')
            tests = {}
            if name is not None and owner is not None:
                tests = Test.find({'$and': [
                    {"name": {"$regex": name, "$options": 'i'}},
                    {"owner": {"$regex": owner, "$options": 'i'}}
                ]})
            elif owner is not None:
                tests = Test.find(
                    {"owner": {"$regex": owner, "$options": 'i'}}
                )
            elif name is not None:
                tests = Test.find(
                    {"name": {"$regex": name, "$options": 'i'}}
                )
            else:
                tests = Test.find()

            if tests is None:
                return make_response(jsonify(message="Test not found"), 404)
            else:
                return make_response(jsonify([item for item in tests]), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error",
                                     details=e.details), 500)


@endpoint.route('/test', methods=['POST'])
def create():
    try:
        if request.method == 'POST':
            # Special handle of informed consent step
            def_consent = getDefaultRes('consent')
            id_consent = uuid.uuid4()

            if all(k in request.json for k in ("name", "description", "owner", "email")):
                new_test = {'_id': uuid.uuid4(),  # test_id correspond to the _id in mongodb
                            'name': request.json["name"],
                            'description': request.json["description"],
                            'owner': request.json["owner"],
                            'organization': request.json["organization"] if keyExist("organization",
                                                                                     request.json) else None,
                            "email": request.json["email"] if keyExist("email", request.json) else None,
                            'number_of_steps': 1,  # this is 1 because the informed consent is added by default
                            'steps': [id_consent],
                            'test_link': None,
                            'published': False,
                            'closed': False,
                            'creation_date': datetime.datetime.now()}
                Test.insert_one(new_test)

                # insert the consent in firs place of steps
                step0 = {'_id': id_consent,
                         'test_id': new_test['_id'],
                         'name': "Informed Consent",
                         'type': "consent",
                         'duration': 0,
                         'content': def_consent["content"]}
                Step.insert_one(step0)
                return make_response(jsonify(message="Test created successfully", test_id=new_test['_id']), 200)
            else:
                abort(400)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error creating test",
                                     details=e.details), 500)
    except DuplicateKeyError as e:
        return make_response(jsonify(message="Error creating test. Test already exist",
                                     details=e.details), 500)


@endpoint.route('/test/<test_id>', methods=['GET', 'DELETE', 'PUT'])
def test_operations(test_id):
    try:
        if test_id is None:
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        if request.method == 'GET':
            test = Test.find_one({"_id": test_uuid})
            if test is None:
                return make_response(jsonify(message="Test not found"), 404)
            else:
                return make_response(jsonify(test), 200)

        if request.method == 'DELETE':
            result = Test.find_one_and_delete({"_id": test_uuid})
            if result is None:
                return make_response(jsonify(message="Test not found"), 404)
            else:
                # Delete all steps associated to the test
                Step.delete_many({"test_id": test_uuid})
                return make_response(jsonify(message="Test deleted successfully", test_id=test_uuid), 200)

        if request.method == 'PUT':
            updated_test = {}
            # parameters allowed
            __parameters = ['name', 'description', 'owner', 'organization', 'email',
                            'published', 'closed', 'test_link']
            # build the data to send to db
            for param in __parameters:
                if keyExist(param, request.json):
                    updated_test[param] = request.json[param]
            # update test in db
            test = Test.update_one({'_id': test_uuid},
                                   {'$set': updated_test})
            if test.matched_count == 0:
                return make_response(jsonify(message="Test not found"), 404)
            elif test.modified_count == 0:
                return make_response(jsonify(message="Test not updated"), 304)
            else:
                return make_response(jsonify(message=f"Test updated successfully", test_id=test_uuid), 200)

    except BulkWriteError as e:
        return make_response(jsonify(message="Error",
                                     details=e.details), 500)


# CRUD operation for Steps
##########################
@endpoint.route('/test/<test_id>/step', methods=['GET', 'POST'])
def get_all_steps(test_id):
    try:
        if test_id is None:
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        if request.method == 'GET':
            steps = Step.find({'test_id': test_uuid})
            if steps is None:
                return make_response(jsonify(message="Steps not found"), 404)
            else:
                return make_response(jsonify([item for item in steps]), 200)

        if request.method == 'POST':
            new_step = {'_id': uuid.uuid4(),
                        'test_id': test_uuid,  # test_id correspond to the _id in mongodb
                        'name': request.json["name"],
                        'type': request.json["type"],
                        'stressor': request.json["stressor"] if keyExist("stressor", request.json) else None,
                        'duration': request.json["duration"] if keyExist("duration", request.json) else 0,
                        'content': request.json["content"] if keyExist("content", request.json) else {}
                        }
            # create step in current test
            test = Test.update_one(
                {'_id': test_uuid}, {'$push': {'steps': new_step['_id']}, '$inc': {'number_of_steps': 1}})
            # create new step
            Step.insert_one(new_step)
            if test.matched_count == 0:
                return make_response(jsonify(message="Test not found"), 404)
            elif test.modified_count == 0:
                return make_response(jsonify(message="Step not added"), 500)
            else:
                return make_response(
                    jsonify(message=f"Step added successfully to the test", test_id=test_uuid, step_id=new_step['_id']),
                    200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error getting steps",
                                     details=e.details), 500)


@endpoint.route('/test/<test_id>/step/<step_id>', methods=['PUT', 'DELETE', 'GET'])
def step_operations(test_id, step_id):
    try:
        if test_id is None or step_id is None:
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        step_uuid = step_id
        if isUUID(step_id):
            # convert step_id to step_uuid
            step_uuid = uuid.UUID(step_id)

        if request.method == 'GET':
            step = Step.find_one({'_id': step_uuid, 'test_id': test_uuid})
            if step is None:
                return make_response(jsonify(message="Steps not found"), 404)
            else:
                return make_response(jsonify(step), 200)

        if request.method == 'PUT':
            updated_step = {}
            # parameters allowed
            __parameters = ['name', 'type', 'duration', 'content', 'stressor']
            # build the data to send to db
            for param in __parameters:
                if keyExist(param, request.json):
                    updated_step[param] = request.json[param]
            # update step in db
            step = Step.update_one({'_id': step_uuid, 'test_id': test_uuid},
                                   {'$set': updated_step})
            if step.matched_count == 0:
                return make_response(jsonify(message="Step not found"), 404)
            elif step.modified_count == 0:
                return make_response(jsonify(message="Step not updated. Similar to current value"), 304)
            else:
                return make_response(
                    jsonify(message=f"Step updated successfully", test_id=test_uuid, step_id=step_uuid), 200)

        if request.method == 'DELETE':
            result = Step.find_one_and_delete(
                {'_id': step_uuid, 'test_id': test_uuid})
            if result is None:
                return make_response(jsonify(message="Resource not found"), 404)
            else:
                # Remove step identifier from Test[test_id].steps
                Test.update_one(
                    {'_id': test_uuid}, {'$pull': {'steps': step_uuid}, '$inc': {'number_of_steps': -1}})
                return make_response(
                    jsonify(message="Test step deleted successfully", test_id=test_uuid, step_id=step_uuid), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error in step operation",
                                     details=e.details), 500)


# CRUD operation for Session and Results
########################################
@endpoint.route('/create_session/<test_id>', methods=['POST'])
def create_session(test_id):
    try:
        if test_id is None or not keyExist("session_id", request.json):
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        # Define the user parameter structure
        user = {'email': None, 'age': None, 'gender': None}
        user.update(request.json["user"])

        if request.method == 'POST':
            new_session = {'_id': request.json["session_id"],
                           'test_id': test_uuid,  # test_id correspond to the _id in mongodb
                           'user': user,  # user parameter updated with data sent by user
                           'consent': None,
                           'current_step': None,
                           'creation_date': datetime.datetime.now(),
                           'close_date': None,
                           'responses': []}
        # create new step
        Result.insert_one(new_session)
        return make_response(
            jsonify(message="User session created successfully", test_id=test_uuid, session_id=new_session['_id']),
            200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error creating User Session",
                                     details=e.details), 500)
    except DuplicateKeyError as e:
        return make_response(jsonify(message="Error creating User Session. This already exist",
                                     details=e.details), 500)


@endpoint.route('/test/<test_id>/session/<session_id>', methods=['POST', 'PUT'])
def session_step(test_id, session_id):
    try:
        if test_id is None or session_id is None:
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        # session_id is not converted to uuid
        if request.method == 'POST':
            if all(k in request.json for k in ("step_id", "content", "start_time", "end_time", "type")):
                new_answer = {'step_id': uuid.UUID(request.json["step_id"]),  # test_id correspond to the _id in mongodb
                              'content': request.json["content"],
                              'start_time': request.json["start_time"],
                              'end_time': request.json["end_time"],
                              'type': request.json["type"]}
                result = Result.update_one(
                    {'_id': session_id, 'test_id': test_uuid}, {'$push': {'responses': new_answer}})
                if result.matched_count == 0:
                    return make_response(jsonify(message="User Session not found"), 404)
                elif result.modified_count == 0:
                    return make_response(jsonify(message="User Session response not updated"), 500)
                else:
                    return make_response(
                        jsonify(message="Answer sent successfully", test_id=test_uuid, step_id=new_answer["step_id"],
                                session_id=session_id), 200)
            else:
                abort(400)

        if request.method == 'PUT':
            updated_session = {}
            # parameters allowed
            __parameters = ['consent', 'current_step']
            # build the data to send to db
            for param in __parameters:
                if keyExist(param, request.json):
                    updated_session[param] = request.json[param]
            # update session in db
            step = Result.update_one({'_id': session_id, 'test_id': test_uuid},
                                     {'$set': updated_session})
            if step.matched_count == 0:
                return make_response(jsonify(message="Session not found"), 404)
            elif step.modified_count == 0:
                return make_response(jsonify(message="Session not updated. Similar to current value"), 304)
            else:
                return make_response(
                    jsonify(message=f"Session updated successfully", test_id=test_uuid, session_id=session_id), 200)

    except BulkWriteError as e:
        return make_response(jsonify(message="Error sending answer",
                                     details=e.details), 500)


@endpoint.route('/close_session/<test_id>/session/<session_id>', methods=['GET'])
def close_session(test_id, session_id):
    try:
        if test_id is None or session_id is None:
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        if request.method == 'GET':
            step = Result.update_one({'_id': session_id, 'test_id': test_uuid},
                                     {'$set': {'close_date': datetime.datetime.now()}})
            if step.matched_count == 0:
                return make_response(jsonify(message="Session not found"), 404)
            else:
                return make_response(
                    jsonify(message=f"Session closed successfully", test_id=test_uuid, session_id=session_id), 200)

    except BulkWriteError as e:
        return make_response(jsonify(message="Error sending answer",
                                     details=e.details), 500)


@endpoint.route('/test_results/<test_id>', methods=['GET'])
def test_results(test_id):
    try:
        if test_id is None:
            abort(400)
            return

        test_uuid = test_id
        if isUUID(test_id):
            # convert test_id to test_uuid
            test_uuid = uuid.UUID(test_id)

        response_type = request.args.get('type') or 'json'

        if request.method == 'GET':
            results = Result.find({'test_id': test_uuid})
            if request.args.get('full') != "true":
                responses = groupBy([item for item in results])

            if results is None:
                return make_response(jsonify(message="Test results not found"), 404)
            else:
                if request.args.get('full') == "true":
                    return make_response(jsonify([item for item in results]), 200)
                elif response_type == 'json':
                    return make_response(jsonify(responses), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error sending answer",
                                     details=e.details), 500)


# Just for development DELETE for production
@endpoint.route("/del_all", methods=['GET'])
def __delete_session():
    try:
        if request.method == 'GET':
            Result.remove({})
        return make_response(jsonify(message="Deleted"), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error deleting",
                                     details=e.details), 500)
