from http import server
from django.contrib import auth
from django.core.checks import messages
from django.db.models import query
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, serializers, permissions
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.utils import serializer_helpers
from rest_framework.views import APIView, exception_handler
from .models import ChessGame, ChessMove, Game, Member, UsersOnline, Invitations
from .serializers import ChessMoveSerializer, CreateChessGameSerializer, UpdateChessGameSerializer, UserSerializer, MemberSerializer, GameSerializer, UpdateGameSerializer, UsersOnlineSerializer, InvitationsSerializer, RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.contrib.auth.signals import user_logged_in
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from knox.models import AuthToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.exceptions import APIException


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if(serializer.is_valid() == False):
            return Response({'Register': 'NOK'}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Login API


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if(serializer.is_valid() == False):
            return Response({'Login': 'NOK'}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data

        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })

# Get User API


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        print("TRIED IT HERE")
        return self.request.user


class getUserByToken(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'token'

    def get(self, request, format=None):
        token = request.GET.get(self.lookup_url_kwarg)

        if token != None:

            user = self.request.user

            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

        return Response({'User Not Found': 'Invalid User Token.'}, status=status.HTTP_404_NOT_FOUND)


class GameView(APIView):
    serializer_class = GameSerializer

    def post(self, request, format=None):

        print(request.data)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            game_status = serializer.data.get('game_status')

            gameId = serializer.data.get('gameId')

            game = Game(game_status=game_status,
                        gameId=gameId)

            game.save()

            return Response({'Success': 'Game OK', 'gameId': gameId}, status=status.HTTP_201_CREATED)

        return Response({'Fail': 'Bad game'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            gameId = serializer.data.get('gameId')


class MemberView(APIView):
    serializer_class = MemberSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            memberId = serializer.data.get('memberId')

            memberId = User.objects.filter(id=memberId)[0]

            startingpiece = serializer.data.get('startingpiece')

            creator = serializer.data.get('creator')

            game = Game.objects.filter(gameId=serializer.data.get('gameId'))

            if(len(game) > 0):
                data = GameSerializer(game[0]).data
                gameId = Game(gameId=data.get('gameId'),
                              game_status=data.get('game_status'))
                member = Member(memberId=memberId,
                                startingpiece=startingpiece, creator=creator, gameId=gameId)
                member.save()

                return Response({'Success': 'Member OK'}, status=status.HTTP_201_CREATED)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)


class getGame(APIView):
    serializer_class = GameSerializer
    lookup_url_kwarg = 'gameId'

    def get(self, request, format=None):
        gameId = request.GET.get(self.lookup_url_kwarg)
        if gameId != None:
            room = Game.objects.filter(gameId=gameId)
            if len(room) > 0:
                data = GameSerializer(room[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Game Not Found': 'Invalid Game Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'GameId paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class getCreator(APIView):
    serializer_class = MemberSerializer
    lookup_url_kwarg = 'gameId'

    def get(self, request, format=None):
        gameId = request.GET.get(self.lookup_url_kwarg)

        if gameId != None:
            member = Member.objects.filter(gameId=gameId, creator=True)
            if len(member) > 0:
                data = MemberSerializer(member[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Game Not Found': 'Invalid Game Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'GameId paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateGame(APIView):
    serializer_class = UpdateGameSerializer

    def patch(self, request, format=None):

        print(request.data)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            game_status = serializer.data.get('game_status')

            gameId = serializer.data.get('gameId')

            queryset = Game.objects.filter(gameId=gameId)

            if not queryset.exists():
                return Response({'msg': 'Game not found.'}, status=status.HTTP_404_NOT_FOUND)

            game = queryset[0]

            game.game_status = game_status

            game.save(update_fields=['game_status'])

            return Response(GameSerializer(game).data, status=status.HTTP_200_OK)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)


class getUsername(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'token'

    def get(self, request, format=None):
        token = request.GET.get(self.lookup_url_kwarg)

        if token != None:
            user = self.request.user

            data = UserSerializer(user).data

            return Response(data, status=status.HTTP_200_OK)

        return Response({'User Not Found': 'Invalid User Token.'}, status=status.HTTP_404_NOT_FOUND)


class getOnlineUsers(APIView):

    serializer_class = UsersOnlineSerializer
    lookup_url_kwarg = 'token'

    def get(self, request, format=None):
        token = request.GET.get(self.lookup_url_kwarg)
        list = []

        usernames = []

        called_by_user = self.request.user

        called_by_username = UserSerializer(called_by_user).data

        users = User.objects.filter(usersonline__online=True)

        if len(users) > 0:
            for user in users:

                if(called_by_username.get('username') != UserSerializer(user).data.get('username')):
                    list.append(UserSerializer(user).data.get('username'))

            return Response(list, status=status.HTTP_200_OK)

        return Response(list, status=status.HTTP_404_NOT_FOUND)


class setInvitations(APIView):
    serializer_class = InvitationsSerializer

    def post(self, request, format=None):

        serializer = InvitationsSerializer(data=request.data)

        if serializer.is_valid():

            from_token = serializer.data.get('from_token')

            to_username = serializer.data.get('to_username')

            status_invitation = serializer.data.get('status')

            layer = get_channel_layer()

            to_user = User.objects.filter(
                username=to_username, usersonline__online=True)

            if len(to_user) > 0:
                to_user_id = UserSerializer(to_user[0]).data.get('id')
            else:
                return Response({'Fail': 'NOONLINE'})

            from_user = self.request.user

            from_username = UserSerializer(
                from_user).data.get('username')

            already_invited1 = Invitations.objects.filter(
                to_username=to_username)
            already_invited2 = Invitations.objects.filter(
                from_token=to_username)

            already_invited3 = Invitations.objects.filter(
                from_token=from_username
            )

            if((len(already_invited1) > 0) or len(already_invited2)):
                return Response({'Fail': 'BUSY'})

            if(len(already_invited3) > 0):
                return Response({'Fail': 'ONE'})

            if(from_username == to_username):
                return Response({'Fail': 'REJECT'})

            invitation = Invitations(
                from_token=from_username, to_username=to_username, status=status_invitation)

            invitation.save()

            message = {'to_userid': to_user_id,
                       'from_user': from_username, 'type': 'invite'}

            async_to_sync(layer.group_send)(
                'lobby', {'type': 'chat_message', 'message': message})

            return Response({'Send invitation': 'OK'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class updateInvitation(APIView):
    serializer_class = InvitationsSerializer
    lookup_url_kwarg = 'username'
    lookup_url_kwarg2 = 'userid'
    lookup_url_kwarg3 = 'decline'
    lookup_url_kwarg4 = 'token'

    def patch(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        user_arg = request.GET.get(self.lookup_url_kwarg2)

        if serializer.is_valid():

            gameId = serializer.data.get('from_token')

            to_username = serializer.data.get('to_username')

            status_invitation = serializer.data.get('status')

            from_user_arg = User.objects.filter(id=user_arg)

            if len(from_user_arg) > 0:
                from_username_arg = UserSerializer(
                    from_user_arg[0]).data.get('username')

            queryset = Invitations.objects.filter(
                from_token=to_username, to_username=from_username_arg)

            if not queryset.exists():
                return Response({'Fail': 'NOTVALID'})

            invitation = queryset[0]

            invitation.status = status_invitation

            invitation.save(update_fields=['status'])

            to_user = User.objects.filter(username=to_username)

            if len(to_user) > 0:
                to_user_id = UserSerializer(to_user[0]).data.get('id')

            message = {'to_userid': to_user_id,
                       'gameId': gameId, 'type': 'accept'}

            layer = get_channel_layer()

            async_to_sync(layer.group_send)(
                'lobby', {'type': 'chat_message', 'message': message})

            return Response({'Accept Invitation': 'OK'}, status=status.HTTP_200_OK)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        to_username = request.GET.get(self.lookup_url_kwarg)

        if to_username != None:

            invitation = Invitations.objects.filter(to_username=to_username)

            if len(invitation) > 0:
                invitation.delete()

                return Response({'Success': 'Invitation deleted'}, status=status.HTTP_200_OK)

            return Response({'Invitation Not Found': 'Invalid Username'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if(serializer.is_valid()):
            from_username = serializer.data.get('from_token')

            to_username = serializer.data.get('to_username')

            status_invitation = serializer.data.get('status')

            invitation = Invitations.objects.filter(to_username=to_username)

            if len(invitation) > 0:
                invitation.delete()
            else:
                return Response({'Success': 'Invitation is already deleted'}, status=status.HTTP_200_OK)

            from_user_id = User.objects.filter(username=from_username)

            if len(from_user_id) > 0:
                from_user_id = UserSerializer(
                    from_user_id[0]).data.get('id')

            message = {'to_userid': from_user_id,
                       'type': 'decline'}

            layer = get_channel_layer()

            async_to_sync(layer.group_send)(
                'lobby', {'type': 'chat_message', 'message': message})

            return Response({'Success': 'Invitation deleted'}, status=status.HTTP_200_OK)

        return Response({'Error': 'Something went wrong'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, format=None):

        token = request.GET.get(self.lookup_url_kwarg4)

        user = self.request.user

        username = UserSerializer(user).data.get('username')

        print(username)

        invitation1 = Invitations.objects.filter(from_token=username)

        invitation2 = Invitations.objects.filter(to_username=username)

        print(len(invitation1))

        print(len(invitation2))

        if(len(invitation1) > 0 or len(invitation2) > 0):
            return Response({'Success': 'OK'}, status=status.HTTP_200_OK)

        return Response({'Success': 'NOK'}, status=status.HTTP_200_OK)


class getUserId(APIView):

    serializer_class = UserSerializer
    lookup_url_kwarg = 'token'

    def get(self, request, format=None):

        token = request.GET.get(self.lookup_url_kwarg)

        user = self.request.user

        data = UserSerializer(user).data

        print(data)

        return Response(data.get('id'), status=status.HTTP_200_OK)


class createChessGame(APIView):
    serializer_class = CreateChessGameSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            gameId = serializer.data.get('gameId')

            result = serializer.data.get('result')

            duration = serializer.data.get('duration')

            game = Game.objects.filter(gameId=gameId)

            chessgame = ChessGame(gameId=game[0],
                                  result=result, duration=duration)

            chessgame.save()

            return Response({'Success': 'ChessGame OK'}, status=status.HTTP_201_CREATED)

        return Response({'Fail': 'Bad game'}, status=status.HTTP_400_BAD_REQUEST)


class chessMove(APIView):
    serializer_class = ChessMoveSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            chessgameId = serializer.data.get('chessgameId')

            source = serializer.data.get('source')

            destination = serializer.data.get('destination')

            piece = serializer.data.get('piece')

            promotion = serializer.data.get('promotion')

            duration = serializer.data.get('duration')

            chess_game = ChessGame.objects.filter(
                gameId=chessgameId)

            chessmove = ChessMove(chessgameId=chess_game[0],
                                  source=source, destination=destination, piece=piece, promotion=promotion, duration=duration)

            chessmove.save()

            return Response({'Success': 'Move OK'}, status=status.HTTP_201_CREATED)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)


class UpdateChessGame(APIView):
    serializer_class = UpdateChessGameSerializer

    def patch(self, request, format=None):

        print("View is called normally.")

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            print('Serializer is valid.')

            gameId = serializer.data.get('gameId')

            result = serializer.data.get('result')

            duration = serializer.data.get('duration')

            queryset = ChessGame.objects.filter(gameId=gameId)

            if not queryset.exists():
                return Response({'msg': 'Chess Game not found.'}, status=status.HTTP_404_NOT_FOUND)

            game = queryset[0]

            game.result = result

            game.save(update_fields=['result'])

            return Response({'Success': 'Game Over Okay'}, status=status.HTTP_200_OK)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)


class getHistory(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'token'

    def get(self, request, format=None):

        game_history = []

        result_history = []

        colors = []

        dict = {}

        list1 = []

        token = request.GET.get(self.lookup_url_kwarg)

        user = self.request.user

        data = UserSerializer(user).data

        id = data.get("id")

        members = Member.objects.filter(memberId=id)

        if(len(members) == 0):
            return Response({'History': 'EMPTY'}, status=status.HTTP_200_OK)

        for member in members:

            gameId = MemberSerializer(member).data.get('gameId')

            print(gameId)

            color = MemberSerializer(member).data.get('startingpiece')

            winner = ChessGame.objects.filter(gameId=gameId)

            if(len(winner) > 0):
                winner = winner[0]

            else:
                continue

            if(CreateChessGameSerializer(winner).data.get("result") == "WHITE"):
                color_check = "w"

            else:
                color_check = "b"

            if(color == color_check):
                result_history.append("W")

                dict[gameId] = ["W", color]

            else:
                result_history.append("L")

                dict[gameId] = ["L", color]

            game_history.append(gameId)

            colors.append(color)

        return Response({'Games': dict}, status=status.HTTP_200_OK)


# make shit for colors and crap
class getMoves(APIView):
    lookup_url_kwarg = 'gameId'

    def get(self, request, format=None):

        move_history = []

        gameId = request.GET.get(self.lookup_url_kwarg)

        moves = ChessMove.objects.filter(chessgameId=gameId)

        if(len(moves) == 0):
            return Response({'Moves': 'EMPTY'}, status=status.HTTP_200_OK)

        for move in moves:

            move = ChessMoveSerializer(move).data

            move_history.append(move)

        return Response({'Moves': move_history}, status=status.HTTP_200_OK)


class ActivationView(APIView):

    lookup_url_kwarg1 = 'id'

    lookup_url_kwarg2 = 'confirmation_token'

    def get(self, request, format=None):

        user_id = request.GET.get(self.lookup_url_kwarg1)

        confirmation_token = request.GET.get(self.lookup_url_kwarg2)

        try:
            user = User.objects.get(id=user_id)

        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is None:
            return Response({'Activation': 'NO'}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, confirmation_token):
            return Response({'Activation': 'Invalid'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = True
        user.save()
        return Response('Email successfully confirmed')
