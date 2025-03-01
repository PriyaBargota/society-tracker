from django.contrib import admin
from .models import Society, Event, University

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')
    search_fields = ('name',)

@admin.register(Society)
class SocietyAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'university')
    search_fields = ('name',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'society', 'date')
    list_filter = ('society', 'date')
    search_fields = ('title', 'description')
