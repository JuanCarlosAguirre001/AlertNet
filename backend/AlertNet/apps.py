from django.apps import AppConfig


class AlertnetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'AlertNet'
    
    def ready(self):
        # Importamos las señales justo cuando la app arranca
        import AlertNet.signals