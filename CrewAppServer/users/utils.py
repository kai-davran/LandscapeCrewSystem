from django.db import models

class UserTypes(models.IntegerChoices):
    BUSINESS = 1, 'Business'
    CREW = 2, 'Crew'