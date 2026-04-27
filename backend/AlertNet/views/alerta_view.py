from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from AlertNet.models import Alerta, Usuario
from AlertNet.serializers import AlertaSerializer


class AlertaListCreateAPIView(APIView):

    def get(self, request):
        usuario_id = request.query_params.get("usuario_id")

        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        alertas = Alerta.objects.filter(usuario_id=usuario_id).order_by("-fecha")
        serializer = AlertaSerializer(alertas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        usuario_id = request.data.get("usuario_id")
        mensaje = request.data.get("mensaje", "")

        if not usuario_id:
            return Response({"error": "Se requiere usuario_id"}, status=400)

        usuario = Usuario.objects.filter(id=usuario_id).first()

        if not usuario:
            return Response({"error": "Usuario no encontrado"}, status=404)

        alerta = Alerta.objects.create(
            usuario=usuario,
            mensaje=mensaje,
            estado="activa"
        )

        serializer = AlertaSerializer(alerta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AlertaDetailAPIView(APIView):

    def patch(self, request, pk):
        alerta = Alerta.objects.filter(id=pk).first()

        if not alerta:
            return Response(
                {"error": "Alerta no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        nuevo_estado = request.data.get("estado", alerta.estado)

        alerta.estado = nuevo_estado

        if nuevo_estado in ["cancelada", "finalizada"]:
            alerta.fecha_fin = timezone.now()

        alerta.save()

        serializer = AlertaSerializer(alerta)
        return Response(serializer.data, status=status.HTTP_200_OK)