from rest_framework import serializers
from .models import Student
from users.models import User
from users.serializers import UserSerializer  
from teachers.models import Teacher
from django.core.exceptions import ValidationError

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    assigned_teacher = serializers.CharField()  

    class Meta:
        model = Student
        fields = [
            'id', 'user', 'roll_number', 'student_class',
            'date_of_birth', 'admission_date', 'status', 'assigned_teacher'
        ]

    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        teacher_name = validated_data.pop('assigned_teacher', None)

        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        if teacher_name:
            try:
                teacher = Teacher.objects.get(user__first_name__iexact=teacher_name.split()[0], user__last_name__iexact=teacher_name.split()[-1])
            except Teacher.DoesNotExist:
                raise ValidationError("Assigned teacher not found.")
            instance.assigned_teacher = teacher

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def validate_roll_number(self, value):
        if self.instance:
            if Student.objects.exclude(id=self.instance.id).filter(roll_number=value).exists():
                raise serializers.ValidationError("Roll number must be unique.")
        else:
            if Student.objects.filter(roll_number=value).exists():
                raise serializers.ValidationError("Roll number must be unique.")
        return value

    def validate(self, attrs):
        user_data = attrs.get("user", {})
        email = user_data.get("email")
        phone = user_data.get("phone_number")

        # Only check email uniqueness for create, not for update
        if self.instance:  # If we're updating
            existing_user = self.instance.user
            if User.objects.exclude(id=existing_user.id).filter(email=email).exists():
                raise serializers.ValidationError({"email": "Email already in use."})
        else:  # Creating
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError({"email": "Email already in use."})

        if not phone.isdigit() or len(phone) != 10:
            raise serializers.ValidationError({"phone_number": "Phone number must be 10 digits."})

        return attrs

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        teacher_name = validated_data.pop('assigned_teacher')

        try:
            # Split the full name into first and last name
            first_name, last_name = teacher_name.strip().split(" ", 1)
            teacher = Teacher.objects.get(user__first_name=first_name, user__last_name=last_name)
        except (ValueError, Teacher.DoesNotExist):
            raise ValidationError({"assigned_teacher": "Teacher not found with given full name."})

        user = User.objects.create_user(
            username=user_data['email'],
            email=user_data['email'],
            password='student@123',
            role='student',
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            phone_number=user_data['phone_number']
        )

        student = Student.objects.create(user=user, assigned_teacher=teacher, **validated_data)
        return student

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        teacher = instance.assigned_teacher
        if teacher:
            representation['assigned_teacher'] = teacher.user.get_full_name()
        else:
            representation['assigned_teacher'] = None
        return representation
