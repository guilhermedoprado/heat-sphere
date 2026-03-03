# Usa uma imagem oficial do Python, versão leve
FROM python:3.11-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os requirements primeiro (para otimizar o cache do Docker)
COPY requirements.txt .

# Instala as bibliotecas
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o resto do seu código Python (main.py, models.py, etc)
COPY . .

# Expõe a porta internamente
EXPOSE 8000

# Comando para iniciar o servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
