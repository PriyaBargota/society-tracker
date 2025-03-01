from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.response import Response
from .models import Society, Event
from .serializers import SocietySerializer, EventSerializer

class SocietyViewSet(viewsets.ModelViewSet):
    queryset = Society.objects.all()
    serializer_class = SocietySerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class SocietyDetailView(generics.RetrieveAPIView):
    queryset = Society.objects.all()
    serializer_class = SocietySerializer
    lookup_field = 'id'

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'

class SocietyEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        society_id = self.kwargs.get('society_id')
        return Event.objects.filter(society_id=society_id).order_by('date')
