# Task Management System API
This is a task management system built with Django and Django REST Framework.

The API allows users to create, read, update, and delete tasks, assign tasks to users, mark tasks as completed, and filter tasks based on their status and due date.

## Requirements
1. **API Development**:
    * Django (with Django REST Framework) is used to build the API.
    * JWT authentication is implemented for secure access.
    * CRUD endpoints are provided for managing tasks.
    * Pagination is implemented for listing tasks.
    * Filtering is supported for tasks based on their status and due date.

2. **Database**:
    * **SQLite** is used as the database for this project.
    * A simple schema has been designed to store tasks and users.

3. **Unit Testing**:
    * Unit tests have been written for critical API endpoints using pytest.
    * At least 80% test coverage is ensured.

4. **Dockerization**:
    * The project is dockerized with a Dockerfile and docker-compose.yml to set up the app locally.

5. **Documentation**:
    * This README contains setup instructions.
    * API documentation is available through **Swagger UI** and **ReDoc** for easy access to the API endpoints.

## Installation & Setup
### Prerequisites
* Poetry (for managing dependencies)
* Docker (to run the application in containers)
* Python 3.12 or later (if running locally without Docker)

### Clone the Repository
```console
git clone https://github.com/hdbv95/task-management-system.git
cd task-management-system
```
### Using Docker
To set up the app using Docker, follow these steps:

1. Build the Docker containers:
```console
docker-compose build
```

2. Run the containers:
```console
docker-compose up
```

The application will be available at http://localhost:8000.

### Using Poetry (Local Setup)
1. Install Poetry if you haven't already
2. Install project dependencies
```console
poetry install
```

3. Go to the app directory
```console
cd task_manager
```

4. Run migrations:
```console
poetry run python manage.py migrate
```

5. Run the development server:
```console
poetry run python manage.py runserver
```

The application will be available at http://localhost:8000.

## API Documentation
The API uses JWT authentication for secure access. You can obtain a JWT token by going to http://localhost:8000/api/token and POSTing a valid username and password.

### Accessing API Documentation:
* **Swagger UI**: The API documentation can be accessed interactively via Swagger UI at:
```console
http://localhost:8000/swagger/
```

Swagger UI allows you to view and test the API endpoints directly from the browser.

* **ReDoc**: The API documentation is also available through ReDoc at:
```console
http://localhost:8000/redoc/
```
ReDoc provides detailed view of the API endpoints, ideal for documentation.

## Unit Testing
Unit tests are written for the API using pytest. To run the tests:

1. Ensure you have all the required dependencies installed.
2. Go to the app directory
```console
cd task_manager
```
3. Run tests using:
```console
poetry run pytest
poetry run ptw     # this will run on watch mode for developing
```
You can run your tests and generate coverage reports by using the following command:
```console
poetry run pytest --cov=tasks --cov-report=term-missing
```
## Pre-commit Hooks Setup
This project uses pre-commit hooks to ensure code quality and consistency.

To set up pre-commit:

1. Install the pre-commit hooks:
```console
poetry run pre-commit install
```

2. Run the pre-commit hooks for all files:
```console
poetry run pre-commit run --all-files
```
The hooks ensure that:

* `black`: Code is automatically formatted with black.
* `flake8`: Code is checked for style violations with flake8.
* `mypy`: Type checking is performed with mypy.
