from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from swaggers.task_swagger import task_schema_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("tasks.urls")),
    path(
        "api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path(
        "api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),
    # Swagger and ReDoc documentation
    path(
        "swagger/",
        task_schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "redoc/",
        task_schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
]
