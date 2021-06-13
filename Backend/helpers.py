import uuid

def keyExist(parameter, object):
    return parameter in object


def isUUID(text):
    try:
        uuid.UUID(text)
        return True
    except ValueError:
        return False
