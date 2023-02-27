from django.shortcuts import render
from rest_framework import permissions, status, generics, authentication, viewsets

from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.response import Response

from tenants import serializers, models

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

import datetime
from django.contrib import auth
from rest_framework.renderers import JSONRenderer



class BusinessViewSet(viewsets.ModelViewSet):
    """Manage a business"""
    serializer_class = serializers.BusinessSerializer
    queryset = models.Business.objects.all()


class LoginAPI(APIView):
    """Create a new auth token for business user"""
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            info = models.Business.objects.filter(email=user)
            if not info.exists():
                return Response({"error": "User not found"}, status=404)
            userdata = serializers.BusinessSerializer(info, many=True)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, 'data': userdata.data}, status=200)
        return Response(serializer.errors, status=400)


class GetMeView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = serializers.BusinessSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authentication user"""
        return self.request.user