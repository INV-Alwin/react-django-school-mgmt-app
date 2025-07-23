from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.http import HttpResponse
from django.utils.dateparse import parse_date
import csv
import io

from .models import Teacher
from users.models import User
from .serializers import TeacherSerializer
from users.permissions import IsAdmin


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAdmin]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user  # get the linked User before deleting
        self.perform_destroy(instance)  # delete the Teacher
        user.delete()  # delete the associated User
        return Response(status=status.HTTP_204_NO_CONTENT)


class ImportTeachersCSV(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))

        created_count = 0
        errors = []

        for i, row in enumerate(reader, start=1):
            user_data = {
                'first_name': row.get('first_name', '').strip(),
                'last_name': row.get('last_name', '').strip(),
                'email': row.get('email', '').strip(),
                'phone_number': row.get('phone_number', '').strip(),
            }

            teacher_data = {
                'user': user_data,
                'subject_specialization': row.get('subject_specialization', '').strip(),
                'employee_id': row.get('employee_id', '').strip(),
                'date_of_joining': parse_date(row.get('date_of_joining', '').strip()),
                'status': row.get('status', '').strip().lower()
            }

            serializer = TeacherSerializer(data=teacher_data)
            if serializer.is_valid():
                serializer.save()
                created_count += 1
            else:
                errors.append({f'Row {i}': serializer.errors})

        response_data = {
            'message': f'Successfully imported {created_count} teachers',
        }
        if errors:
            response_data['errors'] = errors

        return Response(response_data, status=status.HTTP_201_CREATED if created_count else status.HTTP_400_BAD_REQUEST)


class ExportTeachersCSV(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="teachers.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'First Name', 'Last Name', 'Email', 'Phone Number',
            'Subject Specialization', 'Employee ID', 'Date of Joining', 'Status'
        ])

        teachers = Teacher.objects.select_related('user').all()
        for teacher in teachers:
            writer.writerow([
                teacher.user.first_name,
                teacher.user.last_name,
                teacher.user.email,
                teacher.user.phone_number,
                teacher.subject_specialization,
                teacher.employee_id,
                teacher.date_of_joining,
                teacher.status
            ])

        return response
