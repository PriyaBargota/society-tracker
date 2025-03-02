from django.shortcuts import render
from django.contrib.auth import authenticate, login, get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

# Use get_user_model instead of direct import
User = get_user_model()
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()  # Now this will work correctly
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        # Since your model uses email instead of username
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
