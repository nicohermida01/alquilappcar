API de Alquilapp Car

## Alquiler

# State

- PENDING: es el estado inicial de un alquiler. Cuando se crea un alquiler, se debe establecer en Pending.
- IN_PROGRESS: se establece cuando un empleado confirma el alquiler. Cuando se asigna el vehiculo especifico.
- FINISHED: se establece cuando el alquiler ha finalizado. Cuando se devuelve el vehiculo un empleado confirma la devolucion.
- CANCELED: se establece cuando el alquiler es cancelado por el cliente o por la empresa. Cuando se cancela un alquiler, se debe establecer en Canceled. Solo se pueden cancelar alquileres en Pending.
- DELETED: se establece cuando se elimina una alquiler. Es el "dado de baja"
