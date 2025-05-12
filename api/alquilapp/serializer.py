from rest_framework import serializers
from .models import Vehiculo, Cancelacion, Admin, Empleado, Sucursal

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

class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # Esto es para que no se muestre la contraseña en la respuesta

    class Meta:
        model = Admin
        fields = '__all__'
        read_only_fields = ['id']

    # Este método se llama cuando se crea un nuevo admin
    # Se encarga de encriptar la contraseña antes de guardarla en la base de datos
    def create(self, validated_data):
        password = validated_data.pop('password') # Se quita la contraseña del diccionario para no guardarla sin encriptar
        admin = Admin(**validated_data) # Se crea el admin sin guardar en la base de datos

        # Se encripta la contraseña y se guarda en la base de datos
        admin.set_password(password) # aplica el hash
        admin.save()
        return admin
    
    # Este método se llama cuando se actualiza un admin
    # Se encarga de encriptar la contraseña antes de guardarla en la base de datos
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None) # Si no se pasa una nueva contraseña, se deja la actual

        # Actualizar los campos del admin
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Si se pasa una nueva contraseña, encriptarla y guardarla
        if password:
            instance.set_password(password) # aplica el hash
        instance.save()
        return instance


class EmpleadoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Empleado
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        password = validated_data.pop('password') 
        empleado = Empleado(**validated_data)
        empleado.set_password(password) 
        empleado.save()
        return empleado
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password) 
        instance.save()
        return instance

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'
        read_only_fields = ['id']