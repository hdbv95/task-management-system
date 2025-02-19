# Task Management System API

This is a task management system built with Django and Django REST Framework.

The API allows users to create, read, update, and delete tasks, assign tasks to users, mark tasks as completed, and filter tasks based on their status and due date.

## Features

- **API Development**: Built with Django and Django REST Framework.
- **Authentication**: JWT authentication for secure access.
- **CRUD Operations**: Endpoints for creating, reading, updating, and deleting tasks.
- **Pagination**: Implemented pagination for listing tasks.
- **Filtering**: Filter tasks by status and due date (e.g., `?status=completed&due_date=2024-02-18`).
- **Database**: **SQLite** is used as the database for this project.
- **Unit Testing**: Coverage of at least 80% using pytest.
- **Dockerization**: Fully containerized with Docker.
- **Documentation**: Available through Swagger UI and ReDoc.

## Installation & Setup

### Prerequisites

- Poetry (for managing dependencies)
- Docker (to run the application in containers)
- Python 3.12 or later (if running locally without Docker)

### Clone the Repository

```console
git clone https://github.com/hdbv95/task-management-system.git
cd task-management-system
```

### Set Database

1. Navigate to the backend directory:

```console
cd backend
```

2. Ensure that the `backend/task_manager/fixtures/db_fixture.json` file is encoded in `UTF-8`

3. Run the setup_db.sh file

```console
./setup_db.sh
```

4. This will create the db.sqlite3 file and populate it with an `admin` user and some initial `tasks`.

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

The api will be available at http://localhost:8000.
The frontend will be available at http://localhost:5173.

### Using Poetry (Local Setup backend)

1. Install Poetry if you haven't already
2. Navigate to the backend directory:

```console
cd backend
```

3. Install project dependencies

```console
poetry install
```

4. Navigate to the Django app directory

```console
cd task_manager
```

5. Run migrations to set up the database

```console
poetry run python manage.py migrate
```

6. Start the development server:

```console
poetry run python manage.py runserver
```

The application will be available at http://localhost:8000/

### Using npm (Local Setup frontend)

1. Navigate to the frontend directory

```console
cd frontend/tasks-app
```

3. Install project dependencies

```console
npm install
```

4. Run the frontend development server:

```console
npm run dev
```

The application will be available at http://localhost:5173.

## API Documentation

The API uses JWT authentication for secure access. To obtain a JWT token:

1. Go to [http://localhost:8000/api/token/](http://localhost:8000/api/token/).
2. POST a valid `username` and `password` to obtain the token. If the [Set database](#set-database) was performed both would be `admin`.

### Accessing API Documentation:

- **Swagger UI**: Interactive API documentation available at:

```console
http://localhost:8000/swagger/
```

Swagger UI allows you to view and test the API endpoints directly from the browser.

- **ReDoc**: Detailed API documentation available at:

```console
http://localhost:8000/redoc/
```

ReDoc provides an overview of the API with detailed descriptions of each endpoint.

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

- `black`: Code is automatically formatted with black.
- `flake8`: Code is checked for style violations with flake8.
- `mypy`: Type checking is performed with mypy.

## Frontend

- The frontend is developed using **React**, **Vite**, and **TypeScript**.
- No tests are implemented for the frontend.
- The frontend auto-refreshes the JWT token for the `admin` user.
- The frontend interacts with the API using GET, POST, PATCH, and DELETE endpoints.
