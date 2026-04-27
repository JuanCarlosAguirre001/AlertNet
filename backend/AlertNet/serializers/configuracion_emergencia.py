from rest_framework import serializers
from ..models.configuracion_emergencia import ConfiguracionEmergencia
from AlertNet.models import *

class UsuarioMinSerializer(serializers.ModelSerializer):

    class Meta:
        model=Usuario
        fields=["nombre_completo", "correo"]

class ConfigEmergenciaSerializer(serializers.ModelSerializer):
    usuario = UsuarioMinSerializer(read_only=True)
    class Meta:
        model=ConfiguracionEmergencia
        fields= ["usuario", "boton_volumen", "notif_instantanea", "compartir_tiempo_real", "usar_mensaje_personalizado", "mensaje_predeterminado"]
    


