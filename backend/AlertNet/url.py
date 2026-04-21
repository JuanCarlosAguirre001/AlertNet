from django.urls import path, include
from rest_framework.routers import DefaultRouter
from AlertNet.views import (
    UsuarioViewSet,
    UbicacionViewSet,
    NotificacionViewSet,
    ContactoViewSet,
    AlertaViewSet
)

router = DefaultRouter()

router.register(r'usuarios', UsuarioViewSet)
router.register(r'ubicaciones', UbicacionViewSet)
router.register(r'notificaciones', NotificacionViewSet)
router.register(r'contactos', ContactoViewSet)
router.register(r'alertas', AlertaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]