import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PruebaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Este método se encarga de aceptar la conexión
        await self.accept()
        print(">>> ¡Conexión WebSocket establecida con éxito!")

    async def disconnect(self, close_code):
        print(f">>> Conexión cerrada. Código: {close_code}")

    async def receive(self, text_data):
        # Lógica para recibir mensajes del cliente
        data = json.loads(text_data)
        print(f">>> Datos recibidos: {data}")
        
        # Enviar respuesta al cliente
        await self.send(text_data=json.dumps({
            'message': 'Mensaje recibido por el servidor',
            'data': data
        }))