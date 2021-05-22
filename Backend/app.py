import argparse
import os
from flask import Flask, jsonify, request, redirect, make_response
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from dotenv import load_dotenv
from pathlib import Path
import pymongo
from pymongo.errors import BulkWriteError

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

# Routes
# HTTP messages
@app.errorhandler(400)
def handle_400_error(_error):
    """Return a http 400 error to client"""
    return make_response(jsonify({'error': 'Misunderstood'}), 400)

@app.errorhandler(404)
def handle_404_error(_error):
    """Return a http 404 error to client"""
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(500)
def handle_500_error(_error):
    """Return a http 500 error to client"""
    return make_response(jsonify({'error': 'Server error'}), 500)

# Valid routes
# Create test
@app.route('/create_test', methods=['POST'])
def create_test():
    try:
        if request.method == 'POST':
            new_test = {'number_of_steps': request.json["number_of_steps"]}
            db.Test.insert_one(new_test)
            return make_response(jsonify(message="success"), 200)
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
