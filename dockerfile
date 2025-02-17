FROM python:3.12-slim

# Set environment variables to ensure non-interactive installation
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
EXPOSE 8000
CMD ["sh", "-c", "python task_manager/manage.py migrate && python task_manager/manage.py runserver 0.0.0.0:8000"]
