from django.shortcuts import render
from rest_framework import viewsets
from .models import Society, Event
from .serializers import SocietySerializer, EventSerializer

class SocietyViewSet(viewsets.ModelViewSet):
    queryset = Society.objects.all()
    serializer_class = SocietySerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
