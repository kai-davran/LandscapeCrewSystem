from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Jobs, AssignedJob

@admin.register(Jobs)
class JobsAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'customer', 'crew', 'date', 'frequency', 'status', 'job_type'
    )
    list_filter = ('status', 'job_type', 'frequency', 'date', 'crew')
    search_fields = ('customer__fullname', 'crew__name', 'instructions_for_crew')

@admin.register(AssignedJob)
class AssignedJobAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'job', 'crew', 'start_hour', 'end_hour', 'active'
    )
    list_filter = ('active', 'crew')
    search_fields = ('crew__name', 'job__customer__fullname')