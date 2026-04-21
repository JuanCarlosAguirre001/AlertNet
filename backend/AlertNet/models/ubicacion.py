from django.db import models
from .usuario import Usuario

class Ubicacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    latitud = models.FloatField()
    longitud = models.FloatField()
    direccion = models.CharField(max_length=255, blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario} - {self.latitud},{self.longitud}"