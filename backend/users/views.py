from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework import status
from django.conf import settings
  
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    passcode = request.data.get("passcode")
    item = UserSerializer(data=request.data)
  
    if not passcode:
        return Response(status=status.HTTP_403_FORBIDDEN, data="Passcode is empty")
    if passcode != settings.USER_REGISTER_CODE:
        return Response(status=status.HTTP_403_FORBIDDEN, data="Passcode is wrong")

    # validating for already existing data
    if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
        raise serializers.ValidationError('Email or Username Exist')
  
    if item.is_valid():
        item.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
