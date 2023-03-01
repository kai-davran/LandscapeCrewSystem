from django_tenants.utils import tenant_context

class TenantSchemaMixin:
    def save_model(self, request, obj, form, change):
        tenant = getattr(obj, 'tenant', None)
        if tenant:
            with tenant_context(tenant):
                super().save_model(request, obj, form, change)
        else:
            super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        tenant = getattr(obj, 'tenant', None)
        if tenant:
            with tenant_context(tenant):
                super().delete_model(request, obj)
        else:
            super().delete_model(request, obj)
