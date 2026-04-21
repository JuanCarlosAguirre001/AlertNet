from rest_framework import viewsets
from AlertNet.models import Notificacion
from AlertNet.serializers import NotificacionSerializer

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all().order_by('-id')
    serializer_class = NotificacionSerializer