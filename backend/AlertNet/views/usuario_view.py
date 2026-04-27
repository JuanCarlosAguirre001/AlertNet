from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password

from AlertNet.models import Usuario
from AlertNet.serializers import UsuarioSerializer


class UsuarioListView(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UsuarioRegistroView(APIView):
    def post(self, request):
        try:
            data = request.data

            correo = data.get("correo")
            if Usuario.objects.filter(correo=correo).exists():
                return Response(
                    {"correo": ["Este correo ya está registrado."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            usuario = Usuario.objects.create(
                nombre_completo=data.get("nombre_completo"),
                correo=correo,
                telefono=data.get("telefono"),
                password=make_password(data.get("password")),
            )

            return Response(
                {
                    "mensaje": "Usuario creado con éxito",
                    "user": {
                        "id": usuario.id,
                        "correo": usuario.correo,
                        "nombre_completo": usuario.nombre_completo,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UsuarioLoginView(APIView):
    def post(self, request):
        try:
            correo = request.data.get("correo")
            password = request.data.get("password")

            if not correo or not password:
                return Response(
                    {"message": "Correo y contraseña son obligatorios."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return Response(
                    {"message": "Correo o contraseña incorrectos."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not check_password(password, usuario.password):
                return Response(
                    {"message": "Correo o contraseña incorrectos."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {
                    "mensaje": "Inicio de sesión correcto",
                    "user": {
                        "id": usuario.id,
                        "correo": usuario.correo,
                        "nombre_completo": usuario.nombre_completo,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )