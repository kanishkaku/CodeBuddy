
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    project_name = models.CharField(max_length=255)
    project_image_url = models.URLField(null=True)
    difficulty = models.CharField(max_length=50)
    estimated_hours = models.CharField(max_length=50)
    tags = ArrayField(models.CharField(max_length=100), default=list)
    link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

class Contribution(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    pull_request_url = models.URLField(null=True)
    description = models.TextField(null=True)

class SavedTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

class Resource(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image_url = models.URLField(null=True)
    link = models.URLField()
    category = models.CharField(max_length=100)

class Resume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    personal_info = models.JSONField()
    skills = ArrayField(models.CharField(max_length=100), default=list)
    education = models.JSONField(default=list)
    experience = models.JSONField(default=list)
    projects = models.JSONField(default=list)
    certifications = models.JSONField(default=list)
    completion_percentage = models.IntegerField(default=0)
