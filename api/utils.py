from http.cookies import SimpleCookie
import uuid

def get_cookie(scope, cookie):
    """
    Get cookies out of consumers scope.
    Returns empty string if exception occurs.
    """
    try:
        return SimpleCookie(dict(scope['headers']).get(b'cookie').decode('utf8')).get(cookie).value
    except Exception:
        return ''

def create_avatar_name(instance, filename):
    """
    Create and return hash name for user uploaded avatar files.
    """
    extension = filename.split('.')[-1]
    hashed_file_name = f'{uuid.uuid4()}.{extension}'
    return f'avatars/{hashed_file_name}'

def add_rating_points(winner_profile, loser_profile):
    """
    Add rating points to profile objects.
    """
    stage_amplifier = lambda a: max(3 - (a / 400 * 0.3), 1)
    probability_formula = lambda a, b: 1 / (1 + 10 ** ((a - b) / 400))
    sensitivity = 15 + abs((winner_profile.rating - loser_profile.rating) / 50)

    winner_profile.rating += round((sensitivity * stage_amplifier(winner_profile.rating)) * (1 - probability_formula(loser_profile.rating, winner_profile.rating)))
    loser_profile.rating += round((sensitivity * stage_amplifier(loser_profile.rating)) * (0 - probability_formula(winner_profile.rating, loser_profile.rating)))
