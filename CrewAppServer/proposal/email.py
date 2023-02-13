from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from proposal.models import ProposalItem

def send_proposal_email(proposal):
    try:
        subject = 'Proposal from GreenSchedule'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = proposal.customer_email

        # Fetch proposal items separately
        proposal_items = ProposalItem.objects.filter(proposal=proposal)

        context = {
            'proposal': proposal,
            'proposal_items': proposal_items,
            'company_name': 'GreenSchedule',
            'company_phone': '(123) 456-7890',
            'company_email': 'info@greenschedule.com'
        }

        message = render_to_string('proposal_email.html', context)
        email = EmailMessage(subject, message, from_email, [to_email])
        email.content_subtype = 'html'
        email.send()
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")
