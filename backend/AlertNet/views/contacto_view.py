from rest_framework import viewsets
from AlertNet.models import Contacto
from AlertNet.serializers import ContactoSerializer

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all().order_by('-id')
    serializer_class = ContactoSerializer