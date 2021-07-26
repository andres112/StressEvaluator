import json
import uuid
from db_config import DefaultRes
from itertools import groupby
import numpy as np
import pandas as pd


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
    sorted_responses = sorted(responses, key=lambda res: res['step_id'])
    groups = groupby(sorted_responses, lambda content: content['step_id'])
    step_groups = {}
    for step_id, group in groups:
        step_content = []
        for content in group:
            step_content = np.append(step_content, content)
        step_groups[str(step_id)] = step_content.tolist()
    return step_groups
