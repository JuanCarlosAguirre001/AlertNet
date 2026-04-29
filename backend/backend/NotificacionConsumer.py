
import json
from channels.generic.websocket import AsyncWebsocketConsumer




class NotificacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Obtenemos el ID del contacto desde la URL del socket
        self.contacto_id = self.scope['url_route']['kwargs']['contacto_id']
        
        # Creamos un nombre de grupo ÚNICO para este usuario
        self.grupo_privado = f'notificaciones_contacto_{self.contacto_id}'

        # Unimos este canal (esta conexión) al grupo privado
        await self.channel_layer.group_add(
            self.grupo_privado,
            self.channel_name
        )

        await self.accept()
        print(f">>> Conectado al canal privado: {self.grupo_privado}")

    async def disconnect(self, close_code):
        # Cuando el usuario cierra la app, lo sacamos del grupo
        await self.channel_layer.group_discard(
            self.grupo_privado,
            self.channel_name
        )
        print(f">>> Desconectado del canal: {self.grupo_privado}")

    # Este método es invocado por channel_layer.group_send (lo veremos abajo)
    async def enviar_notificacion(self, event):
        # Extraemos los datos serializados que nos mandó la señal
        notificacion_data = event['data']

        # Se lo enviamos al cliente en formato JSON
        await self.send(text_data=json.dumps({
            'type': 'nueva_notificacion',
            'payload': notificacion_data
        },ensure_ascii=False))