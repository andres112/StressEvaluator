import uuid
from db_config import DefaultRes


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
  
