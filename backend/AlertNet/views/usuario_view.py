from rest_framework import viewsets
from rest_framework.views import APIView
from ..models import Usuario
from AlertNet.serializers import UsuarioSerializer
from django.http.response import JsonResponse
from ..serializers import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('-id')
    serializer_class = UsuarioSerializer
    
    

class UsuarioRegistroView(APIView):

    def post(self, request):
        try:
            data = request.data

            if not data.get("correo") or not data.get("password"):
                return Response(
                    {"error": "correo y password son requeridos"},
                    status=400
                )

            usuario = Usuario.objects.create(
                nombre_completo=data.get("nombre_completo"),
                correo=data.get("correo"),
                password=make_password(data.get("password")),
                telefono=data.get("telefono")
            )

            return Response({
                "mensaje": "Usuario creado con éxito",
                "user": {
                    "id": usuario.id,
                    "correo": usuario.correo,
                    "nombre_completo": usuario.nombre_completo
                }
            }, status=201)

        except Exception as e:
            print("💥 ERROR REGISTRO:", str(e))
            return Response({"error": str(e)}, status=500)
        
        
class UsuarioLoginView(APIView):
    
    def post(self, request):
        
        if not request.data.get("correo") :
            return JsonResponse({"error": "El campo correo es requerido"}, status=400)
        if not request.data.get("password"):
            return JsonResponse({"error": "El campo password es requerido"}, status=400)

        data = request.data
        try:
          usuario = Usuario.objects.get(correo=data.get("correo"), password=data.get("password"))
          serial = UsuarioSerializer(usuario, many=False)
          return JsonResponse({"usuario":serial.data}, status=201)
          
        except Usuario.DoesNotExist:
          return JsonResponse({"error": "Credenciales incorrectas"}, status=404)
        

    
    
