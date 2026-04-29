from django.urls import path, re_path
from .consumers import PruebaConsumer
from .NotificacionConsumer import NotificacionConsumer


websocket_urlpatterns = [
    path('ws/prueba/', PruebaConsumer.as_asgi()),
    path('ws/notificaciones/<int:usuario_id>/', NotificacionConsumer.as_asgi()),
]