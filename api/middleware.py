from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from knox.models import AuthToken
from knox.auth import TokenAuthentication


@database_sync_to_async
def get_user(token_key):
    try:
        #token = AuthToken.objects.get(token_key=token_key)

        user, token = TokenAuthentication().authenticate_credentials(
            token_key.encode('ascii'))

        return user

    except:
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        try:
            token_key = (dict((x.split('=') for x in scope['query_string'].decode().split(
                "&")))).get('token', None)
        except ValueError:
            token_key = None

        scope['user'] = AnonymousUser() if token_key is None else await get_user(token_key)

        return await super().__call__(scope, receive, send)
