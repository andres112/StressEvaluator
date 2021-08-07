import uuid
from db_config import DefaultRes
from itertools import groupby
import numpy as np
import pandas as pd
import os


def keyExist(parameter, element):
    return parameter in element


def isUUID(text):
    try:
        uuid.UUID(text)
        return True
    except ValueError:
        return False


def getDefaultRes(type):
    # Get default resources from database   
    D_RES = DefaultRes.find_one({'type': type})
    del D_RES["_id"]
    return D_RES


def groupBy(array):
    # Get the responses only and remove results with empty responses
    responses = np.array([item['responses'] for item in array if item['responses']], dtype=object).flatten()
    sorted_responses = sorted(responses, key=lambda res: res['step_id'])
    groups = groupby(sorted_responses, lambda content: content['step_id'])
    step_groups = {}
    for step_id, group in groups:
        step_content = []
        for content in group:
            step_content = np.append(step_content, content)
        step_groups[str(step_id)] = step_content.tolist()
    return step_groups


def jsonToCsv(responses, path):
    content_list = [item['content'] for item in responses]
    # validate if content is list type
    if isinstance(responses[0]['content'], list):
        flat_list = [val for sublist in content_list for val in sublist]
    else:
        flat_list = content_list
    df = pd.DataFrame.from_dict(flat_list)
    step_id = responses[0]['step_id']
    # Create temporal directory for csv files
    if not os.path.exists(path):
        os.makedirs(path)
    # Create csv file and save it into the just created directory
    csv_file = df.to_csv(rf'{path}{step_id}.csv', index=False, header=True)
    return csv_file
