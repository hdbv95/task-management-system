cd task_manager
poetry run python manage.py migrate
poetry run python manage.py loaddata fixtures/db_fixture.json
