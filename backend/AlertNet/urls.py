from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.usuario_view import UsuarioListView, UsuarioRegistroView, UsuarioLoginView
from .views.contacto_view import ContactoListCreateAPIView, ContactoDetailAPIView
from .views.configuracion_emergencia_view import ConfiguracionEmergenciaAPIView
from .views.alerta_view import AlertaListCreateAPIView, AlertaDetailAPIView
from .views.ubicacion_view import UbicacionViewSet
from .views.notificacion_view import NotificacionListCreateAPIView, NotificacionDetailAPIView

router = DefaultRouter()
router.register(r"ubicaciones", UbicacionViewSet, basename="ubicaciones")

urlpatterns = [
    path("usuario/", UsuarioListView.as_view(), name="usuario-list"),
    path("usuario/register/", UsuarioRegistroView.as_view(), name="usuario-register"),
    path("usuario/login/", UsuarioLoginView.as_view(), name="usuario-login"),

    path("contactos/", ContactoListCreateAPIView.as_view(), name="contactos"),
    path("contactos/<int:pk>/", ContactoDetailAPIView.as_view(), name="contacto-detail"),

    path("configuracion/", ConfiguracionEmergenciaAPIView.as_view(), name="configuracion-emergencia"),

    path("alertas/", AlertaListCreateAPIView.as_view(), name="alertas"),
    path("alertas/<int:pk>/", AlertaDetailAPIView.as_view(), name="alerta-detail"),

    path("notificaciones/", NotificacionListCreateAPIView.as_view(), name="notificaciones"),
    path("notificaciones/<int:pk>/", NotificacionDetailAPIView.as_view(), name="notificacion-detail"),

    path("", include(router.urls)),
]