from django.urls import path, include
from rest_framework import routers
from alquilapp import views

router = routers.DefaultRouter()
router.register(r'vehiculos', views.VehiculoView, basename='vehiculo')
router.register(r'cancelaciones', views.CancelacionView, basename='cancelacion')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]