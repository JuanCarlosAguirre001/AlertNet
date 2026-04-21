from django.db import models

class Usuario(models.Model):
    username = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    foto = models.CharField(max_length=255)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username