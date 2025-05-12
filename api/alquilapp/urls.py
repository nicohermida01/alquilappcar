from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlquilerViewSet, PaqueteExtraViewSet

# Crear un router y registrar el ViewSet
router = DefaultRouter()
router.register(r'alquileres', AlquilerViewSet, basename='alquiler')
router.register(r'paquetes', PaqueteExtraViewSet, basename='paqueteextra')
#router.register(r'paquete-alquileres', PaqueteAlquilerViewSet, basename='paquetealquiler')

# Las URLs del router son automáticamente registradas
urlpatterns = [
    path('api/', include(router.urls)),
]