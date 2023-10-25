from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from .token_auth import JWTAuthMiddlewareStack
from .routing import websocket_urlpatterns

async def websocket_communicator(url, headers=[]):
    """
    Function for establishing communication with websocket.

    Uses WebsocketCommunicator with JWTAuthMiddlewareStack middleware.
    Raises an exception if connection fails.
    """

    communicator = WebsocketCommunicator(
        JWTAuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
        url,
        headers=headers
    )
    connected,_ = await communicator.connect()

    assert connected

    return communicator
