from django.shortcuts import render
from django.views import View
# Create your views here.
from django.http import HttpResponse, HttpResponseNotFound
import os


def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')


# Add this CBV
class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()
