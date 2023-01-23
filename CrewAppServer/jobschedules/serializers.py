from rest_framework import serializers
from .models import Jobs, AssignedJob
from users.serializers import CustomerSerializer, CrewSerializer
from users.models import Customers 


class JobsSerializer(serializers.ModelSerializer):
    gross_revenue = serializers.SerializerMethodField()
    customer_data = CustomerSerializer(source='customer', read_only=True)  # For output

    class Meta:
        model = Jobs
        fields = (
            'id', 'customer', 'customer_data', 'job_location', 'crew', 'date', 'recurring_end_date', 'day_of_week',
            'frequency', 'total_man_hours', 'job_ordering', 'custom_interval_days', 'last_visit_date',
            'gross_revenue', 'instructions_for_crew', 'files', 'proposal',
            'mow', 'edge', 'blow', 'next_visit_date', 'status', 'job_type'
        )
        read_only_fields = ('id', 'next_visit_date', 'gross_revenue', 'customer_data')
    
    def get_gross_revenue(self, obj):
        return obj.calculate_gross_revenue()
    

class AssignedJobSerializer(serializers.ModelSerializer):
    job_data = JobsSerializer(source='job', read_only=True)  # For output
    crew_data = CrewSerializer(source='crew', read_only=True)
    class Meta:
        model = AssignedJob
        fields = (
            'id', 'crew_notes', 'start_hour', 'end_hour', 'mow', 'edge', 'blow', 'job', 'crew', 'total_hours', 
            'job_data', 'crew_data'
            )
        
        read_only_fields = ('id', 'total_hours')
