from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task

def create_tasks_for_test(user, n):
    for i in range(n):
        Task.objects.create(
            title=f"Task {i}",
            description=f"Test task {i}",
            due_date="2025-12-31",
            status="pending",
            assigned_to=user
        )

class TaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

    def test_create_task(self):
        data = {
            "title": "Test Task",
            "description": "This is a test",
            "due_date": "2025-12-31",
            "status": "pending",
            "assigned_to": self.user.id
        }
        response = self.client.post("/api/tasks/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Test Task")

    def test_get_tasks(self):
        create_tasks_for_test(self.user, 5)
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_empty_task_list(self):
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_task_pagination(self):
        create_tasks_for_test(self.user, 15)
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)

    def test_update_task(self):
        task = Task.objects.create(
            title="Original Task",
            description="This is the original task",
            due_date="2025-12-31",
            status="pending",
            assigned_to=self.user
        )
        data = {
            "title": "Updated Task",
            "description": "This is the updated task",
            "due_date": "2025-11-30",
            "status": "completed",
            "assigned_to": self.user.id
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
            assigned_to=self.user
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
            assigned_to=self.user
        )
        self.assertEqual(str(task), "Test Task")
