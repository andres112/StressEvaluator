from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
import os
import pymongo

# Environment variables
load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)

DB_PASS = os.getenv('DB_PASS')
DB_USER = os.getenv('DB_USER')

# DB connection and client configuration
db_url = f'mongodb+srv://{DB_USER}:{DB_PASS}@tester.dcebp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
app = Flask(__name__)
db_client = pymongo.MongoClient(db_url)

# Database
db = db_client.get_database('Test')

# Routes
@app.route('/test')
def test():
    new_test = {'steps': 4,
                'questionnaires': [
                    {'questions': [
                        'this is the question 1', 'this is the question 2'
                    ],
                        'step':0},
                    {'questions': [
                        'this is the question 1', 'this is the question 2'
                    ],
                        'step':2}
                ],
                'stressors': [
                    {'type': 'arimethic',
                        'step': 1},
                    {'type': 'arimethic',
                        'step': 3}
                ]
                }
    db.Stressor.insert_one(new_test)
    return jsonify({'message': 'success'})


if __name__ == '__main__':
    app.run(debug=True)
