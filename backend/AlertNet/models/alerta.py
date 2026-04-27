from django.db import models
from .usuario import Usuario


class Alerta(models.Model):

    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('cancelada', 'Cancelada'),
        ('finalizada', 'Finalizada'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    mensaje = models.TextField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='activa'
    )

    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "AlertNet_alerta"