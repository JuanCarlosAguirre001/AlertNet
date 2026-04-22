from django.urls import path, include
from .views.usuario_view import UsuarioRegistroView, UsuarioLoginView
from .views.contacto_view import ContactoDetailAPIView, ContactoListCreateAPIView


urlpatterns = [
    #Usuario    
    path('usuario/register/', UsuarioRegistroView.as_view()),
    path('usuario/login/', UsuarioLoginView.as_view()),
        
        
    #Contacto
    path('contactos/', ContactoListCreateAPIView.as_view()),
    #actualiza y elimina para la entidad Contacto
    path('contactos/<int:pk>/', ContactoDetailAPIView.as_view()),

]