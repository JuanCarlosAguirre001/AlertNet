from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# Importa tus modelos y serializers correspondientes
from .models import *
from .serializers import NotificacionSocketSerializer

@receiver(post_save, sender=Notificacion)
def broadcast_notificacion_privada(sender, instance, created, **kwargs):
    # Solo queremos enviar el socket si es una notificación NUEVA
    if created:
        # 1. Serializamos los datos con el formato que definiste
        serializer = NotificacionSocketSerializer(instance)
        
        # 2. Obtenemos la capa de canales
        channel_layer = get_channel_layer()
        
        # 3. Identificamos el grupo privado del contacto al que va dirigida
        # instance.contacto.id extrae el ID del usuario destino
        grupo_destino = f'notificaciones_contacto_{instance.contacto.id}'
        
        # 4. Enviamos el mensaje a ese grupo específico
        async_to_sync(channel_layer.group_send)(
            grupo_destino,
            {
                # 'type' debe coincidir EXACTAMENTE con el nombre del método en el consumer 
                # pero reemplazando guiones bajos si es necesario (enviar_notificacion)
                'type': 'enviar_notificacion', 
                'data': serializer.data
            }
        )