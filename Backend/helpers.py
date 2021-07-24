import uuid
from db_config import DefaultRes
from itertools import groupby
import numpy as np


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
    responses = np.array([item['responses'] for item in array]).flatten()
    groups = groupby(responses, lambda content: content['step_id'])
    step_content = []
    for step_id, group in groups:
        for content in group:
            step_content = np.append(step_content, content)
    if len(step_content) > 0:
        return step_content.tolist()
    else:
        return step_content
