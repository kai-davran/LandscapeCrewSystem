from rest_framework import serializers, exceptions
from django.contrib.auth import get_user_model, authenticate, password_validation
from rest_framework.response import Response
from tenants import models

from rest_framework.authtoken.models import Token


class BusinessSerializer(serializers.ModelSerializer):
    """Business account serializer"""
    class Meta:
        model = models.Business
        fields = ('id','name', 'email', 'phone', 'address', 'logo', 'password')

        read_only_fields = ('id',)
        extra_kwargs = {'password':{'write_only':True},}

    def create(self, validated_data):
        """Create user with encrypted password and return it"""
        user = models.Business.objects.create_business(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for login"""
    email = serializers.CharField()
    password = serializers.CharField(
        style = {'input_type':'password'}, trim_whitespace=False
    )

    class Meta:
        model: models.Business
        fields = ('email', 'password')


    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email is None:
            raise serializers.ValidationError(
                'A email is required to log in.'
            )
        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        user = authenticate(
            request = self.context.get('request'),
            username=email,
            password=password,
            type = 'business',
        )

        if not user:
            msg = ('Email or Password is incorrect')
            raise serializers.ValidationError({'detail': msg}, code='authorization')

        data['user']= user

        return data