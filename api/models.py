from django.contrib.auth.models import User
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.expressions import F
from rest_framework.authtoken.models import Token
import datetime


class Game(models.Model):
    game_status = models.CharField(max_length=20, default="", unique=False)
    gameId = models.CharField(max_length=50, primary_key=True)


class Member(models.Model):
    startingpiece = models.CharField(max_length=2, unique=False)
    creator = models.BooleanField(default=False)
    gameId = models.ForeignKey(Game, on_delete=CASCADE)
    memberId = models.ForeignKey(User, on_delete=CASCADE)


class UsersOnline(models.Model):
    userId = models.ForeignKey(User, on_delete=CASCADE)
    online = models.BooleanField(default=False)


class Invitations(models.Model):
    from_token = models.CharField(max_length=100, default="", unique=False)
    to_username = models.CharField(max_length=100, default="", unique=False)
    status = models.CharField(max_length=20, unique=False)


class ChessGame(models.Model):
    gameId = models.OneToOneField(Game, primary_key=True, on_delete=CASCADE)
    result = models.CharField(max_length=20, unique=False, default="")
    duration = models.IntegerField(default=0)


class ChessMove(models.Model):
    chessgameId = models.ForeignKey(ChessGame, on_delete=CASCADE)
    source = models.CharField(max_length=20, unique=False, default="")
    destination = models.CharField(max_length=20, unique=False, default="")
    piece = models.CharField(max_length=20, unique=False, default="")
    promotion = models.CharField(max_length=2, unique=False, default="")
    duration = models.IntegerField(default=0)


class LocalFen(models.Model):
    gameId = models.ForeignKey(Game, on_delete=CASCADE)
    fen = models.CharField(max_length=200, unique=False, default="")
    level = models.IntegerField(default=0)
