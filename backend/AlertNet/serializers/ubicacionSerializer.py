from rest_framework import serializers
from AlertNet.models import *

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = '__all__'