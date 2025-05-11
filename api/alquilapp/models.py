from django.db import models

# Create your models here.
class Vehiculo(models.Model):
    id = models.AutoField(primary_key=True)
    patente = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    año = models.IntegerField()
    localidad = models.CharField(max_length=100)
    max_pasajeros = models.IntegerField()
    #cancelacion = models.ForeignKey('Cancelacion', on_delete=models.CASCADE) AGREGAR AMBOS CUANDO ESTEN LOS MODELOS
    #categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE)
    aptitud_discapacidad = models.BooleanField(default=False)
    precio_dia = models.DecimalField(max_digits=10, decimal_places=2)
    min_dias_alquiler = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.patente} {self.marca} {self.modelo} ({self.año})"