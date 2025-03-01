from django.db import models

# Create your models here.
from django.db import models

class Society(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    society = models.ForeignKey(Society, on_delete=models.CASCADE)

    def __str__(self):
        return self.title