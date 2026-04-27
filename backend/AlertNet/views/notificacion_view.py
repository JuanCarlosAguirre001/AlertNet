from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from AlertNet.models.notificacion import Notificacion
from AlertNet.serializers import NotificacionSerializer

class NotificacionListCreateAPIView(ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

class NotificacionDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer