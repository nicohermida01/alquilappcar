from django.contrib import admin
from .models import Vehiculo, Cliente, Empleado, Sucursal, Localidad, Admin

# Register your models here.
admin.site.register(Vehiculo)
admin.site.register(Cliente)
admin.site.register(Empleado)
admin.site.register(Sucursal)
admin.site.register(Localidad)
admin.site.register(Admin)