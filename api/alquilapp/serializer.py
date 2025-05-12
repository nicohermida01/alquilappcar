from rest_framework import serializers
from .models import Vehiculo, Cancelacion

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'
        read_only_fields = ['id']
    
class CancelacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancelacion
        fields = '__all__'
        read_only_fields = ['id']