from http.cookies import SimpleCookie
import uuid

def get_cookie(scope, cookie):
    """
    Function for getting cookies out of scope.
    Returns empty string if exception occurs.
    """
    try:
        return SimpleCookie(dict(scope['headers']).get(b'cookie').decode('utf8')).get(cookie).value
    except Exception:
        return ''

def create_avatar_name(instance, filename):
    """
    Function for creating hash name for user uploaded avatar files.
    """
    extension = filename.split('.')[-1]
    hashed_file_name = f'{uuid.uuid4()}.{extension}'
    return f'avatars/{hashed_file_name}'
