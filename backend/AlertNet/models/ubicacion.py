from django.db import models
from .usuario import Usuario

class Ubicacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    latitud = models.DecimalField(max_digits=10, decimal_places=8)
    longitud = models.DecimalField(max_digits=11, decimal_places=8)
    direccion = models.TextField(null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ubicaciones"