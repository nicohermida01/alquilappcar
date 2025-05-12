from django.urls import path, include
from rest_framework import routers
from alquilapp import views

router = routers.DefaultRouter()
router.register(r'vehiculos', views.VehiculoView, basename='vehiculo')
router.register(r'cancelaciones', views.CancelacionView, basename='cancelacion')
router.register(r'admins', views.AdminViewSet, basename='admin')
router.register(r'empleados', views.EmpleadoViewSet, basename='empleado')
router.register(r'sucursales', views.SucursalViewSet, basename='sucursal')
router.register(r'alquileres', AlquilerViewSet, basename='alquiler')
router.register(r'paquetes', PaqueteExtraViewSet, basename='paqueteextra')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]