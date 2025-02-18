FROM python:3.12-slim

# Set environment variables to ensure non-interactive installation
ENV PYTHONUNBUFFERED=1

# Install curl, then Poetry
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sSL https://install.python-poetry.org | python3 -

# Set the path for Poetry
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

# Copy the poetry lock files first to install dependencies
COPY pyproject.toml poetry.lock /app/

# Install dependencies via Poetry
RUN poetry install --no-root

# Copy the rest of the application files
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application, migrate the database and start the server
CMD ["sh", "-c", "poetry run python task_manager/manage.py migrate && poetry run python task_manager/manage.py runserver 0.0.0.0:8000"]
