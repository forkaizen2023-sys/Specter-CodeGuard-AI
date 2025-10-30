# Usa una imagen base segura y ligera (Linux Hardened)
FROM python:3.11-slim

# Crea un usuario sin privilegios para evitar el riesgo de escalada (Specter Best Practice)
# UID/GID fijos para asegurar la consistencia.
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN groupadd -g $GROUP_ID nonroot && \
    useradd -r -u $USER_ID -g nonroot nonroot

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY requirements.txt /app/

# Instala todas las dependencias
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copia el código fuente del Motor Specter (asumimos la estructura src/)
COPY src/specter-engine /app/src/specter-engine
COPY src/app_main.py /app/src/app_main.py

# Define el puerto de ejecución (necesario para Cloud Run)
ENV PORT 8080

# CRÍTICO: Ejecutar el contenedor con el usuario sin privilegios
USER nonroot

# Comando de ejecución con Gunicorn (servidor WSGI para producción)
# Apunta al archivo 'app_main.py' dentro del directorio de trabajo '/app/src' y al objeto 'app' de Flask.
# El patrón es [directory_path].[module_name]:[application_object]
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "src.app_main:app"]
