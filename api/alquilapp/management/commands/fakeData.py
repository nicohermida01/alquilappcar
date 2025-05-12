from django.core.management.base import BaseCommand
from alquilapp.models import PaqueteExtra, Alquiler
from faker import Faker
from datetime import timedelta
from django.utils.timezone import now
import random

fake = Faker()

class Command(BaseCommand):
    help = 'Carga datos fake temporales para pruebas en alquileres/paquetealquiler/paquetes. SOLO con campos de prueba'

    def handle(self, *args, **kwargs):
        self.stdout.write("Creando paquetes extra...")
        paquetes = []
        nombres = ['Seguro', 'Asiento Bebé', 'DirecTV', 'Motor V8']
        descripciones = [
            'Cobertura total ante daños o robos.',
            'Asiento adicional para niños pequeños.',
            'Acceso a TV satelital durante el viaje.',
            'Mayor potencia para una experiencia deportiva.'
        ]
        for nombre,descripcion in zip(nombres, descripciones):
            paquete = PaqueteExtra.objects.create(
                nombre=nombre,
                descripcion=descripcion,
                costo=random.randint(1000, 5000)
            )
            paquetes.append(paquete)

        self.stdout.write("Creando alquileres...")
        for _ in range(5):
            fecha_inicio = now() + timedelta(days=random.randint(0, 10), hours=random.randint(0, 23), minutes=random.randint(0, 59))
            # fecha de devolución aleatoria entre 5 y 15 días después del inicio
            fecha_devolucion = fecha_inicio + timedelta(days=random.randint(5, 15), hours=random.randint(0, 23), minutes=random.randint(0, 59))

            alquiler = Alquiler.objects.create(
                fecha_inicio=fecha_inicio,
                fecha_devolucion=fecha_devolucion,
                categoria_vehiculo=fake.random_element(elements=['Económico', 'SUV', 'Camioneta', 'Deportivo']),
                sucursal_retiro=fake.city(),
                vehiculo_asignado=fake.license_plate(),
                cliente=fake.name(),
                precio_total=0 #temporal
            )
            
            paquetes_asignados = random.sample(paquetes, k=random.randint(0, len(paquetes)))
            for paquete in paquetes_asignados:
                alquiler.paquetealquiler_set.create(paquete=paquete)
            alquiler.precio_total = alquiler.calcular_precio_total()
            alquiler.save();
        self.stdout.write(self.style.SUCCESS("Datos cargados correctamente."))
