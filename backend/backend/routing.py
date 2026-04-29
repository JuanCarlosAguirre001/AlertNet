from django.urls import path
from .consumers import PruebaConsumer
from .NotificacionConsumer import NotificacionConsumer


websocket_urlpatterns = [
    path('ws/prueba/', PruebaConsumer.as_asgi()),
    path('ws/notificaciones/<int:contacto_id>/', NotificacionConsumer.as_asgi()),

]