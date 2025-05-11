from django.urls import path, include
from rest_framework import routers
from alquilapp import views

router = routers.DefaultRouter()
router.register(r'vehiculos', views.VehiculoView, basename='vehiculo')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]