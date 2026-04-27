from rest_framework import serializers
from AlertNet.models.ubicacion import Ubicacion

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = '__all__'