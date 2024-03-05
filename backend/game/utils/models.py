import textwrap
from datetime import datetime

def create_chess_pgn(white_player, black_player):
    """
    Create chess pgn with some default headers.
    """
    return textwrap.dedent(f"""\
        [Event "Live Chess"]
        [Site "Chess"]
        [Date "{datetime.now().date()}"]
        [Round "0"]
        [White "{white_player}"]
        [Black "{black_player}"]
        [Result "*"]

        *""")

def add_rating_points(winner_profile, loser_profile):
    """
    Add rating points to profile objects.
    """
    stage_amplifier = lambda a: max(3 - (a / 400 * 0.3), 1)
    probability_formula = lambda a, b: 1 / (1 + 10 ** ((a - b) / 400))
    sensitivity = 15 + abs((winner_profile.rating - loser_profile.rating) / 50)

    winner_profile.rating += round((sensitivity * stage_amplifier(winner_profile.rating)) * (1 - probability_formula(loser_profile.rating, winner_profile.rating)))
    loser_profile.rating += round((sensitivity * stage_amplifier(loser_profile.rating)) * (0 - probability_formula(winner_profile.rating, loser_profile.rating)))
