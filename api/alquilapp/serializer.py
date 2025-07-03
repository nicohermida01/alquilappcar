from rest_framework import serializers
from .models import Cliente, Vehiculo, Cancelacion, Admin, Empleado, Sucursal, Alquiler, PaqueteExtra, PaqueteAlquiler, Localidad, CategoriaVehiculo, Marca
from django.utils.timezone import now
from datetime import timedelta
from .managers import ActivosManager

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

class CategoriaVehiculoSerializer(serializers.ModelSerializer):
    cancelacion = CancelacionSerializer(read_only=True)
    cancelacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Cancelacion.objects.all(), source='cancelacion', write_only=True
    )
    
    class Meta:
        model = CategoriaVehiculo
        fields = '__all__'
        read_only_fields = ['id']

class VehiculoSerializer(serializers.ModelSerializer):
    marca = MarcaSerializer(read_only=True)
    marca_id = serializers.PrimaryKeyRelatedField(
        queryset=Marca.objects.all(), source='marca', write_only=True
    )
    categoria = CategoriaVehiculoSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaVehiculo.objects.all(), source='categoria', write_only=True
    )

    class Meta:
        model = Vehiculo
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
        #password = validated_data.pop('password') # Se quita la contraseña del diccionario para no guardarla sin encriptar
        admin = Admin(**validated_data) # Se crea el admin sin guardar en la base de datos

        # Se encripta la contraseña y se guarda en la base de datos
        #admin.set_password(password) # aplica el hash
        admin.save()

        return admin
    
    # Este método se llama cuando se actualiza un admin
    # Se encarga de encriptar la contraseña antes de guardarla en la base de datos
    def update(self, instance, validated_data):
        #password = validated_data.pop('password', None) # Si no se pasa una nueva contraseña, se deja la actual

        # Actualizar los campos del admin
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Si se pasa una nueva contraseña, encriptarla y guardarla
        #if password:
        #    instance.set_password(password) # aplica el hash
        
        instance.save()
        
        return instance


class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'
        read_only_fields = ['id']

class SucursalSerializer(serializers.ModelSerializer):
    localidad = LocalidadSerializer(read_only=True)
    localidad_id = serializers.PrimaryKeyRelatedField(
        queryset=Localidad.objects.all(), source='localidad', write_only=True
    )

    class Meta:
        model = Sucursal
        fields = '__all__'
        read_only_fields = ['id']

class EmpleadoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    sucursal = SucursalSerializer(read_only=True)
    sucursal_id = serializers.PrimaryKeyRelatedField(queryset=Sucursal.objects.all(), source='sucursal', write_only=True)

    class Meta:
        model = Empleado
        fields = '__all__'
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        #password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        #if password:
        #    instance.set_password(password)

        instance.save()

        return instance

    def create(self, validated_data):
        #password = validated_data.pop('password')
        employee = Empleado(**validated_data)
        #employee.set_password(password) 
        employee.save()

        return employee



class ClienteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Cliente
        fields = '__all__'
        public_fields = ['nombre', 'apellido', 'email', 'fecha_de_nacimiento']
        read_only_fields = []

    def create(self, validated_data):
        #password = validated_data.pop('password')
        cliente = Cliente(**validated_data)
        #cliente.set_password(password)
        cliente.save()

        return cliente

    def validate_fecha_de_nacimiento(self, value):
        """Este metodo valida que la fecha de nacimiento sea al menos 18 años antes de la fecha actual."""
        # Cuando se usa serializer.is_valid(), django internamente llama a este método para validar el campo fecha_de_nacimiento

        if value > now().date() - timedelta(days=365 * 18):
            raise serializers.ValidationError("El cliente debe ser mayor de 18 años.")
        return value

class AlquilerSerializer(serializers.ModelSerializer):
    # Devuelve los objetos completos
    sucursal_retiro = SucursalSerializer(read_only=True)
    categoria_vehiculo = CategoriaVehiculoSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)
    vehiculo_asignado = VehiculoSerializer(read_only=True)

    vehiculo_asignado_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo_asignado', write_only=True, allow_null=True, required=False
    )


    # Acepta solo IDs para escritura
    sucursal_retiro_id = serializers.PrimaryKeyRelatedField(
        queryset=Sucursal.objects.all(), write_only=True, source='sucursal_retiro'
    )
    categoria_vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaVehiculo.objects.all(), write_only=True, source='categoria_vehiculo'
    )

    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(), write_only=True, source='cliente'
    )

    paquetes = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    paquetealquiler_set = PaqueteAlquilerSerializer(many=True, read_only=True)

    class Meta:
        model = Alquiler
        fields = [
            'id',
            'fecha_inicio',
            'fecha_devolucion',
            'fecha_registro',           # read-only (auto_now_add)
            'cantidad_dias_totales',
            'categoria_vehiculo',        # read-only (objeto)
            'categoria_vehiculo_id',     # write-only (ID)
            'sucursal_retiro',           # read-only (objeto)
            'sucursal_retiro_id',        # write-only (ID)
            'vehiculo_asignado',
            'vehiculo_asignado_id',      # write-only (ID)
            'precio_total',
            'reembolso',
            'activo',
            'status',
            'cliente',
            'cliente_id',            # write-only (ID)
            'paquetes',                  # campo virtual para crear relaciones
            'paquetealquiler_set',       # campo real que devuelve los relacionados
            'montoExtra',
            'montoDevuelto',
        ]
        read_only_fields = ['cantidad_dias_totales', 'paquetealquiler_set', 'fecha_registro']

    def validate(self, data):
        fecha_inicio = data.get('fecha_inicio')
        fecha_devolucion = data.get('fecha_devolucion')

        # if fecha_inicio and fecha_inicio <= now() - timedelta(minutes=1):
        #     raise serializers.ValidationError({
        #         'fecha_inicio': 'La fecha de inicio debe ser igual o posterior al momento actual.'
        #     })

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
