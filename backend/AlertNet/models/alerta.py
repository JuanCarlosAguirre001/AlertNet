from django.db import models
from .usuario import Usuario



class Alerta(models.Model):
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('cancelada', 'Cancelada'),
        ('finalizada', 'Finalizada'),
    ] 

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE) 
    latitud = models.DecimalField(max_digits=10, decimal_places=8) 
    longitud = models.DecimalField(max_digits=11, decimal_places=8) 
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activa') 
    fecha_inicio = models.DateTimeField(auto_now_add=True) 
    fecha_fin = models.DateTimeField(null=True, blank=True) 
    
    
    class Meta:
        db_table = "alertas"