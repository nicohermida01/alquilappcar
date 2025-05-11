from rest_framework import viewsets
from .serializer import VehiculoSerializer, CancelacionSerializer
from .models import Vehiculo, Cancelacion

# Create your views here.

class VehiculoView(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    queryset = Vehiculo.objects.all()

class CancelacionView(viewsets.ModelViewSet):
    serializer_class = CancelacionSerializer
    queryset = Cancelacion.objects.all()