from rest_framework import serializers
from .models import Society, Event, University

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'

class SocietySerializer(serializers.ModelSerializer):
    university = UniversitySerializer()

    class Meta:
        model = Society
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'