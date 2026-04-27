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