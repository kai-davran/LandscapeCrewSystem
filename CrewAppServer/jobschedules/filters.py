import django_filters
from jobschedules.models import Jobs, AssignedJob

class DateRangeFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="date", lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name="date", lookup_expr='lte')
    crew = django_filters.CharFilter('crew')
    date = django_filters.CharFilter('date')

    class Meta:
        model = Jobs
        fields = ['start_date', 'end_date','crew', 'date']


class AssignedJobFilter(django_filters.FilterSet):
    job = django_filters.CharFilter('job')
    crew = django_filters.CharFilter('crew')

    class Meta:
        model = AssignedJob
        fields = ['job', 'crew']
