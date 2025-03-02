from django.db import models

class University(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Society(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    university = models.ForeignKey(University, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    society = models.ForeignKey(Society, on_delete=models.CASCADE)

    def __str__(self):
        return self.title