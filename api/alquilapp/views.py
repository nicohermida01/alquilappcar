from rest_framework import viewsets
from .serializer import ClienteSerializer, CategoriaVehiculoSerializer, VehiculoSerializer, CancelacionSerializer, AdminSerializer, EmpleadoSerializer, SucursalSerializer, AlquilerSerializer, PaqueteAlquilerSerializer, PaqueteExtraSerializer, LocalidadSerializer, MarcaSerializer
from .models import Cliente, CategoriaVehiculo, Vehiculo, Cancelacion, Admin, Empleado, Sucursal, PaqueteExtra, Alquiler, PaqueteAlquiler, Localidad, Marca

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

class MarcaView(viewsets.ModelViewSet):
    serializer_class = MarcaSerializer
    queryset = Marca.objects.all()

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

class LocalidadViewSet(viewsets.ModelViewSet):
    serializer_class = LocalidadSerializer
    queryset = Localidad.objects.all()

class CategoriaVehiculoViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaVehiculoSerializer
    queryset = CategoriaVehiculo.objects.all()

class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    queryset = Cliente.objects.all()
