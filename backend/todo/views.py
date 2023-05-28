from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import StreamingHttpResponse

from .serializers import TodoSerializer
from .models import Todo

import time
from queue import Queue, Empty



class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

