from django.urls import path, include
from tenants import views
from rest_framework.routers import DefaultRouter

app_name = 'tenants'

router = DefaultRouter()
router.register(r'manage_business', views.BusinessViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path("login/", views.LoginAPI.as_view()),
    path('get-me/', views.GetMeView.as_view()),
]