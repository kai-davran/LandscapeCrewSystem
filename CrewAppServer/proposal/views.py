from django.shortcuts import render
from rest_framework import permissions, status, generics, viewsets

from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.response import Response

from proposal import serializers, models
from django.contrib.auth import get_user_model
import datetime
from proposal.email import send_proposal_email

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from proposal.models import Proposal


class ServiceItemViewSet(viewsets.ModelViewSet):
    """Manage a service item"""
    serializer_class = serializers.ServiceItemSerializer
    queryset = models.ServiceItem.objects.all()


class ProposalViewSet(viewsets.ModelViewSet):
    """Manage Proposal"""
    serializer_class = serializers.ProposalSerializer
    queryset = models.Proposal.objects.all()

    def perform_create(self, serializer):
        proposal = serializer.save()
        
        print("I'm working")

        send_proposal_email(proposal)


class ProposalItemViewSet(viewsets.ModelViewSet):
    """Manage Proposal"""
    serializer_class = serializers.ProposalItemSerializer
    queryset = models.ProposalItem.objects.all()


def accept_proposal(request, pk):
    proposal = get_object_or_404(Proposal, pk=pk)
    proposal.status = 2  # Set status to 2 (Accepted)
    proposal.customer.status = True

    print("Proposal", proposal.status)
    print("Proposal customer status", proposal.customer.status)

    proposal.save()
    proposal.customer.save()
    return HttpResponse("Proposal accepted. Thank you!")


def reject_proposal(request, pk):
    proposal = get_object_or_404(Proposal, pk=pk)
    proposal.status = 3  # Set status to 3 (Rejected)
    proposal.save()
    return HttpResponse("Proposal rejected. Thank you for your feedback!")



