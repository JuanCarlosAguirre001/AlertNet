# AlertNet/serializers/contacto_serializer.py
from rest_framework import serializers
from ..models import Contacto

class ContactoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = ['id', 'nombre_contacto', 'telefono_contacto']

class ContactoSerializer(serializers.ModelSerializer):
    telefono_contacto = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    nombre_contacto = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = Contacto
        fields = ['id', 'nombre_contacto', 'telefono_contacto', 'prioridad']
        read_only_fields = ['id']

    
    def validate_telefono_contacto(self, value):
        # aceptar None o cadena vacía si es opcional
        if value is None:
            return value
        telefono = value.strip()
        if telefono == "":
            return telefono
        if len(telefono) < 5:
            raise serializers.ValidationError("Teléfono demasiado corto.")
        return telefono

    def validate_nombre_contacto(self, value):
        if value is None:
            return value
        nombre = value.strip()
        return nombre