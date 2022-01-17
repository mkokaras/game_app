"""
ASGI config for game_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import api.routing
from api.middleware import TokenAuthMiddleware
from channels.routing import get_default_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game_server.settings')

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": asgi_application,
    "websocket": TokenAuthMiddleware(
        URLRouter(
            api.routing.websocket_urlpatterns
        )
    ),
})
