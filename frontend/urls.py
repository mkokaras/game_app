
from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('register', index),
    path('login', index),
    path('loby', index),
    path('chess/<str:id>', index),
    path('history', index),
    path('moves/<str:id>', index),
    path('activation/<int:id>/<str:token>', index)

    #path('game/<str:id>', index)
]
