from django.contrib import admin
from .models import Vehiculo, Cliente, Empleado, Sucursal, Localidad, Admin, Alquiler, CategoriaVehiculo, Marca

# Register your models here.
admin.site.register(Vehiculo)
admin.site.register(Cliente)
admin.site.register(Empleado)
admin.site.register(Sucursal)
admin.site.register(Localidad)
admin.site.register(Admin)
admin.site.register(Alquiler)
admin.site.register(CategoriaVehiculo)
admin.site.register(Marca)