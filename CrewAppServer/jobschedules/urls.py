from django.urls import path, include
from jobschedules import views, chatbot_langchain
from rest_framework.routers import DefaultRouter

app_name = 'jobschedules'

router = DefaultRouter()
router.register(r'jobs', views.JobsViewSet)
router.register(r'assignedjobs', views.AssignedJobViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('chatbot_langchain/', chatbot_langchain.chatbot_view, name='chatbot_langchain')  # Ensure the correct import and path

]