# Stressor Evaluator - Backend

### As a part of **The effect of music and colored light on stress in occupational health** project.


## Tools (requirements.txt)
- python v 3.x 
- Flask
- Mongodb
### Libraries
- pymongo
- flask-cors
- python-dotenv
- flask-swagger-ui (for documentation)

## Set up

Cloning the project in your local machine from https://gitlab.forge.hefr.ch/karl.daher/mt_stress_detection.git

    cd .\mt_stress_detection\Backend\

Install dependencies included in __requirements.txt__ file

    pip install requirements.txt

__Mongo DB - Atlas__

Create Database in Mongodb with 3 collections, named as:
- Result
- Step
- Test

Create .env file in the root of project (.\mt_stress_detection\Backend\) with the following structure:

![](../Readme_Assets/folder.png)

- **[MongoDB_Url]** refers to the provided url after create the cluster in [MongoDB Atlas](https://www.mongodb.com/) or the local address for local installation.

- __[MongoDB_Database_Name]__ given name to the DataBase in MongoDB 
```
DB_URL=[MongoDB_Url]
DB_NAME=[MongoDB_Database_Name]
```
   
