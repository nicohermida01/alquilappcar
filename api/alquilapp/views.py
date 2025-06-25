from rest_framework import viewsets
from .serializer import ClienteSerializer, CategoriaVehiculoSerializer, VehiculoSerializer, CancelacionSerializer, AdminSerializer, EmpleadoSerializer, SucursalSerializer, AlquilerSerializer, PaqueteAlquilerSerializer, PaqueteExtraSerializer, LocalidadSerializer, MarcaSerializer
from .models import Cliente, CategoriaVehiculo, Vehiculo, Cancelacion, Admin, Empleado, Sucursal, PaqueteExtra, Alquiler, PaqueteAlquiler, Localidad, Marca
from rest_framework.response import Response
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.conf import settings
import jwt
from rest_framework.decorators import action
from django.core.mail import send_mail

# Create your views here.

class AlquilerViewSet(viewsets.ModelViewSet):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    
    @action(detail=False, url_path='cliente/(?P<cliente_id>[^/.]+)', methods=['get'])
    def by_client_id(self, request, cliente_id=None):
        alquileres = self.queryset.filter(cliente=cliente_id)
        serializer = self.get_serializer(alquileres, many=True)
        return Response(serializer.data)

class PaqueteExtraViewSet(viewsets.ModelViewSet):
    queryset = PaqueteExtra.objects.all()
    serializer_class = PaqueteExtraSerializer

class VehiculoView(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    queryset = Vehiculo.objects.all()

    @action(detail=False, methods=['get'], url_path='sucursal/(?P<sucursal_id>[^/.]+)/categoria/(?P<category_id>[^/.]+)')
    def getVehiclesBySucursalAndCategoria(self, request, sucursal_id=None, category_id=None):
        # Este método devuelve los vehículos disponibles en una sucursal específica y de una categoría específica 

        vehicles = Vehiculo.objects.filter(sucursal=sucursal_id, categoria=category_id, available=True, activo=True)
        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='availables/(?P<alquiler_id>[^/.]+)')
    def available_vehicles_by_alquiler(self, request, alquiler_id=None):
        # Este método devuelve los vehículos disponibles para un alquiler específico
        # Un vehiculo está disponible para un alquiler si:
        # - La sucursal del vehículo es la misma que la del alquiler
        # - La categoría del vehículo es la misma que la del alquiler
        # - El vehículo no está alquilado actualmente
        # - La cantidad de dias minimos del vehículo es menor o igual a la cantidad de días del alquiler

        alquiler = Alquiler.objects.get(id=alquiler_id)

        rental_days = (alquiler.fecha_devolucion - alquiler.fecha_inicio).days

        vehicles = Vehiculo.objects.filter(
            sucursal=alquiler.sucursal_retiro,
            categoria=alquiler.categoria_vehiculo,
            available=True,
            activo=True,
            min_dias_alquiler__lte=rental_days # __lte permite a django filtrar por "menor o igual que" -Nico
        )

        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data)


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

    @action(detail=False, methods=['get'])
    def populated(self, request):
        # El decorador @action permite crear una ruta personalizada dentro del ViewSet
        # En este caso, creamos una ruta /sucursal/populated que devuelve las sucursales con sus localidades
        # El método detail=False indica que esta acción no requiere un ID de instancia, es decir, es una acción a nivel de colección
        # -Nico

        sucursales = self.get_queryset().select_related('localidad')
        data = []
        for sucursal in sucursales:
            item = self.get_serializer(sucursal).data
            if hasattr(sucursal, 'localidad') and sucursal.localidad:
                item['localidad'] = LocalidadSerializer(sucursal.localidad).data
            data.append(item)
        return Response(data)

    @action(detail=False, methods=['get'])
    def populated_activas(self, request):
        sucursales = self.get_queryset().filter(activo=True).select_related('localidad')
        data = []
        for sucursal in sucursales:
            item = self.get_serializer(sucursal).data
            if hasattr(sucursal, 'localidad') and sucursal.localidad:
                item['localidad'] = LocalidadSerializer(sucursal.localidad).data
            data.append(item)
        return Response(data)

class LocalidadViewSet(viewsets.ModelViewSet):
    serializer_class = LocalidadSerializer
    queryset = Localidad.objects.all()

class CategoriaVehiculoViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaVehiculoSerializer
    queryset = CategoriaVehiculo.objects.all()

class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    queryset = Cliente.objects.all()
    
    #def create(self, request):
    #    serializer = self.get_serializer(data=request.data)
    #    serializer.is_valid(raise_exception=True)
    #    serializer.save()
    #    return Response(serializer.data, status=201)
    
class LoginAdminAPIView(APIView):
    # Esta view maneja el login en la app admin -Nico

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)
        
        try:
            user = Empleado.objects.get(email=email)
            isAdmin = False
        except Empleado.DoesNotExist:
            user = Admin.objects.get(email=email)
            isAdmin = True
        except Admin.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)
        
        # En este punto, el user logeado es un empleado o un admin.

        if not user.password == password:
            return Response({"error": "Invalid email or password"}, status=400)

        if isAdmin:
            # si es admin, enviamos el codigo de verificacion de dos factores
            self.sendTwoFactorCode(user.email)
            return Response({"status": "pending", "userId": user.id}, status=200)

        if not isAdmin:
            payload = {
                'user_id': user.id,
                'exp': datetime.now() + timedelta(hours=2), # con esto decimos que el token expira en 2hs
                'iat': datetime.now()
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            return Response({'accessToken': token, 'userId': user.id, 'email': user.email, 'isAdmin': isAdmin}, status=200)
    
    def sendTwoFactorCode(self, email):
        # Esta función enviaría un código de verificación al admin por email 
        subject = "AlquillappCar - Doble Factor de Autenticación"
        message = "Tu código de autenticación es: 123456"
        from_email = "no-reply@alquilappcar.com"
        recipient_emails = [email]

        try:
            send_mail(
                subject,
                message,
                from_email,
                recipient_emails,
                fail_silently=False
            )
        except Exception as e:
            print(f"Error sending email: {e}")
            
        return

class Confirm2FAAPIView(APIView):
    def post(self, request, id):
        code2FA = request.data.get('code2FA')

        if not code2FA:
            return Response({"error": "2FA code is required"}, status=400)

        if (not code2FA == '123456'):
            return Response({"error": "Invalid 2FA code"}, status=400)

        try:
            admin = Admin.objects.get(id=id)
        except Admin.DoesNotExist:
            return Response({"error": "Invalid id"}, status=400)
        
        payload = {
            'user_id': admin.id,
            'exp': datetime.now() + timedelta(hours=2), # con esto decimos que el token expira en 2hs
            'iat': datetime.now()
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return Response({'accessToken': token, 'userId': admin.id, 'email': admin.email, 'isAdmin': True}, status=200)


class LoginAPIView(APIView):
    # Esta view maneja el login en la app cliente -Nico

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        try:
            client = Cliente.objects.get(email=email)
        except Cliente.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)
    
        if not client.password == password:
            return Response({"error": "Invalid email or password"}, status=400)
        
        # En este punto, el cliente esta bien logeado. Generamos el token -Nico
        payload = {
            'cliente_id': client.id,
            'exp': datetime.now() + timedelta(hours=2), # con esto decimos que el token expira en 2hs
            'iat': datetime.now()
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'accessToken': token, 'clientId': client.id, 'email': client.email}, status=200)
