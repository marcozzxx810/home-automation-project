from django.urls import path
from . import views

urlpatterns = [
      path('', views.view_blood_pressure_record, name='add-items'),
]