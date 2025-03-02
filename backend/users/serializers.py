from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User
from societies.models import University

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'university', 'account_type']
        # Exclude sensitive fields like password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'university', 'account_type', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()  # Changed from username to email
    password = serializers.CharField(style={'input_type': 'password'})

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())
    
    class Meta:
        model = User
        fields = ['email', 'name', 'university', 'account_type', 'password', 'password_confirm']
    
    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        # Remove password_confirm from the data
        validated_data.pop('password_confirm', None)
        # Create the user
        user = User.objects.create_user(**validated_data)
        return user