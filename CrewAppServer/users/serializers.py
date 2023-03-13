from rest_framework import serializers, exceptions
from django.contrib.auth import get_user_model, authenticate, password_validation
from rest_framework.response import Response
from users import models

from rest_framework.authtoken.models import Token


class CrewSerializer(serializers.ModelSerializer):
    """Crew account serializer"""
    class Meta:
        model = models.Crew
        fields = ('id','name', 'email', 'phone', 'address', 'logo', 'business_id', 'password')

        read_only_fields = ('id',)
        extra_kwargs = {'password':{'write_only':True},}

    def create(self, validated_data):
        """Create user with encrypted password and return it"""
        user = models.Crew.objects.create_crew(**validated_data)
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

class CrewMemberSerializer(serializers.ModelSerializer):
    crew_data = CrewSerializer(source='crew', read_only=True)  # For output

    """Serializer for Crew members"""
    class Meta:
        model = models.CrewMember
        fields = ('id', 'name', 'email', 'phone', 'crew', 'crew_data')
        read_only_fields = ('id', 'crew_data')


class CrewLoginSerializer(serializers.Serializer):
    """Serializer for login"""
    email = serializers.CharField()
    password = serializers.CharField(
        style = {'input_type':'password'}, trim_whitespace=False
    )

    class Meta:
        model: models.Crew
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
            backend='users.backends.CrewEmailBackend',
            type = 'crew',
        )

        if not user:
            msg = ('Email or Password is incorrect')
            raise serializers.ValidationError({'detail': msg}, code='authorization')

        data['user']= user

        return data


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for customer"""
    class Meta:
        model = models.Customers
        fields = ('id', 'fullname', 'email', 'phone', 'business_id', 'address', 'city',
                  'state', 'zipcode', 'longitude', 'latitude', 'status')