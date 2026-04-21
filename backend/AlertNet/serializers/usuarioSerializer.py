from rest_framework import serializers
from AlertNet.models import *
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'