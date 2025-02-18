from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

task_schema_view = get_schema_view(
    openapi.Info(
        title="Task Management API",
        default_version="v1",
        description="API for managing tasks with JWT authentication.",
    ),
    public=True,
    permission_classes=[AllowAny],
    authentication_classes=[],
)
