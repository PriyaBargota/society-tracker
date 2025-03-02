from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, name, university, account_type, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            university=university,
            account_type=account_type,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
        
    def create_superuser(self, email, name, university, account_type, password=None):
        user = self.create_user(
            email=email,
            name=name,
            university=university,
            account_type=account_type,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    university = models.ForeignKey('societies.University', on_delete=models.SET_NULL, null=True)
    account_type = models.CharField(max_length=20, choices=[
        ('student', 'Student'),
        ('president', 'Society President'),
    ])
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'university', 'account_type']
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
