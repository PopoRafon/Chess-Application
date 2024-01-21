from http.cookies import SimpleCookie

def get_cookie(scope, cookie):
    """
    Get cookies out of consumers scope.
    Returns empty `string` if cookie couldn't be retrieved.
    """
    try:
        return SimpleCookie(dict(scope['headers']).get(b'cookie').decode('utf8')).get(cookie).value
    except Exception:
        return ''
