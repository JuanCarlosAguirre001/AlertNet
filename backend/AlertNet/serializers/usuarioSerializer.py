from rest_framework import serializers
from AlertNet.models import Usuario
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = ["id", "nombre_completo", "correo", "password", "telefono"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return Usuario.objects.create(**validated_data)
        
        