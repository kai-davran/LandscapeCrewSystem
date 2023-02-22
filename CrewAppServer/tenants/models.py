from django.db import models
from django_tenants.models import TenantMixin
from django_tenants.models import DomainMixin
from django.contrib.auth.models import AbstractBaseUser, \
    BaseUserManager, PermissionsMixin
from django.contrib.auth.models import Group, Permission
from django.db import transaction
from django_tenants.utils import schema_context
from django.conf import settings
from rest_framework.authtoken.models import Token as DefaultToken
from django.core.exceptions import ValidationError


def normalize_schema_name(name):
    """Converts a business name into a valid schema name."""
    return name.lower().replace(" ", "_").replace("-", "_")


class Tenant(TenantMixin):
    name = models.CharField(max_length=255)
    created_on = models.DateField(auto_now_add=True)


class Domain(DomainMixin):
    pass


class BusinessManager(BaseUserManager):

    def create_business(self, name, email, password=None, **extra_fields):
        """Creates a new business, with an option to create a tenant and domain."""
        create_tenant = extra_fields.pop('create_tenant', True)

        with transaction.atomic():
            business = self.model(
                email=self.normalize_email(email),
                name=name,
                **extra_fields
            )
            business.set_password(password)
            business.save(using=self._db)
            
            print("I am create_tenant", create_tenant)

            if create_tenant:
                schema_name = normalize_schema_name(name)
                if not schema_name.isidentifier():
                    raise ValidationError("Invalid string used for the schema name.")

                # Create tenant and domain
                tenant = Tenant.objects.create(name=name, schema_name=schema_name)
                business.tenant = tenant
                domain_name = f"{schema_name}.localhost"  # Customize for production
                Domain.objects.create(domain=domain_name, tenant=tenant, is_primary=True)
                tenant.save()
                business.save(using=self._db)
                print("I am created guys")

        return business


    def create_superuser(self, email, password=None,  **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('create_tenant', False) 

        return self.create_business(name='Admin', email=email, password=password, **extra_fields)
    

class Business(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)

    is_staff = models.BooleanField(default=False)  # Add this line
    is_active = models.BooleanField(default=True)

    objects = BusinessManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Business'
        verbose_name_plural = 'Businesses'

    groups = models.ManyToManyField(
        Group,
        verbose_name='user groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="custom_user_set",  # Changed from 'user_set' to 'custom_user_set'
        related_query_name="business_user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user specific permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="business_user_permission",  # Changed from 'user_set' to 'custom_user_set'
        related_query_name="business_user",
    )