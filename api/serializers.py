from re import U
from django.contrib.auth import models
from django.db.models import fields
from rest_framework import serializers
from .models import ChessGame, Member, Game, UsersOnline, Invitations, ChessMove
from rest_framework.authtoken.views import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        user = User.objects.create_user(
            validated_data['username'], validated_data['email'], validated_data['password'])

        user.is_active = False

        user.save()

        UsersOnline.objects.create(userId=user)

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

        extra_kwargs = {'password': {
            'write_only': True,
            'required': True
        }}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        UsersOnline.objects.create(userId=user)
        return user
"""


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('id', 'memberId', 'startingpiece', 'creator', 'gameId')


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('game_status', 'gameId')


class UpdateGameSerializer(serializers.ModelSerializer):
    gameId = serializers.CharField(validators=[])

    class Meta:
        model = Game
        fields = ('game_status', 'gameId')


class UsersOnlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersOnline
        fields = ('userId', 'online')


class InvitationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitations
        fields = ('from_token', 'to_username', 'status')


class CreateChessGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChessGame
        fields = ('gameId', 'result', 'duration')


class UpdateChessGameSerializer(serializers.ModelSerializer):
    gameId = serializers.CharField(validators=[])

    class Meta:
        model = ChessGame
        fields = ('gameId', 'result', 'duration')


class ChessMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChessMove
        fields = ('chessgameId', 'source',
                  'destination', 'piece', 'promotion', 'duration')
