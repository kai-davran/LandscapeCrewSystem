from django.db import models
from django.contrib.auth.models import AbstractBaseUser, \
    BaseUserManager, PermissionsMixin

from users import utils
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ValidationError
from tenants.models import Business
from rest_framework.authtoken.models import Token

class CrewManager(BaseUserManager):
    def create_crew(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Crew must have an email address')

        business = self.model(email=self.normalize_email(email), **extra_fields)
        business.set_password(password)
        business.save(using=self._db)
        return business


class Crew(AbstractBaseUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    business_id = models.IntegerField(default=0)

    objects = CrewManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def clean(self):
        # Validate that the business ID exists
        if not Business.objects.filter(id=self.business_id).exists():
            raise ValidationError("Business with the given ID does not exist.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Call the clean method to validate before saving
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Crew'
        verbose_name_plural = 'Crews'


class CrewMember(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=20)
    crew = models.ForeignKey(Crew, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ('-id',)
        verbose_name = ("Crew member")
        verbose_name_plural = ("Crew Members")


class CrewToken(models.Model):
    key = models.CharField(max_length=40, primary_key=True, unique=True)
    user = models.ForeignKey('users.Crew', related_name='auth_tokens', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    @staticmethod
    def generate_key():
        from django.utils.crypto import get_random_string
        return get_random_string(40)


class Customers(models.Model):
    """Model for customers"""
    fullname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=20)
    business_id = models.IntegerField(default=0)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    zipcode = models.IntegerField(default=0)
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    status = models.BooleanField(default=False)


    def clean(self):
        # Validate that the business ID exists
        if not Business.objects.filter(id=self.business_id).exists():
            raise ValidationError("Business with the given ID does not exist.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Call the clean method to validate before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return self.fullname

    class Meta:
        ordering = ('-id',)
        verbose_name = ("Customer")
        verbose_name_plural = ("Customers")
