from rest_framework import viewsets
from AlertNet.models.ubicacion import Ubicacion
from AlertNet.serializers.ubicacionSerializer import UbicacionSerializer

class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all().order_by('-id')
    serializer_class = UbicacionSerializer