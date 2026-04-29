from django.db import models
from django.contrib.auth.models import User # Recomendado para manejar autenticación

class Usuario(models.Model):
    # Django crea el id (PK) autoincremental automáticamente
    nombre_completo = models.CharField(max_length=100, null=True, blank=True) 
    correo = models.EmailField(max_length=100, unique=True)
    password = models.TextField() 
    telefono = models.CharField(max_length=20, null=True, blank=True) 
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
      db_table = "usuarios"
        
    def __str__(self):
        return self.nombre_completo