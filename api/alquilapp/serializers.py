from rest_framework import serializers
from .models import Alquiler, PaqueteExtra, PaqueteAlquiler
from django.utils.timezone import now
from datetime import timedelta

class PaqueteExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaqueteExtra
        fields = '__all__'


class PaqueteAlquilerSerializer(serializers.ModelSerializer):
    paquete = PaqueteExtraSerializer(read_only=True)
    paquete_id = serializers.PrimaryKeyRelatedField(
        queryset=PaqueteExtra.objects.all(), source='paquete', write_only=True
    )

    class Meta:
        model = PaqueteAlquiler
        fields = ['id', 'alquiler', 'paquete', 'paquete_id']


class AlquilerSerializer(serializers.ModelSerializer):
    paquetealquiler_set = PaqueteAlquilerSerializer(many=True, read_only=True)

    class Meta:
        model = Alquiler
        # no se si vayan todos o haya que especificar alguno que no, en todo caso se reemplaza con __all__
        fields = [
            'id',
            'fecha_inicio',
            'fecha_devolucion',
            'cantidad_dias_totales',
            'categoria_vehiculo',
            'sucursal_retiro',
            'vehiculo_asignado',
            'precio_total',
            'cliente',
            'paquetealquiler_set',
            'activo'
        ]
        read_only_fields = ['cantidad_dias_totales', 'precio_total']
        
    def validate(self, data):
        fecha_inicio = data.get('fecha_inicio')
        fecha_devolucion = data.get('fecha_devolucion')

        if fecha_inicio and fecha_inicio <= now() - timedelta(minutes=1):
            raise serializers.ValidationError({
                'fecha_inicio': 'La fecha de inicio debe ser igual o posterior al momento actual.'
            })

        if fecha_inicio and fecha_devolucion and fecha_devolucion <= fecha_inicio:
            raise serializers.ValidationError({
                'fecha_devolucion': 'La fecha de devolución debe ser posterior a la fecha de inicio.'
            })
        return data