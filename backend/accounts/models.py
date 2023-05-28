from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        # emailのドメインを小文字に変換
        email = self.normalize_email(email)
        # MyUser モデルを参照してuserを定義
        user = self.model(email=email)
        # userが入力したパスワードをハッシュ化
        user.set_password(password)
        # settings.pyでdefaultに設定されているDBに保存
        user.save()

        return user

    def create_superuser(self, email, password):
        if not email:
            raise ValueError("An email is required")
        if not password:
            raise ValueError("An password is required")

        # 上記create_userを利用
        user = self.create_user(email, password)

        # superuserの権限を適用
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class MyUser(AbstractBaseUser, PermissionsMixin):
    # カラム名 = データ型（オプション）
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255)

    # ユーザが退会したらここをFalseにする（論理削除）
    is_active = models.BooleanField(default=True)
    # 管理者権限
    is_superuser = models.BooleanField(default=False) 
    # 管理画面にアクセスできるか
    is_staff = models.BooleanField(default=False)

    # Managerのメソッドを使えるようにする
    objects = MyUserManager()
    # emailを利用したログイン認証に変更
    USERNAME_FIELD = "email"
    # 必須項目追加
    REQUIRED_FIELDS = []

    # 既存のメソッドをオーバーライド
    def __str__(self):
        return self.email
