# Usa una imagen base segura y ligera (Linux Hardened)
FROM python:3.11-slim

# Crea un usuario sin privilegios para evitar el riesgo de escalada (Specter Best Practice)
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN groupadd -g $GROUP_ID nonroot && \
    useradd -r -u $USER_ID -g nonroot nonroot

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios del Motor Specter
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- CORRECCIONES CRÍTICAS AQUÍ ---

# Copia el código fuente del Motor Specter
COPY src/specter-engine /app/src/specter-engine

# ✅ CORRECCIÓN 1: Copiar el archivo de entrada principal de Flask
# Asumimos que 'app_main.py' contiene el objeto 'app' de Flask/Express.
COPY src/app_main.py /app/src/app_main.py 

# Define el puerto de ejecución (necesario para Cloud Run)
ENV PORT 8080

# CRÍTICO: Ejecutar el contenedor con el usuario sin privilegios
USER nonroot

# ✅ CORRECCIÓN 2: Comando de ejecución
# Apuntamos a la ruta correcta: el archivo 'app_main' dentro de la carpeta 'src', y el objeto 'app' dentro de él.
CMD ["gunicorn", "-b", "0.0.0.0:8080", "src.app_main:app"]