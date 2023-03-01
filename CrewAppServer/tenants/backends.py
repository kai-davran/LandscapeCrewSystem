# tenants/backends/EmailBackend.py

from django.contrib.auth.backends import ModelBackend
from tenants.models import Business

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not hasattr(Business, 'objects'):
            return None
        try:
            user = Business.objects.get(email=username)
            if user.check_password(password):
                return user
        except Business.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Business.objects.get(pk=user_id)
        except Business.DoesNotExist:
            return None
