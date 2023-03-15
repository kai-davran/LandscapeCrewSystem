from django.urls import path, include
from users import views
from rest_framework.routers import DefaultRouter

app_name = 'users'

router = DefaultRouter()
router.register(r'crew', views.CrewViewSet)
router.register(r'crewmember', views.CrewMemberViewSet)
router.register(r'customer', views.CustomerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("crew_login/", views.CrewLoginAPI.as_view(), name='crew-login'),

]