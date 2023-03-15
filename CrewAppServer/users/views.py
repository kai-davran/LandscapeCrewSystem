from django.shortcuts import render
from rest_framework import permissions, status, generics, authentication, viewsets

from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.response import Response

from users import serializers, models

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

import datetime
from django.contrib import auth
from rest_framework.renderers import JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import DateRangeFilter



class CrewViewSet(viewsets.ModelViewSet):
    """Manage a crew viewset"""
    serializer_class = serializers.CrewSerializer
    queryset = models.Crew.objects.all()

class CrewMemberViewSet(viewsets.ModelViewSet):
    """Manage a crew member viewset"""
    serializer_class = serializers.CrewMemberSerializer
    queryset = models.CrewMember.objects.all()


class CrewLoginAPI(APIView):
    """Create a new auth token for business user"""
    serializer_class = serializers.CrewLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = serializers.CrewLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Create or retrieve token for the authenticated user
        token, created = models.CrewToken.objects.get_or_create(user=user)

        # Optionally, serialize user data if needed
        user_data = serializers.CrewSerializer(user).data

        return Response({
            'token': token.key,
            'user': user_data
        }, status=200)


class CustomerViewSet(viewsets.ModelViewSet):
    """Manage a customer viewset"""
    serializer_class = serializers.CustomerSerializer
    queryset = models.Customers.objects.all()

    filter_backends = (DjangoFilterBackend,)
    filterset_class = DateRangeFilter