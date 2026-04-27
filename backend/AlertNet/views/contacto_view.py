from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Contacto, Usuario
from ..serializers import ContactoSerializer, ContactoListSerializer


class ContactoListCreateAPIView(APIView):
    def get(self, request):
        usuario_id = request.query_params.get("usuario_id")
        if not usuario_id:
            return Response(
                {"error": "Se requiere el campo 'usuario_id'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        contactos = Contacto.objects.filter(
            usuario_id=usuario_id,
            is_active=True
        ).order_by("prioridad", "nombre_contacto")

        serializer = ContactoListSerializer(contactos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        usuario_id = request.data.get("usuario_id")
        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = get_object_or_404(Usuario, pk=usuario_id)

        contactos_activos = Contacto.objects.filter(
            usuario=usuario,
            is_active=True
        ).count()

        if contactos_activos >= 3:
            return Response(
                {
                    "error": "Solo puedes agregar hasta 3 contactos en la versión gratuita. Mejora a Premium para agregar más contactos."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data.pop("usuario_id", None)

        serializer = ContactoSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        contacto = Contacto.objects.create(
            usuario=usuario,
            **serializer.validated_data
        )

        return Response(
            ContactoListSerializer(contacto).data,
            status=status.HTTP_201_CREATED
        )


class ContactoDetailAPIView(APIView):

    def get_object(self, pk, usuario_id=None):
        qs = Contacto.objects
        if usuario_id is not None:
            return get_object_or_404(qs, pk=pk, usuario_id=usuario_id, is_active=True)
        return get_object_or_404(qs, pk=pk, is_active=True)

    def get(self, request, pk):
        usuario_id = request.query_params.get("usuario_id")
        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id como query param."},
                status=status.HTTP_400_BAD_REQUEST
            )

        contacto = self.get_object(pk, usuario_id=usuario_id)
        serializer = ContactoListSerializer(contacto)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def _update(self, request, pk, partial):
        usuario_id = request.data.get("usuario_id")
        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id en el body."},
                status=status.HTTP_400_BAD_REQUEST
            )

        contacto = get_object_or_404(
            Contacto,
            pk=pk,
            usuario_id=usuario_id,
            is_active=True
        )

        data = request.data.copy()
        data.pop("usuario_id", None)

        serializer = ContactoSerializer(contacto, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(ContactoListSerializer(contacto).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        usuario_id = request.query_params.get("usuario_id") or request.data.get("usuario_id")
        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id para eliminar."},
                status=status.HTTP_400_BAD_REQUEST
            )

        contacto = get_object_or_404(
            Contacto,
            pk=pk,
            usuario_id=usuario_id,
            is_active=True
        )

        contacto.is_active = False
        contacto.save()

        return Response(status=status.HTTP_204_NO_CONTENT)