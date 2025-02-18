from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("created_at")
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["status", "due_date"]
    ordering_fields = ["due_date"]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description=(
            "Retrieve a list of tasks with optional filtering by status and "
            "due_date."
        ),
        responses={200: TaskSerializer(many=True)},
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description=(
                    "Filter tasks by status (e.g., pending, completed)."
                ),
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "due_date",
                openapi.IN_QUERY,
                description="Filter tasks by due date (YYYY-MM-DD).",
                type=openapi.TYPE_STRING,
            ),
        ],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new task.",
        responses={201: TaskSerializer()},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a specific task by ID.",
        responses={200: TaskSerializer()},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing task by ID.",
        responses={200: TaskSerializer()},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a task by ID.",
        responses={204: "Task deleted successfully."},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
