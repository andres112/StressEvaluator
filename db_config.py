import os
import pymongo
from dotenv import load_dotenv
from pathlib import Path

# Environment variables
load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)

# DB connection and client configuration
db_url = os.getenv('DB_URL')
db_client = pymongo.MongoClient(db_url)

# Database
db_name = os.getenv('DB_NAME')
db = db_client.get_database(db_name)

# Collections
Test = db.Test
Step = db.Step
Result = db.Result
DefaultRes = db.DefaultRes
