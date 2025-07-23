from rest_framework import viewsets,status
from .models import Student
from .serializers import StudentSerializer
from users.permissions import IsAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import User
from teachers.models import Teacher
from .models import Student
from .serializers import StudentSerializer
from rest_framework import status
from users.permissions import IsAdminOrTeacherReadOnly
from rest_framework.permissions import IsAdminUser
from django.http import HttpResponse
import csv
import io

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Student.objects.all()
        elif user.role == 'teacher':
            return Student.objects.filter(assigned_teacher__user=user)
        return Student.objects.none()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        self.perform_destroy(instance)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ImportStudentsCSV(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file.read().decode('utf-8')
        except UnicodeDecodeError:
            file.seek(0)
            decoded_file = file.read().decode('ISO-8859-1')
        
        reader = csv.DictReader(io.StringIO(decoded_file))

        created_count = 0
        errors = []

        for index, row in enumerate(reader, start=2):  
            email = row['email']
            roll_number = row['roll_number']

            
            if User.objects.filter(email=email).exists():
                errors.append(f"Row {index}: Email '{email}' already exists.")
                continue

            
            if Student.objects.filter(roll_number=roll_number).exists():
                errors.append(f"Row {index}: Roll number '{roll_number}' already exists.")
                continue

            
            user = User.objects.create_user(
                username=email,
                email=email,
                password='student@123',
                role='student',
                first_name=row['first_name'],
                last_name=row['last_name'],
                phone_number=row['phone_number']
            )

            
            try:
                first_name, last_name = row['assigned_teacher'].strip().split(" ", 1)
                teacher = Teacher.objects.get(user__first_name=first_name, user__last_name=last_name)
            except (ValueError, Teacher.DoesNotExist):
                user.delete()  
                errors.append(f"Row {index}: Assigned teacher '{row['assigned_teacher']}' not found.")
                continue

            
            Student.objects.create(
                user=user,
                roll_number=roll_number,
                student_class=row['student_class'],
                date_of_birth=row['date_of_birth'],
                admission_date=row['admission_date'],
                status=row['status'].lower(),
                assigned_teacher=teacher
            )

            created_count += 1

        return Response({
            'message': f'Successfully imported {created_count} students',
            'errors': errors
        }, status=status.HTTP_201_CREATED if created_count else status.HTTP_400_BAD_REQUEST)

    
class StudentMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'student':
            return Response({"detail": "Only students can access this endpoint."}, status=status.HTTP_403_FORBIDDEN)

        try:
            student = Student.objects.get(user=user)
        except Student.DoesNotExist:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(student)
        return Response(serializer.data)

class ExportStudentsCSV(APIView):
    permission_classes = [IsAdmin]  

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="students.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'First Name', 'Last Name', 'Email', 'Phone Number',
            'Roll Number', 'Class', 'Date of Birth',
            'Admission Date', 'Status', 'Assigned Teacher'
        ])

        students = Student.objects.select_related('user', 'assigned_teacher').all()
        for student in students:
            writer.writerow([
                student.user.first_name,
                student.user.last_name,
                student.user.email,
                student.user.phone_number,
                student.roll_number,
                student.student_class,
                student.date_of_birth,
                student.admission_date,
                student.status,
                student.assigned_teacher.user.get_full_name() if student.assigned_teacher else "N/A"
            ])

        return response
