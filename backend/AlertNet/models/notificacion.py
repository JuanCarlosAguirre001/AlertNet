from django.db import models
from .alerta import Alerta
from .contacto import Contacto
from .usuario import Usuario

class Notificacion(models.Model):
    alerta = models.ForeignKey(Alerta, on_delete=models.CASCADE) 
    receptor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    medio = models.CharField(max_length=20) # 'SMS', 'WhatsApp', 'Push' [cite: 13]
    entregado = models.BooleanField(default=False)
    
    class Meta:
        db_table = "notificaciones"
        
    