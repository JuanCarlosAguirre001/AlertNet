from rest_framework import serializers
from AlertNet.models import *

class AlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerta
        fields = '__all__'