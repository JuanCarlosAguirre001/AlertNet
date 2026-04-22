# AlertNet/views/contacto_api.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Contacto, Usuario
from ..serializers import ContactoSerializer, ContactoListSerializer

class ContactoListCreateAPIView(APIView):
    """
    GET /api/contactos/?usuario_id=...
    POST /api/contactos/  body: { usuario_id, nombre_contacto, telefono_contacto, prioridad? }
    """
    def get(self, request):
        usuario_id = request.data.get('usuario_id')
        if not usuario_id:
            return Response({"error": "Se requiere el campo 'usuario_id "}, status=status.HTTP_400_BAD_REQUEST)
        contactos = Contacto.objects.filter(usuario_id=usuario_id, is_active=True).order_by('prioridad', 'nombre_contacto')
        serializer = ContactoListSerializer(contactos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ContactoSerializer(data=request.data)
        usuario_id = serializer.validated_data.pop('usuario_id', None)
        if not usuario_id:
            return Response({"error":"Se requiere usuario_id"}, status=400)
        usuario = Usuario.objects.get(pk=usuario_id)
        contacto = Contacto.objects.create(usuario=usuario, **serializer.validated_data)

class ContactoDetailAPIView(APIView):

    def get_object(self, pk, usuario_id=None):
        qs = Contacto.objects
        if usuario_id is not None:
            return get_object_or_404(qs, pk=pk, usuario_id=usuario_id, is_active=True)
        return get_object_or_404(qs, pk=pk, is_active=True)

    def get(self, request, pk):
        usuario_id = request.query_params.get('usuario_id')
        if not usuario_id:
            return Response({"error": "Se requiere usuario_id como query param."}, status=status.HTTP_400_BAD_REQUEST)
        contacto = self.get_object(pk, usuario_id=usuario_id)
        serializer = ContactoListSerializer(contacto)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def _update(self, request, pk, partial):
        # validar usuario_id en body
        usuario_id = request.data.get('usuario_id')
        if not usuario_id:
            return Response({"error": "Se requiere usuario_id en el body."}, status=status.HTTP_400_BAD_REQUEST)

        # obtener el contacto asegurando que pertenece al usuario y está activo
        contacto = get_object_or_404(Contacto, pk=pk, usuario_id=usuario_id, is_active=True)

        # serializar con la instancia existente (para update)
        serializer = ContactoSerializer(contacto, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # evitar cambiar el usuario por seguridad
        serializer.validated_data.pop('usuario_id', None)

        # guardar cambios
        serializer.save()

        # devolver representación ligera
        return Response(ContactoListSerializer(contacto).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        usuario_id = request.query_params.get('usuario_id') or request.data.get('usuario_id')
        if not usuario_id:
            return Response({"error": "Se requiere usuario_id para eliminar."}, status=status.HTTP_400_BAD_REQUEST)
        contacto = get_object_or_404(Contacto, pk=pk, usuario_id=usuario_id, is_active=True)
        contacto.is_active = False
        contacto.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
