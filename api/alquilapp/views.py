from rest_framework import viewsets
from .serializer import ClienteSerializer, CategoriaVehiculoSerializer, VehiculoSerializer, CancelacionSerializer, AdminSerializer, EmpleadoSerializer, SucursalSerializer, AlquilerSerializer, PaqueteAlquilerSerializer, PaqueteExtraSerializer, LocalidadSerializer, MarcaSerializer
from .models import Cliente, CategoriaVehiculo, Vehiculo, Cancelacion, Admin, Empleado, Sucursal, PaqueteExtra, Alquiler, PaqueteAlquiler, Localidad, Marca
from rest_framework.response import Response
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.conf import settings
import jwt

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
    
    def create(self, request):
        if not request.data:
            return Response({"error": "No data provided"}, status=400)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

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
    
    def create(self, request):
        # validar que haya un body en la request
        if not request.data:
            return Response({"error": "No data provided"}, status=400)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
    
class LoginAdminAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)
        
        try:
            employee = Empleado.objects.get(email=email)
        except Empleado.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)

        if not employee.check_password(password):
            return Response({"error": "Invalid email or password"}, status=400)
        
        payload = {
            'empleado_id': employee.id,
            'exp': datetime.now() + timedelta(hours=2), # con esto decimos que el token expira en 2hs
            'iat': datetime.now()
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'accessToken': token, 'empleadoId': employee.id, 'email': employee.email}, status=200)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        try:
            client = Cliente.objects.get(email=email)
        except Cliente.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)
    
        if not client.check_password(password):
            return Response({"error": "Invalid email or password"}, status=400)
        
        # En este punto, el cliente esta bien logeado. Generamos el token -Nico
        payload = {
            'cliente_id': client.id,
            'exp': datetime.now() + timedelta(hours=2), # con esto decimos que el token expira en 2hs
            'iat': datetime.now()
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'accessToken': token, 'clientId': client.id, 'email': client.email}, status=200)