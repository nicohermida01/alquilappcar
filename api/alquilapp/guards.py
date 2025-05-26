from rest_framework.exceptions import AuthenticationFailed
import jwt
from .models import Cliente
from django.conf import settings

# Este guard verifica si en la request hay un access-token -Nico
def is_authenticated(next):
  def wrapper(self, request, *args, **kwargs):
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
      raise AuthenticationFailed('No se ha proporcionado un token de acceso válido.')
    
    token = auth.split(' ')[1]

    try:
      payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
      client = Cliente.objects.get(id=payload['cliente_id'])
      request.client = client  # Agregamos el cliente al request para que pueda ser usado en las vistas -Nico
    except jwt.ExpiredSignatureError:
      raise AuthenticationFailed('El token de acceso ha expirado.')
    except (jwt.DecodeError, Cliente.DoesNotExist):
      raise AuthenticationFailed('Token de acceso inválido.')
    
    return next(self, request, *args, **kwargs)
  
  return wrapper