import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from AlertNet.models import Notificacion
from AlertNet.serializers import NotificacionSocketSerializer

class NotificacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # NOTA: Cambié el nombre de la variable de URL a 'usuario_id' 
        # Asegúrate de usar <usuario_id> en tu archivo routing.py
        self.usuario_id = self.scope['url_route']['kwargs']['usuario_id']
        
        # El grupo ahora refleja que pertenece a un usuario específico
        self.grupo_privado = f'notificaciones_usuario_{self.usuario_id}'

        await self.channel_layer.group_add(
            self.grupo_privado,
            self.channel_name
        )

        await self.accept()
        print(f">>> Conectado al canal privado: {self.grupo_privado}")

        # --- Enviamos el historial de notificaciones nada más conectar ---
        historial = await self.obtener_historial_notificaciones()
        
        await self.send(text_data=json.dumps({
            'type': 'historial_notificaciones',
            'payload': historial
        }, ensure_ascii=False))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.grupo_privado,
            self.channel_name
        )
        print(f">>> Desconectado del canal: {self.grupo_privado}")

    async def enviar_notificacion(self, event):
        notificacion_data = event['data']
        await self.send(text_data=json.dumps({
            'type': 'nueva_notificacion',
            'payload': notificacion_data
        }, ensure_ascii=False))

    # --- MÉTODO PARA OBTENER LAS NOTIFICACIONES DE ESTE RECEPTOR ---
    @database_sync_to_async
    def obtener_historial_notificaciones(self):
        # Filtramos directamente por el campo "receptor"
        notificaciones = Notificacion.objects.filter(
            receptor_id=self.usuario_id
        ).order_by('-id')[:20] # Traemos las últimas 20 para no saturar
        
        serializer = NotificacionSocketSerializer(notificaciones, many=True)
        return serializer.data