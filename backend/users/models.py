from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    university_email = models.EmailField(unique=True)
    # Add other custom fields if needed

    def __str__(self):
        return self.university_email
