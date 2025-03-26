
from django.urls import path
from . import views

urlpatterns = [
    path('api/current-user/', views.current_user),
    path('api/users/', views.user_list),
    path('api/users/<int:pk>/', views.user_detail),
    path('api/tasks/', views.task_list),
    path('api/tasks/<int:pk>/', views.task_detail),
    path('api/users/<int:user_id>/contributions/', views.user_contributions),
    path('api/contributions/', views.contribution_create),
    path('api/users/<int:user_id>/saved-tasks/', views.user_saved_tasks),
    path('api/saved-tasks/', views.saved_task_create),
    path('api/users/<int:user_id>/saved-tasks/<int:task_id>/', views.saved_task_detail),
    path('api/resources/', views.resource_list),
    path('api/resources/<int:pk>/', views.resource_detail),
    path('api/users/<int:user_id>/resume/', views.user_resume),
    path('api/resumes/', views.resume_create),
    path('api/users/<int:user_id>/stats/', views.user_stats),
]
