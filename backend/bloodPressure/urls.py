from django.urls import path
from . import views

urlpatterns = [
      path('', views.view_blood_pressure_record, name='bp'),
      path('prefilling/', views.prefilling_blood_pressure, name='prefilling')

]