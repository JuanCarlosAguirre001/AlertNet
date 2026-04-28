from rest_framework import serializers
from AlertNet.models import *


class NotificacionSerializer(serializers.ModelSerializer):
    nombre_contacto = serializers.CharField(
        source="contacto.nombre_contacto",
        read_only=True
    )

    class Meta:
        model = Notificacion
        fields = "__all__"


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [ "nombre_completo", "correo", "telefono"]


class AlertaSerializer(serializers.ModelSerializer):
    autor = UsuarioSerializer(source="usuario" ,read_only=True)
    class Meta:
        model = Alerta
        fields = ["mensaje", "autor"]



class NotificacionSocketSerializer(serializers.ModelSerializer):
    alerta = AlertaSerializer( read_only=True)
    
    class Meta:
        model = Notificacion
        fields = ["id", "alerta"]