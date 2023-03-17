# users/backends/CrewEmailBackend.py

from django.contrib.auth.backends import ModelBackend
from users.models import Crew

class CrewEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):

        if not hasattr(Crew, 'objects'):
            return None
        try:
            user = Crew.objects.get(email=username)
            if user.check_password(password):
                return user
        except Crew.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Crew.objects.get(pk=user_id)
        except Crew.DoesNotExist:
            return None
