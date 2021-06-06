import os
import pymongo
from dotenv import load_dotenv
from pathlib import Path

# Environment variables
load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)

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
Result = db.Result
