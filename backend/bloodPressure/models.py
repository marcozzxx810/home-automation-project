from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class BloodPressureRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    systolic_pressure = models.IntegerField()
    diastolic_pressure = models.IntegerField()
    pulse = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
  
    def __str__(self) -> str:
        return f'SYS : {self.systolic_pressure} DIA: {self.diastolic_pressure}, PUL: {self.pulse}'
