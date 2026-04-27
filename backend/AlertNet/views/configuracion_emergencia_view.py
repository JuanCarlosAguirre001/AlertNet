from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from AlertNet.models import Usuario
from AlertNet.models.configuracion_emergencia import ConfiguracionEmergencia
from AlertNet.serializers.configuracion_emergencia import ConfigEmergenciaSerializer


class ConfiguracionEmergenciaAPIView(APIView):
    def get(self, request):
        usuario_id = request.query_params.get("usuario_id")

        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = Usuario.objects.filter(id=usuario_id).first()

        if not usuario:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        config, created = ConfiguracionEmergencia.objects.get_or_create(
            usuario=usuario,
            defaults={
                "boton_volumen": False,
                "notif_instantanea": False,
                "compartir_tiempo_real": True,
                "usar_mensaje_personalizado": True,
                "mensaje_predeterminado": "¡Ayuda! Estoy en una situación de emergencia en mi ubicación actual.",
            }
        )

        serializer = ConfigEmergenciaSerializer(config)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        usuario_id = request.data.get("usuario_id")

        if not usuario_id:
            return Response(
                {"error": "Se requiere usuario_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = Usuario.objects.filter(id=usuario_id).first()

        if not usuario:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        config, created = ConfiguracionEmergencia.objects.get_or_create(
            usuario=usuario,
            defaults={
                "boton_volumen": False,
                "notif_instantanea": False,
                "compartir_tiempo_real": True,
                "usar_mensaje_personalizado": True,
                "mensaje_predeterminado": "¡Ayuda! Estoy en una situación de emergencia en mi ubicación actual.",
            }
        )

        config.boton_volumen = request.data.get(
            "boton_volumen",
            config.boton_volumen
        )

        config.notif_instantanea = request.data.get(
            "notif_instantanea",
            config.notif_instantanea
        )

        config.compartir_tiempo_real = request.data.get(
            "compartir_tiempo_real",
            config.compartir_tiempo_real
        )

        config.usar_mensaje_personalizado = request.data.get(
            "usar_mensaje_personalizado",
            config.usar_mensaje_personalizado
        )

        config.mensaje_predeterminado = request.data.get(
            "mensaje_predeterminado",
            config.mensaje_predeterminado
        )

        config.save()

        serializer = ConfigEmergenciaSerializer(config)
        return Response(serializer.data, status=status.HTTP_200_OK)