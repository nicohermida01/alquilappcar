from rest_framework import serializers
from .models import Cliente, Vehiculo, Cancelacion, Admin, Empleado, Sucursal, Alquiler, PaqueteExtra, PaqueteAlquiler, Localidad, CategoriaVehiculo, Marca
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

    paquetes = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False)
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
            'paquetes', # campo virtual para crear relaciones
            'paquetealquiler_set',  # campo real que devuelve los relacionados
        ]
        read_only_fields = ['cantidad_dias_totales', 'activo', 'paquetealquiler_set']
        
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

    def create(self, validated_data):
        paquetes_ids = validated_data.pop('paquetes', [])
        alquiler = Alquiler.objects.create(**validated_data)

        for paquete_id in paquetes_ids:
            PaqueteAlquiler.objects.create(alquiler=alquiler, paquete_id=paquete_id)

        return alquiler

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'
        read_only_fields = ['id']

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
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
        employee = Empleado(**validated_data)
        employee.set_password(password) 
        employee.save()
        return employee

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'
        read_only_fields = ['id']

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'
        read_only_fields = ['id']

class CategoriaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaVehiculo
        fields = '__all__'
        read_only_fields = ['id']

class ClienteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = []

    def create(self, validated_data):
        password = validated_data.pop('password')
        cliente = Cliente(**validated_data)
        cliente.set_password(password)
        cliente.save()

        return cliente

    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password) 

        instance.save()

        return instance
# TODO: Creo que hay que tocar una cosa mas con el tema del email. Hay que ver que no este registrado.
#       No se si se hace aca o en otro lado. -Valen
