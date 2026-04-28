import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PruebaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Este método se encarga de aceptar la conexión
        await self.accept()
        await self.send(text_data=json.dumps({
            'status': 'conectado',
            'message': '¡Conexión establecida con éxito en el servidor Django!',
            'type': 'connection_established'
        }))

    async def disconnect(self, close_code):
        print(f">>> Conexión cerrada. Código: {close_code}")

    async def receive(self, text_data):
        try:
            # Convertimos el texto recibido a un diccionario JSON
            data = json.loads(text_data)
            print(f">>> Mensaje recibido del cliente: {data}")

            # Eco: Respondemos al usuario con el mismo JSON que envió
            await self.send(text_data=json.dumps({
                'status': 'echo_response',
                'message': 'He recibido tu mensaje',
                'received_data': data
            }))
            
        except json.JSONDecodeError:
            # Manejo de error si el usuario no envía un JSON válido
            await self.send(text_data=json.dumps({
                'error': 'El formato enviado no es un JSON válido'
            }))