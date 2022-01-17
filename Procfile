release: python manage.py migrate
web: daphne chat_server.asgi:application --port $PORT --bind 0.0.0.0 -v2
