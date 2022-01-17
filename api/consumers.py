
import json
from pickle import TRUE
from re import I
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User
from .serializers import InvitationsSerializer, MemberSerializer, UserSerializer
from .models import ChessGame, Game, UsersOnline, Member, Invitations
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


@database_sync_to_async
def connect_lobby(self):
    user = User.objects.filter(username=self.scope["user"])

    if(len(user) > 0):
        UsersOnline.objects.filter(userId=user[0]).update(online=True)


@database_sync_to_async
def disconnect_lobby(self):
    user = User.objects.filter(username=self.scope["user"])

    if(len(user) > 0):
        UsersOnline.objects.filter(userId=user[0]).update(online=False)


@database_sync_to_async
def disconnect_from_chess(self):
    message = ""
    send_message = False

    game = ChessGame.objects.filter(gameId=self.room_name, result="active")

    invitation = Invitations.objects.filter(
        to_username=self.scope["user"])

    if(len(invitation) > 0):
        invitation = invitation[0]

        user_on_game = InvitationsSerializer(
            invitation).data.get("from_token")

        invitation.delete()

        user = User.objects.filter(username=user_on_game)[0]

        user_on_game_id = UserSerializer(user).data.get("id")

        # send message to socket to redirect user

        send_message = True

        if(len(game) > 0):

            message = {'to_userid': user_on_game_id,
                       'type': 'winner'}

        else:
            message = {'to_userid': user_on_game_id,
                       'type': 'redirect'}

    else:
        invitation = Invitations.objects.filter(
            from_token=self.scope["user"])

        if len(invitation) > 0:
            invitation = invitation[0]

            user_on_game = InvitationsSerializer(
                invitation).data.get("to_username")

            invitation.delete()

            user = User.objects.filter(username=user_on_game)[0]

            user_on_game_id = UserSerializer(user).data.get("id")

            # send message to socket to redirect user

            send_message = True

            if(len(game) > 0):

                message = {'to_userid': user_on_game_id,
                           'type': 'winner'}

            else:
                message = {'to_userid': user_on_game_id,
                           'type': 'redirect'}

    if(len(game) > 0):

        game = game[0]

        user = User.objects.filter(username=self.scope["user"])[0]

        member = Member.objects.filter(
            memberId=UserSerializer(user).data.get("id"), gameId=self.room_name)

        if(len(member) > 0):
            member = member[0]

        color = MemberSerializer(member).data.get("startingpiece")

        if(color == "w"):
            winner = "BLACK"
        else:
            winner = "WHITE"

        game.result = winner

        game.save(update_fields=['result'])

    return message, send_message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']

        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        message, send_message = await disconnect_from_chess(self)

        if(send_message):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )

    # Receive message from WebSocket

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def send_from_view(self, event):
        message = event['message']

        await self.send(
            json.dumps({
                'message': message
            })
        )


class InviteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'lobby'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await connect_lobby(self)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        await disconnect_lobby(self)

    # Receive message from WebSocket

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
