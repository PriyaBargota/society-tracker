from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SocietyViewSet, EventViewSet

router = DefaultRouter()
router.register(r'societies', SocietyViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]