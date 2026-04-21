from django.db import models
from .usuario import Usuario
from .ubicacion import Ubicacion

class Alerta(models.Model):
    ESTADOS = (
        ('activa', 'Activa'),
        ('atendida', 'Atendida'),
        ('cancelada', 'Cancelada'),
    )

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE)
    mensaje = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='activa')
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alerta de {self.usuario} - {self.estado}"