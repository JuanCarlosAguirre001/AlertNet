from rest_framework import serializers
from AlertNet.models import *

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = '__all__'