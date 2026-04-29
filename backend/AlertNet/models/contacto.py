from django.db import models
from .usuario import Usuario 



class Contacto(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='contactos')
    nombre_contacto = models.CharField(max_length=100)
    telefono_contacto = models.CharField(max_length=20)
    prioridad = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True) 
    propietario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='contactos_propietario')    
    class Meta:
        db_table = "contactos"

    def __str__(self):
        return f"{self.nombre_contacto} (Amigo de {self.usuario.nombre_completo})"

