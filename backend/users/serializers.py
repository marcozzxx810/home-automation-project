from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8)
    is_staff = serializers.BooleanField(default=False)

    def create(self, validated_data):
        print(validated_data)
        if validated_data.get("is_staff"):
            user = User.objects.create_superuser(validated_data['username'], validated_data['email'],
                validated_data['password'])
        else:
            user = User.objects.create_user(validated_data['username'], validated_data['email'],
                validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', "is_staff")
