from http.cookies import SimpleCookie

def get_cookie(scope, cookie):
    """
    Function for getting cookies out of scope.
    Returns empty string if exception occurs.
    """

    try:
        return SimpleCookie(dict(scope['headers']).get(b'cookie').decode('utf8')).get(cookie).value
    except Exception:
        return ''

def default_game_positions():
    """
    Function for creating default game positions used in Game model.
    """

    return [
        ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
    ]
