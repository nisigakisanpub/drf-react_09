from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include
from rest_framework import routers
from todo import views

router = routers.DefaultRouter()
router.register(r'todos', views.TodoView, 'todo')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('', include(router.urls)),
]
