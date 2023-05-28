import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserRegisterSerializer, UserLoginSerializer
from .models import MyUser, MyUserManager


def check_email(value):
    result = True
    o_resp = {"status": "OK", "message": ""}

    if value == None or value == "":
        result = False
        o_resp = {"status": "NG", "message": "email"}

    return result, o_resp


def check_password(value):
    result = True
    o_resp = {"status": "OK", "message": ""}

    if value == None or value == "":
        result = False
        o_resp = {"status": "NG", "message": "password"}

    return result, o_resp


def check_username(value):
    result = True
    o_resp = {"status": "OK", "message": ""}

    if value == None or value == "":
        result = False
        o_resp = {"status": "NG", "message": "username"}

    return result, o_resp


def check_user(value):
    result = True
    o_resp = {"status": "OK", "message": ""}

    if value == None:
        result = False
        o_resp = {"status": "NG", "message": "user"}

    return result, o_resp


class GetCSRF(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        print("GetCSRF:get:{request.GET}")
        csrf = get_token(request)
        o_resp = {"status": "OK", "message": "CSRF cookie set", "csrftoken": csrf}
        response = JsonResponse(o_resp, status=200)
        response["X-CSRFToken"] = get_token(request)
        return response


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        print(f"UserRegister:post:{request.data}")
        o_resp = {"status": "", "message": ""}

        email = request.data.get("email")
        password = request.data.get("password")
        username = request.data.get("password")

        result, o_resp = check_email(email)
        if not result:
            return JsonResponse(o_resp, status=status.HTTP_200_OK)

        result, o_resp = check_password(password)
        if not result:
            return JsonResponse(o_resp, status=status.HTTP_200_OK)

        result, o_resp = check_username(username)
        if not result:
            return JsonResponse(o_resp, status=status.HTTP_200_OK)

        user_obj = MyUser(
            username=username,email=email
        )
        user_obj.set_password(password)
        user_obj.save()

        o_resp = {"status": "OK", "message": "User successfully created."}
        return JsonResponse(o_resp, status=status.HTTP_201_CREATED)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        print(f"UserLogin:post:{request.data}")
        o_resp = {"status": "", "message": ""}

        email = request.data.get("email")
        password = request.data.get("password")

        result, o_resp = check_email(email)
        if not result:
            return JsonResponse(o_resp, status=status.HTTP_200_OK)

        result, o_resp = check_password(password)
        if not result:
            return JsonResponse(o_resp, status=status.HTTP_200_OK)

        user = authenticate(username=email, password=password)
        result, o_resp = check_user(user)
        if not result:
            return JsonResponse(o_resp, status=status.HTTP_200_OK)

        # user = authenticate(username=username, password=password)
        # if user is None:
        #     return JsonResponse({"detail": "Invalid credentials."}, status=400)

        login(request, user)

        csrf = get_token(request)
        response = JsonResponse(
            {"status": "OK", "message": "Successfully logged in.", "csrftoken": csrf},
            status=status.HTTP_200_OK,
        )
        response["X-CSRFToken"] = get_token(request)
        return response


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        print(f"UserLogout:post:{request.data}")
        o_resp = {"status": "", "message": ""}

        username = request.user.username
        if not request.user.is_authenticated:
            o_resp = {"status": "NG", "message": "You are not logged in."}
            logout(request)
            return JsonResponse(o_resp, status=200)

        o_resp = {
            "status": "OK",
            "message": f"You are {username}, Successfully logged out.",
        }
        logout(request)
        return JsonResponse(o_resp, status=200)


class WhoAmI(APIView):
    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = ()

    def post(self, request):
        print(f"WhoAmI:post:{request.data}")
        o_resp = {"status": "", "message": ""}

        if not request.user.is_authenticated:
            o_resp = {"status": "NG", "message": "You are not logged in."}
            return JsonResponse(o_resp, status=200)

        o_resp = {"status": "OK", "message": f"username:{request.user.username}"}
        return JsonResponse(o_resp, status=200)
