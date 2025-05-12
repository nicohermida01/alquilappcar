from django.db import models
from .managers import ActivosManager
from django.core.exceptions import ValidationError
from django.utils.timezone import now

class PaqueteExtra(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    costo = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.nombre

class Alquiler(models.Model):
    # puede no enviarse la fecha de inicio si resulta que es un alquiler en el momento
    fecha_inicio = models.DateTimeField(default=now)
    fecha_devolucion = models.DateTimeField()
    # campos de prueba
    categoria_vehiculo = models.CharField(max_length=100)
    sucursal_retiro = models.CharField(max_length=100)
    vehiculo_asignado = models.CharField(max_length=50, null=True, blank=True)
    cliente = models.CharField(max_length=100)

    # campos reales
    #categoria_vehiculo = models.ForeignKey('CategoriaVehiculo', on_delete=models.PROTECT)
    #sucursal_retiro = models.ForeignKey('Sucursal', on_delete=models.PROTECT)
    #vehiculo_asignado = models.ForeignKey('Vehiculo', on_delete=models.SET_NULL, null=True, blank=True, to_field='patente')
    #cliente = models.ForeignKey('Cliente', on_delete=models.PROTECT)

    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    activo = models.BooleanField(default=True)

    objects = ActivosManager()  # solo alquileres activos
    todos = models.Manager()    # acceso a todos los alquileres

    @property
    def cantidad_dias_totales(self):
        return (self.fecha_devolucion - self.fecha_inicio).days

    def calcular_precio_total(self):
        dias = self.cantidad_dias_totales
        # campo de prueba hasta que esté la entidad categoria
        costo_categoria = 5000  # valor fijo de prueba
        # cuando esté la entidad va la linea de abajo y no la de arriba.
        # costo_categoria = self.categoria_vehiculo.costo_por_dia
        costo_paquetes = sum([p.paquete.costo for p in self.paquetealquiler_set.all()])
        return (costo_categoria * dias) + costo_paquetes

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # # Validar que fecha_inicio sea al menos mañana
        # if self.fecha_inicio <= now():
        #     raise ValidationError({'fecha_inicio': 'La fecha de inicio debe ser al menos mañana.'})

    def __str__(self):
        if self.fecha_inicio > now().date():
            return f"Reserva de {self.cliente} para el día {self.fecha_inicio}"
        else:
            return f"Alquiler en curso del cliente {self.cliente}"

class PaqueteAlquiler(models.Model):
    alquiler = models.ForeignKey(Alquiler, on_delete=models.CASCADE)
    paquete = models.ForeignKey(PaqueteExtra, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.paquete.nombre} en alquiler {self.alquiler.id}"
