from rest_framework import viewsets
from .serializer import VehiculoSerializer, CancelacionSerializer, AdminSerializer, EmpleadoSerializer, SucursalSerializer, AlquilerSerializer, PaqueteAlquilerSerializer, PaqueteExtraSerializer
from .models import Vehiculo, Cancelacion, Admin, Empleado, Sucursal, PaqueteExtra, Alquiler, PaqueteAlquiler

# Create your views here.

class AlquilerViewSet(viewsets.ModelViewSet):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer

class PaqueteExtraViewSet(viewsets.ModelViewSet):
    queryset = PaqueteExtra.objects.all()
    serializer_class = PaqueteExtraSerializer

class VehiculoView(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    queryset = Vehiculo.objects.all()

class CancelacionView(viewsets.ModelViewSet):
    serializer_class = CancelacionSerializer
    queryset = Cancelacion.objects.all()

class AdminViewSet(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    queryset = Admin.objects.all()

class EmpleadoViewSet(viewsets.ModelViewSet):
    serializer_class = EmpleadoSerializer
    queryset = Empleado.objects.all()

class SucursalViewSet(viewsets.ModelViewSet):
    serializer_class = SucursalSerializer
    queryset = Sucursal.objects.all()
