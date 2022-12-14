from django.db.models import fields
from rest_framework import serializers
from django.contrib.auth.models import User

from users.serializers import UserSerializer
from .models import BloodPressureRecord
  
class BloodPressureRecordSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, write_only=True)
    user_id = serializers.IntegerField(write_only=True)

    def create(self, validated_data):
        return BloodPressureRecord.objects.create(**validated_data)

    class Meta:
        model = BloodPressureRecord
        fields = ('id', 'user', 'user_id', 'systolic_pressure', 'diastolic_pressure', 'pulse', 'created_at', 'updated_at')