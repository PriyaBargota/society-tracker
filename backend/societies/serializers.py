from rest_framework import serializers
from .models import Society, Event

class SocietySerializer(serializers.ModelSerializer):
    class Meta:
        model = Society
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'