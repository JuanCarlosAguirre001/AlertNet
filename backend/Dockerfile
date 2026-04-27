# Imagen base de Python
FROM python:3.14.3-slim

# Evita archivos .pyc y buffer en logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema (opcional pero recomendado)
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero (mejor cache)
COPY requirements.txt .

# Instalar dependencias
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Puerto de Django
EXPOSE 8000

# Comando para iniciar el servidor con Daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]

# Comando por defecto
##CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]