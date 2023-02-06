from django.db import models
import decimal
from users.models import Customers
from django_fsm import FSMIntegerField
from proposal import utils


class ServiceItem(models.Model):
    name = models.CharField(max_length=100)
    price_per_unit = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return f"{self.name} @ {self.price_per_unit}/unit"


class Proposal(models.Model):
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    customer_email = models.EmailField(blank=True, null=True)
    status = FSMIntegerField(choices=utils.ProposalStatus.choices, default=utils.ProposalStatus.PENDING)
    items = models.ManyToManyField(ServiceItem, through='ProposalItem')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Tax rate as a percentage, e.g., 20 for 20%")
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Discount rate as a percentage, e.g., 10 for 10%")
    send_date = models.DateField(help_text="The proposal send date", null=True)
    valid_date = models.DateField(help_text="The proposal valid date", null=True)
    description = models.TextField(blank=True, null=True)


    def total_price_before_tax(self):
        return sum(item.calculate_price() for item in self.proposalitem_set.all())

    def total_tax(self):
        return (self.total_price_before_tax() * self.tax_rate) / 100

    def total_discount(self):
        return (self.total_price_before_tax() * self.discount_percent) / 100

    def total_price_after_discount(self):
        return self.total_price_before_tax() - self.total_discount()

    def total_price(self):
        return self.total_price_after_discount() + self.total_tax()

    def __str__(self):
        return f"Proposal for {self.customer.fullname}"


class ProposalItem(models.Model):
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE)
    service_item = models.ForeignKey(ServiceItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def calculate_price(self):
        return self.quantity * self.service_item.price_per_unit

    def __str__(self):
        return f"{self.quantity} x {self.service_item.name}"