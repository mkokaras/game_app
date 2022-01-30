# Generated by Django 3.2.8 on 2022-01-30 23:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('game_status', models.CharField(default='', max_length=20)),
                ('gameId', models.CharField(max_length=50, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Invitations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_token', models.CharField(default='', max_length=100)),
                ('to_username', models.CharField(default='', max_length=100)),
                ('status', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='ChessGame',
            fields=[
                ('gameId', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='api.game')),
                ('result', models.CharField(default='', max_length=20)),
                ('duration', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='UsersOnline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('online', models.BooleanField(default=False)),
                ('userId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startingpiece', models.CharField(max_length=2)),
                ('creator', models.BooleanField(default=False)),
                ('gameId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.game')),
                ('memberId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LocalFen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fen', models.CharField(default='', max_length=200)),
                ('level', models.IntegerField(default=0)),
                ('gameId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.game')),
            ],
        ),
        migrations.CreateModel(
            name='ChessMove',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source', models.CharField(default='', max_length=20)),
                ('destination', models.CharField(default='', max_length=20)),
                ('piece', models.CharField(default='', max_length=20)),
                ('promotion', models.CharField(default='', max_length=2)),
                ('duration', models.IntegerField(default=0)),
                ('chessgameId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.chessgame')),
            ],
        ),
    ]
