from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SocietyViewSet, EventViewSet, SocietyDetailView, EventDetailView, SocietyEventsView

router = DefaultRouter()
router.register(r'societies', SocietyViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('society/<int:id>/', SocietyDetailView.as_view(), name='society-detail'),
    path('event/<int:id>/', EventDetailView.as_view(), name='event-detail'),
    path('society/<int:society_id>/events/', SocietyEventsView.as_view(), name='society-events'),
]