from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework import status
from django.conf import settings
  
"""
{
"email": "test@gmail.com",
"username": "admin",
"password": "password123",
"is_staff": true
}

"""
@api_view(['GET'])
def ApiOverview(request):
    api_urls = {
        'all_items': '/',
        'Search by Category': '/?category=category_name',
        'Search by Subcategory': '/?subcategory=category_name',
        'Add': '/create',
        'Update': '/update/pk',
        'Delete': '/item/pk/delete'
    }
  
    return Response(api_urls)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def add_items(request):
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
        raise serializers.ValidationError('This data already exists')
  
    if item.is_valid():
        item.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def hello(request):
    content = {'message': 'Hello, World!'}
    return Response(content)