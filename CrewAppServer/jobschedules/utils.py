from django.db import models

class JobStatus(models.IntegerChoices):
    SCHEDULED = 1, 'Sheduled'
    UNSCHEDULED = 2, 'Unscheduled'
    INPROGRESS = 3, 'In progress'
    DONE = 4, 'Done'


class JobType(models.IntegerChoices):
    RECURRING = 1, 'Recurring Job'
    ONETIME = 2, 'One Time job'