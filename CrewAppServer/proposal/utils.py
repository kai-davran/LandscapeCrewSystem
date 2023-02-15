from django.db import models

class ProposalStatus(models.IntegerChoices):
    PENDING = 1, 'Pending'
    ACCEPTED = 2, 'Accepted'
    REJECTED = 3, 'Rejected'
