from rest_framework import serializers
from bloodPressure.models import BloodPressureRecord
from bloodPressure.serializers import BloodPressureRecordSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.contrib.auth.models import User

"""
{
"systolic_pressure": 120,
"diastolic_pressure": 77,
"pulse": 90
}

"""

# Create your views here.
@api_view(['POST', 'GET'])
def view_blood_pressure_record(request):

    if request.method == "POST":
        data = {
            **request.data,
            'user_id': request.user.id
        }

        bp_reocord = BloodPressureRecordSerializer(data=data)

        if bp_reocord.is_valid():
            bp_reocord.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(bp_reocord.errors)
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == "GET":
        # checking for the parameters from the URL
        if request.query_params:
            bp_reocords = BloodPressureRecord.objects.filter(**request.query_param.dict())
        else:
            bp_reocords = BloodPressureRecord.objects.filter(user__id=request.user.id)
    
        # if there is something in items else raise error
        if bp_reocords:
            data = BloodPressureRecordSerializer(bp_reocords, many=True)
            return Response(data.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    