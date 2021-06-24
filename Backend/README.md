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

__Mongo DB - Atlas__

Create Database in Mongodb with 3 collections, named as:
- Result
- Step (*type: "question" || "task" || "consent"*)
- Test
- DefaultRes (*Contains the default resources for Informed consent, Questionnaires and Stressors*)

    ### DefaultRes - Document collection schema:
    ```json
    {
        "type":"<resource_type>", //"consent"
        "content":"<resource_content>" // "content in html format"
    }
    ```

    - The content for *type: consent* could be found in assets folder:  [default_consent.json](./assets/default_consent.json)


Create .env file in the root of project (.\mt_stress_detection\Backend\) with the following structure:

![](../Readme_Assets/folder.png)

- **[MongoDB_Url]** refers to the provided url after create the cluster in [MongoDB Atlas](https://www.mongodb.com/) or the local address for local installation.

- __[MongoDB_Database_Name]__ given name to the DataBase in MongoDB 
```
DB_URL=[MongoDB_Url]
DB_NAME=[MongoDB_Database_Name]
```

__Clone the Project__

In your local machine execute the following: 

    git clone https://gitlab.forge.hefr.ch/karl.daher/mt_stress_detection.git

    cd .\mt_stress_detection\Backend\

Install dependencies included in __requirements.txt__ file

    pip install -r requirements.txt

## Implementation

After the configuration is correct, in the same directory execute:

    python main.py

After the server is running, in http://localhost:5000/swagger/ It's possible to find the swagger documentation. There you can find the interactive endpoint of the API REST:

- ### Test
    - GET: http://localhost:5000/find_test -> Get all tests or those which match with name and owner
        - Query params: 
            - name[String] *optional*
            - owner[String] *optional*
    - POST: http://localhost:5000/test -> Create new test
        - Body: 
            ```json
            {
                "name": String,
                "owner": String,
                "description": String
            }
            ```
    - GET: http://localhost:5000/test/{test_id} -> Get test, that which match with test_id
        - Path params: 
            - test_id[String] *required*
    - PUT: http://localhost:5000/test/{test_id} -> Update test , that which match with test_id
        - Body: 
            ```json
            {
                "name": String,
                "owner": String,
                "description": String,
                "published": Boolean,
                "closed": Boolean
            }
            ```
    - DELETE: http://localhost:5000/test/{test_id} -> Delete test, that which match with test_id
        - Path params: 
            - test_id[String] *required*
- ### Step
    - GET: http://localhost:5000/test/{test_id}/step -> Get all steps for one test with test_id
        - Path params: 
            - test_id[String] *required*
    - POST: http://localhost:5000/test/{test_id}/step -> Create new step for one test with test_id
        - Path params: 
            - test_id[String] *required*
        - Body: 
            ```json
            {
                "test_id": String,
                "name": String,
                "type": String, //"Consent, question or stress"
                "duration": Number,
                "content": Object || Array // "Depend of component"
            }
            ```
    - GET: http://localhost:5000/test/{test_id}/step/{step_id}-> Get one step from one test with test_id
        - Path params: 
            - test_id[String] *required*
            - step_id[String] *required*
    - PUT: http://localhost:5000/test/{test_id}/step/{step_id} -> Update one step from one test with test_id
        - Path params: 
            - test_id[String] *required*
            - step_id[String] *required*
        - Body: 
            ```json
            {
                "name": String,
                "type": String, //"Consent, question or stress"
                "duration": Number,
                "content": Object || Array // "Depend of component"
            }
            ```
    - DELETE: http://localhost:5000/test/{test_id}/step/{step_id}-> Delete one step from one test with test_id
        - Path params: 
            - test_id[String] *required*
            - step_id[String] *required*
- ### Implementation
    - POST: http://localhost:5000/create_session/{test_id} -> Create new session for test implementation
        - Path params: 
            - test_id[String] *required*
        - Body: 
            ```json
            {
                "test_id": String,
                "session_id": String
            }
            ```
    - POST: http://localhost:5000/send_step/{test_id}/session/{session_id} -> Send results for one step from one test
        - Path params: 
            - test_id[String] *required*
            - step_id[String] *required*
        - Body: 
            ```json
            {
                "content": Object,
                "start_time": Datetime,
                "end_time": Datetime
            }
            ```
 - ### Result
    - GET: http://localhost:5000/test_results/{test_id} -> Get results from test with test_id
        - Path params: 
            - test_id[String] *required*           