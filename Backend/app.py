import argparse
import os
import datetime
import uuid
from flask import Flask, abort, jsonify, request, redirect, make_response
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from dotenv import load_dotenv
from pathlib import Path
import pymongo
from pymongo.errors import *

from helpers import *

app = Flask(__name__)

# Environment variables
load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)

# swagger details
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Stressor Test Platform API"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

# DB connection and client configuration
DB_PASS = os.getenv('DB_PASS')
DB_USER = os.getenv('DB_USER')
db_url = f'mongodb+srv://{DB_USER}:{DB_PASS}@tester.dcebp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
db_client = pymongo.MongoClient(db_url)

# Database
db = db_client.get_database('Evaluations')

# Collections
Test = db.Test
Step = db.Step

# Routes
# HTTP messages
@app.errorhandler(400)
def handle_400_error(_error):
    """Return a http 400 error to client"""
    return make_response(jsonify({'error': 'Bad request'}), 400)


@app.errorhandler(404)
def handle_404_error(_error):
    """Return a http 404 error to client"""
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.errorhandler(500)
def handle_500_error(_error):
    """Return a http 500 error to client"""
    return make_response(jsonify({'error': 'Server error'}), 500)

# Valid routes

# CRUD oparation for Test
##########################
@app.route('/test', methods=['POST'])
def create():
    try:
        if request.method == 'POST':
            if all(k in request.json for k in ("test_id", "name", "description")):

                new_test = {'_id': request.json["test_id"],  # test_id correspond to the _id in mongodb
                            'name': request.json["name"],
                            'description': request.json["description"],
                            'consent': request.json["consent"] if keyExist("consent", request.json) else "",
                            'number_of_steps': request.json["number_of_steps"] if keyExist("number_of_steps", request.json) else 0,
                            'steps': request.json["steps"] if keyExist("steps", request.json) else [],
                            'published': False,
                            'creation_date': datetime.datetime.now()}
                Test.insert_one(new_test)
                return make_response(jsonify(message="Test created successfully"), 200)
            else:
                abort(400)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error creating test",
                                     details=e.details), 500)
    except DuplicateKeyError as e:
        return make_response(jsonify(message="Error creating test. Test already exist",
                                     details=e.details), 500)


@app.route('/test/<test_id>', methods=['GET', 'DELETE'])
def test_operations(test_id):
    try:
        if request.method == 'GET':
            test = Test.find_one({"_id": test_id})
            if test is None:
                return make_response(jsonify(message="Test not found"), 404)
            else:
                test['_id'] = str(test['_id'])  # Convert objectId to string
                return make_response(jsonify(test), 200)

        if request.method == 'DELETE':
            result = Test.find_one_and_delete({"_id": test_id})
            if result is None:
                return make_response(jsonify(message="Test not found"), 404)
            else:
                # Delete all steps associated to the test
                Step.delete_many({"test_id": test_id})
                return make_response(jsonify(message="Test deleted successfully"), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error",
                                     details=e.details), 500)


# CRUD oparation for Steps
##########################
@app.route('/test/<test_id>/steps', methods=['GET', 'POST'])
def get_all_steps(test_id):
    try:
        if test_id is None:
            abort(400)
            return

        if request.method == 'GET':
            steps = Step.find({'test_id': test_id})
            if steps is None:
                return make_response(jsonify(message="Steps not found"), 404)
            else:
                return make_response(jsonify([item for item in steps]), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error creating test",
                                     details=e.details), 500)


@app.route('/test/<test_id>/step/<step_id>', methods=['PUT', 'DELETE', 'GET'])
def step_operations(test_id, step_id):
    try:
        if test_id is None:
            abort(400)
            return
        # convert step_id to step_uuid
        step_uuid = uuid.UUID(step_id)

        if request.method == 'POST':
            new_step = {'_id': uuid.uuid4(),
                        'test_id': test_id,  # test_id correspond to the _id in mongodb
                        'name': request.json["name"],
                        'type': request.json["type"],
                        'duration': request.json["duration"] if keyExist("duration", request.json) else 30,
                        'content': {}}
            # create step in current test
            test = Test.update_one(
                {'_id': test_id}, {'$push': {'steps': new_step['_id']}})
            # create new step
            Step.insert_one(new_step)
            if test.matched_count == 0:
                return make_response(jsonify(message="Test not found"), 404)
            elif test.modified_count == 0:
                return make_response(jsonify(message="Step not added"), 500)
            else:
                return make_response(jsonify(message=f"Step {new_step['_id']} added successfully to test {test_id}"), 200)

        if request.method == 'GET':
            step = Step.find_one({'_id': step_uuid, 'test_id': test_id})
            if step is None:
                return make_response(jsonify(message="Steps not found"), 404)
            else:
                return make_response(jsonify(step), 200)

        if request.method == 'PUT':
            updated_step = {}
            # parameters allowed
            __parameters = ['name', 'type', 'duration', 'content']
            # build the data to send to db
            for param in __parameters:
                if (keyExist(param, request.json)):
                    updated_step[param] = request.json[param]
            # update step in db
            step = Step.update_one({'_id': step_uuid, 'test_id': test_id}, {
                '$set': updated_step})
            if step.matched_count == 0:
                return make_response(jsonify(message="Step not found"), 404)
            elif step.modified_count == 0:
                return make_response(jsonify(message="Step not updated"), 500)
            else:
                return make_response(jsonify(message=f"Step {step_id} updated successfully to test {test_id}"), 200)
    except BulkWriteError as e:
        return make_response(jsonify(message="Error creating test",
                                     details=e.details), 500)


# Main execution
if __name__ == '__main__':
    PARSER = argparse.ArgumentParser(description="Stressor Test Platform API")
    PARSER.add_argument('--debug', action='store_true',
                        help="Use flask debug/dev mode with file change reloading")
    ARGS = PARSER.parse_args()

    PORT = os.getenv('PORT')

    if ARGS.debug:
        print("Running in debug mode")
        # cross origing support
        CORS(app)
        app.run(host='0.0.0.0', port=PORT, debug=True)
    else:
        app.run(host='0.0.0.0', port=PORT, debug=False)
