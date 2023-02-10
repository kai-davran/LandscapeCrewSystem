from django.urls import path, include
from proposal import views
from rest_framework.routers import DefaultRouter

app_name = 'proposal'

router = DefaultRouter()
router.register(r'service-item', views.ServiceItemViewSet)
router.register(r'manage-proposals', views.ProposalViewSet)
router.register(r'proposal-item', views.ProposalItemViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('manage-proposals/accept/<int:pk>/', views.accept_proposal, name='accept_proposal'),
    path('proposal/reject/<int:pk>/', views.reject_proposal, name='reject_proposal'),
]