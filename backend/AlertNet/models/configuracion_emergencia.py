from django.db import models
from .usuario import Usuario


class ConfiguracionEmergencia(models.Model):
    # OneToOneField asegura la relación uno a uno que mencionas
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True) 
    boton_volumen = models.BooleanField(default=False) 
    notif_instantanea = models.BooleanField(default=False) 
    compartir_tiempo_real = models.BooleanField(default=False)
    usar_mensaje_personalizado = models.BooleanField(default=True)
    mensaje_predeterminado = models.TextField() 
    
    class Meta:
        db_table = "configuracionesemergencia"
        