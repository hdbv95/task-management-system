from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import UserRateThrottle
from django.core.cache import cache
from .models import Task


def create_tasks_for_test(user, n):
    for i in range(n):
        Task.objects.create(
            title=f"Task {i}",
            description=f"Test task {i}",
            due_date="2025-12-31",
            status="pending",
            assigned_to=user,
        )


class TaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpass"
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_create_task(self):
        data = {
            "title": "Test Task",
            "description": "This is a test",
            "due_date": "2025-12-31",
            "status": "pending",
            "assigned_to": self.user.id,
        }
        response = self.client.post("/api/tasks/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Test Task")
        self.assertEqual(response.data["assigned_to"], self.user.id)

    def test_get_tasks(self):
        create_tasks_for_test(self.user, 5)
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data["results"]), 0)

    def test_empty_task_list(self):
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_task_pagination(self):
        create_tasks_for_test(self.user, 15)
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)

    def test_update_task(self):
        task = Task.objects.create(
            title="Original Task",
            description="This is the original task",
            due_date="2025-12-31",
            status="pending",
            assigned_to=self.user,
        )
        data = {
            "title": "Updated Task",
            "description": "This is the updated task",
            "due_date": "2025-11-30",
            "status": "completed",
            "assigned_to": self.user.id,
        }
        response = self.client.put(f"/api/tasks/{task.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Task")
        self.assertEqual(response.data["status"], "completed")

    def test_delete_task(self):
        task = Task.objects.create(
            title="Task to delete",
            description="This task will be deleted",
            due_date="2025-12-31",
            status="pending",
            assigned_to=self.user,
        )
        response = self.client.delete(f"/api/tasks/{task.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(f"/api/tasks/{task.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_task_str_method(self):
        task = Task.objects.create(
            title="Test Task",
            description="Test description",
            due_date="2025-12-31",
            status="pending",
            assigned_to=self.user,
        )
        self.assertEqual(str(task), "Test Task")

    def test_no_token(self):
        self.client.credentials()
        data = {
            "title": "Unauthorized Task",
            "description": "This should fail due to no token",
            "due_date": "2025-12-31",
            "status": "pending",
            "assigned_to": self.user.id,
        }
        response = self.client.post("/api/tasks/", data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalid_token")
        data = {
            "title": "Invalid Token Task",
            "description": "This should fail due to invalid token",
            "due_date": "2025-12-31",
            "status": "pending",
            "assigned_to": self.user.id,
        }
        response = self.client.post("/api/tasks/", data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_task_missing_field(self):
        data = {
            "title": "Incomplete Task",
            "status": "pending",
            # Missing 'due_date' and 'assigned_to'
        }
        response = self.client.post("/api/tasks/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("due_date", response.data)
        self.assertIn("assigned_to", response.data)

    def test_update_nonexistent_task(self):
        data = {
            "title": "Updated Task",
            "description": "This task does not exist",
            "due_date": "2025-11-30",
            "status": "completed",
            "assigned_to": self.user.id,
        }
        response = self.client.put("/api/tasks/999/", data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonexistent_task(self):
        response = self.client.delete("/api/tasks/999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TaskThrottleTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="testuser", password="testpass"
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.throttle_rate = 20

    def test_task_list_throttling(self):
        for _ in range(self.throttle_rate):
            response = self.client.get("/api/tasks/")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get("/api/tasks/")
        self.assertEqual(
            response.status_code, status.HTTP_429_TOO_MANY_REQUESTS
        )

    def test_task_create_throttling(self):
        data = {
            "title": "Throttle Test",
            "description": "Testing rate limit",
            "due_date": "2025-12-31",
            "status": "pending",
            "assigned_to": self.user.id,
        }

        for _ in range(self.throttle_rate):
            response = self.client.post("/api/tasks/", data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post("/api/tasks/", data)
        self.assertEqual(
            response.status_code, status.HTTP_429_TOO_MANY_REQUESTS
        )

    def test_throttle_resets_after_time(self):
        UserRateThrottle.THROTTLE_RATES["user"] = "1/min"
        for _ in range(self.throttle_rate):
            self.client.get("/api/tasks/")
        response = self.client.get("/api/tasks/")
        self.assertEqual(
            response.status_code, status.HTTP_429_TOO_MANY_REQUESTS
        )

        # Simulate a reset of the throttle by overriding the throttle logic
        # Reset it to allow requests again
        UserRateThrottle.THROTTLE_RATES["user"] = "20/min"

        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
