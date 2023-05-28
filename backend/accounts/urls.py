from django.urls import path

from . import views

urlpatterns = [
    path("csrf/", views.GetCSRF.as_view()),
    path("register/", views.UserRegister.as_view()),
    path("login/", views.UserLogin.as_view()),
    path("logout/", views.UserLogout().as_view()),
    path("whoami/", views.WhoAmI().as_view()),
]
