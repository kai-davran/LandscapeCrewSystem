from rest_framework import serializers
from proposal.models import ServiceItem, ProposalItem, Proposal
from users.serializers import CustomerSerializer

class ServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceItem
        fields = ('id', 'name', 'price_per_unit', 'description')
        read_only_fields = ('id',)


class ProposalItemSerializer(serializers.ModelSerializer):
    service_item_data = ServiceItemSerializer(source='service_item', read_only=True)

    class Meta:
        model = ProposalItem
        fields = ('id', 'service_item', 'service_item_data', 'quantity')


class ProposalSerializer(serializers.ModelSerializer):
    items = ProposalItemSerializer(many=True, required=False, allow_null=True, source='proposalitem_set')
    customer_data = CustomerSerializer(source='customer', read_only=True)

    class Meta:
        model = Proposal
        fields = ('id', 'customer', 'customer_email', 'customer_data', 'status', 'items', 'tax_rate', 'discount_percent', 'send_date', 'valid_date', 'description')
        read_only_fields = ('id', 'customer_data')

    def create(self, validated_data):
        items_data = validated_data.pop('proposalitem_set')
        proposal = Proposal.objects.create(**validated_data)
        for item_data in items_data:
            ProposalItem.objects.create(proposal=proposal, **item_data)
        return proposal

    def update(self, instance, validated_data):
        items_data = validated_data.pop('proposalitem_set', [])
        instance.customer = validated_data.get('customer', instance.customer)
        instance.customer_email = validated_data.get('customer_email', instance.customer_email)
        instance.send_date = validated_data.get('send_date', instance.send_date)
        instance.valid_date = validated_data.get('valid_date', instance.valid_date)
        instance.description = validated_data.get('description', instance.description)
        instance.tax_rate = validated_data.get('tax_rate', instance.tax_rate)
        instance.discount_percent = validated_data.get('discount_percent', instance.discount_percent)
        instance.save()

        # Update items
        existing_items = {item.id: item for item in instance.proposalitem_set.all()}
        for item_data in items_data:
            if 'id' in item_data and item_data['id'] in existing_items:
                item = existing_items[item_data['id']]
                item.quantity = item_data.get('quantity', item.quantity)
                item.service_item = item_data.get('service_item', item.service_item)
                item.save()
            else:
                ProposalItem.objects.create(proposal=instance, **item_data)
        return instance
