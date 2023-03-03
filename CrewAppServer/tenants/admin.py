from django.contrib import admin
from tenants import models
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .mixins import TenantSchemaMixin  # Assuming you saved the mixin in mixins.py

from django.utils.translation import gettext as _


class BusinessAdmin(TenantSchemaMixin, admin.ModelAdmin):
    ordering = ['id']
    list_display = ['name', 'email', 'tenant']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('name', 'phone', 'address', 'logo')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),

    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('name', 'password1', 'password2')
        }),
    )

    list_filter = ('is_superuser',)  # Adjust this based on actual fields in your model


admin.site.register(models.Tenant)
admin.site.register(models.Domain)
admin.site.register(models.Business, BusinessAdmin)