from django.contrib import admin
from .models import Proposal, ProposalItem, ServiceItem

class ProposalItemInline(admin.TabularInline):
    model = ProposalItem
    extra = 1

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'customer_email', 'status', 'send_date', 'valid_date')
    list_filter = ('status', 'send_date', 'valid_date')
    search_fields = ('customer__fullname', 'customer_email', 'description')
    inlines = [ProposalItemInline]

@admin.register(ServiceItem)
class ServiceItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_per_unit')
    search_fields = ('name',)

@admin.register(ProposalItem)
class ProposalItemAdmin(admin.ModelAdmin):
    list_display = ('proposal', 'service_item', 'quantity')
    list_filter = ('service_item',)