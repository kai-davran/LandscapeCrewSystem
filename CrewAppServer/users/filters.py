import django_filters
from users.models import Customers  

class DateRangeFilter(django_filters.FilterSet):
    status = django_filters.CharFilter('status')

    class Meta:
        model = Customers
        fields = ['status']
