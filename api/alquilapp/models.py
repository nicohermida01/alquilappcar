from django.db import models
from .managers import ActivosManager
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

class PaqueteExtra(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    costo = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.nombre

class Alquiler(models.Model):
    class AlquilerStatus(models.TextChoices):
        PENDING = 'pending', 'Pendiente'
        IN_PROGRESS = 'in_progress', 'En Progreso'
        FINISHED = 'finished', 'Finalizado'
        CANCELED = 'canceled', 'Cancelado'
        DELETED = 'deleted', 'Eliminado'

    # puede no enviarse la fecha de inicio si resulta que es un alquiler en el momento
    fecha_inicio = models.DateTimeField(default=now)
    fecha_devolucion = models.DateTimeField()
    fecha_registro = models.DateTimeField(auto_now_add=True) # auto_now_add=True setea la fecha y hora actual al crear el objeto -Nico
    categoria_vehiculo = models.ForeignKey('CategoriaVehiculo', on_delete=models.PROTECT, null=False)
    sucursal_retiro = models.ForeignKey('Sucursal', on_delete=models.PROTECT)
    vehiculo_asignado = models.ForeignKey('Vehiculo', on_delete=models.SET_NULL, null=True, blank=True)
    cliente = models.ForeignKey('Cliente', on_delete=models.PROTECT)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    activo = models.BooleanField(default=True) # este campo ya no se debe usar, lo dejo por las dudas -Nico
    status = models.CharField(max_length=20, choices=AlquilerStatus.choices, default=AlquilerStatus.PENDING)
    reembolso = models.DecimalField(max_digits=20, decimal_places=2, default=-1) # reembolso por cancelacion, si es -1 no se ha reembolsado nada
    montoExtra = models.DecimalField(max_digits=20, decimal_places=2, default=-1) # monto extra por dias adicionales, si es -1 no se ha cobrado nada
    montoDevuelto = models.DecimalField(max_digits=20, decimal_places=2, default=-1) # monto devuelto al cliente por dias que no se usaron, si es -1 no se ha devuelto nada

    objects = ActivosManager()  # solo alquileres activos
    todos = models.Manager()    # acceso a todos los alquileres

    @property
    def cantidad_dias_totales(self):
        return (self.fecha_devolucion - self.fecha_inicio).days
        # # Validar que fecha_inicio sea al menos mañana
        # if self.fecha_inicio <= now():
        #     raise ValidationError({'fecha_inicio': 'La fecha de inicio debe ser al menos mañana.'})

    
    #def __str__(self):
    #    if self.fecha_inicio > now().date():
    #        return f"Reserva de {self.cliente} para el día {self.fecha_inicio}"
    #    else:
    #        return f"Alquiler en curso del cliente {self.cliente}"
    
    def __str__(self):
        return f"{self.id}"

class PaqueteAlquiler(models.Model):
    alquiler = models.ForeignKey(Alquiler, on_delete=models.CASCADE)
    paquete = models.ForeignKey(PaqueteExtra, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.paquete.nombre} en alquiler {self.alquiler.id}"

class Vehiculo(models.Model):
    id = models.AutoField(primary_key=True)
    patente = models.CharField(max_length=10, unique=True)
    modelo = models.CharField(max_length=100)
    año = models.IntegerField()
    max_pasajeros = models.IntegerField()
    aptitud_discapacidad = models.BooleanField(default=False)
    min_dias_alquiler = models.IntegerField(default=1)
    available = models.BooleanField(default=True) 
    activo = models.BooleanField(default=True, null=False)
    marca = models.ForeignKey('Marca', on_delete=models.CASCADE)
    sucursal = models.ForeignKey('Sucursal', on_delete=models.CASCADE, null=True, blank=True)

    categoria = models.ForeignKey('CategoriaVehiculo', on_delete=models.CASCADE, default=0)

    def __str__(self):
        return f"{self.patente} {self.marca} {self.modelo} ({self.año})"
    
class Marca(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre}"
    
class Cancelacion(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.descripcion} ({self.porcentaje}%)"

class Admin(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    #def set_password(self, password):
    #    self.password = make_password(password)
    #    self.save()

    def check_password(self, inputPassword):
        return check_password(inputPassword, self.password)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.email})"
    
    def get_by_email(request, email):
        admin = get_object_or_404(Admin, email=email)
        data = {
            "id": admin.id,
            "email": admin.email,
            "password": admin.password
        }

        return JsonResponse(data)

class Empleado(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    dni = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=100)
    sucursal = models.ForeignKey('Sucursal', on_delete=models.CASCADE)
    activo = models.BooleanField(default=True, null=False)

    def __str__(self):
        return f"{self.nombre} {self.apellido} {self.dni}"
    
    #def set_password(self, password):
    #    self.password = make_password(password)
    #    self.save()

    #def check_password(self, inputPassword):
    #    return check_password(inputPassword, self.password)

    def get_by_email(request, email):
        employee = get_object_or_404(Empleado, email=email)
        data = {
            "id": employee.id,
            "email": employee.email,
            "password": employee.password
        }

        return JsonResponse(data)

class Sucursal(models.Model):
    id = models.AutoField(primary_key=True)
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey('Localidad', on_delete=models.CASCADE, default=1)
    activo = models.BooleanField(default=True, null=False)

    def __str__(self):
        return f"{self.direccion} + ({self.localidad})"
    
class Localidad(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.nombre}"
    
class CategoriaVehiculo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=32)
    precio = models.DecimalField(max_digits=7, decimal_places=2)

    #FK a tabla de cancelacion, notar que puse default=1 para que no rompa la base de datos
    cancelacion = models.ForeignKey('Cancelacion', on_delete=models.CASCADE, default=1) 

    def __str__(self):
        return f"{self.nombre}"
# TODO: Ver modelo Alquiler que requiere algo de aca. En base al precio de la categoria, calcula el precio del alquiler.
#       En la funcion calcular_precio_total, esta comentado "costo_categoria = self.categoria_vehiculo.costo_por_dia".
#       Hay que sacar el campo precio de esta entidad pero no se como se hace. ENVIEN APOYO. -Valen
    
class Cliente(models.Model):
    apellido = models.CharField(max_length=16)
    nombre = models.CharField(max_length=16)
    dni = models.IntegerField(unique=True)
    fecha_de_nacimiento = models.DateField()
    contacto = models.CharField(max_length=64, blank=True, null=True)
    activo = models.BooleanField(default=True, null=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.dni})" # Esto solo se usa para mostrar en el admin, no es tan importante -Nico
    
    
    #def set_password(self, password):
        # Este método se usa para encriptar la contraseña antes de guardarla en la base de datos -Nico
    #    self.password = make_password(password)
    #    self.save()

    #def check_password(self, inputPassword):
        # Este método se usa para verificar la contraseña ingresada por el cliente -Nico
        #return check_password(inputPassword, self.password)

    def get_by_email(request, email):
        client = get_object_or_404(Cliente, email=email)
        data = {
            "id": client.id,
            "email": client.email,
            "password": client.password
        }

        return JsonResponse(data)
