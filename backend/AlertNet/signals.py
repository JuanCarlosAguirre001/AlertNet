from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notificacion
from .serializers import NotificacionSocketSerializer

@receiver(post_save, sender=Notificacion)
def broadcast_notificacion_privada(sender, instance, created, **kwargs):
    # Solo enviamos si es una nueva notificación
    if created:
        serializer = NotificacionSocketSerializer(instance)
        channel_layer = get_channel_layer()
        
        # 1. Usamos el campo "receptor" que definiste en tu modelo
        id_receptor = instance.receptor.id
        
        # 2. Creamos el nombre del canal personal del usuario
        grupo_destino = f'notificaciones_usuario_{id_receptor}'
        
        # 3. Enviamos el mensaje
        async_to_sync(channel_layer.group_send)(
            grupo_destino,
            {
                'type': 'enviar_notificacion', 
                'data': serializer.data
            }
        )