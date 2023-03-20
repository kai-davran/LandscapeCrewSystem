from django.contrib import admin

# Register your models here.
from django.contrib import admin
from users import models
# Register your models here.

admin.site.register(models.Customers)
admin.site.register(models.Crew)
admin.site.register(models.CrewMember)