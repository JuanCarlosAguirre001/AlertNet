from rest_framework import viewsets
from AlertNet.models import Ubicacion
from AlertNet.serializers import UbicacionSerializer

class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all().order_by('-id')
    serializer_class = UbicacionSerializer