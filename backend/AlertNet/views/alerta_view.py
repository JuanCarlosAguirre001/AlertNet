from rest_framework import viewsets
from AlertNet.models import Alerta
from AlertNet.serializers import AlertaSerializer

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all().order_by('-id')
    serializer_class = AlertaSerializer