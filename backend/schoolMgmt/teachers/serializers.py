from rest_framework import serializers
from .models import Teacher
from users.models import User
from users.serializers import UserSerializer

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'subject_specialization',
            'employee_id', 'date_of_joining', 'status'
        ]

    def validate_employee_id(self, value):
        # When updating, exclude the current instance from the check
        if self.instance and self.instance.employee_id == value:
            return value
        if Teacher.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID must be unique.")
        return value

    def validate(self, attrs):
        user_data = attrs.get("user", {})
        email = user_data.get("email")
        phone = user_data.get("phone_number")

        if self.instance:
            user_instance = self.instance.user
            # Check if email is changing and already exists
            if User.objects.filter(email=email).exclude(id=user_instance.id).exists():
                raise serializers.ValidationError({"email": "Email already in use."})
        else:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError({"email": "Email already in use."})

        if not phone.isdigit() or len(phone) != 10:
            raise serializers.ValidationError({"phone_number": "Phone number must be 10 digits."})

        return attrs

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['email'],
            email=user_data['email'],
            password='teacher@123',
            role='teacher',
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            phone_number=user_data['phone_number']
        )
        teacher = Teacher.objects.create(user=user, **validated_data)
        return teacher

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update User fields
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.username = user.email  # keep username in sync with email
        user.phone_number = user_data.get('phone_number', user.phone_number)
        user.save()

        # Update Teacher fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
