from django.db import models
from .usuario import Usuario

class Contacto(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='contactos')
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    es_principal = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} ({self.usuario})"