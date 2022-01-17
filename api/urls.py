from django.urls import path, include
from .views import ActivationView, LoginAPI, MemberView, GameView, RegisterAPI, UpdateGame, UserAPI, chessMove, createChessGame, getCreator, getGame, getHistory, getMoves, getUserId, getUsername, getOnlineUsers, setInvitations, updateInvitation, UpdateChessGame, getUserByToken
from rest_framework.routers import DefaultRouter
#from .views import UserViewSet
from rest_framework.authtoken.views import obtain_auth_token
from knox import views as knox_views

urlpatterns = [
    path('get-knox-user', getUserByToken.as_view()),
    path('member', MemberView.as_view()),
    path('game', GameView.as_view()),
    path('get-game', getGame.as_view()),
    path('get-creator', getCreator.as_view()),
    path('update-game', UpdateGame.as_view()),
    path('get-username', getUsername.as_view()),
    path('get-online-users', getOnlineUsers.as_view()),
    path('set-invite', setInvitations.as_view()),
    path('get-user-id', getUserId.as_view()),
    path('update-invitation', updateInvitation.as_view()),
    path('start-chess-game', createChessGame.as_view()),
    path('chess-move', chessMove.as_view()),
    path('update-chess-game', UpdateChessGame.as_view()),
    path('get-history', getHistory.as_view()),
    path('get-moves', getMoves.as_view()),
    path('auth', include('knox.urls')),
    path('auth/register', RegisterAPI.as_view()),
    path('auth/login', LoginAPI.as_view()),
    path('auth/user', UserAPI.as_view()),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('activation', ActivationView.as_view())
]
