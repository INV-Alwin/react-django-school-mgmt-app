from rest_framework import serializers
from .models import Exam, Question, StudentExam, StudentAnswer
from students.models import Student

class ExamSerializer(serializers.ModelSerializer):

    assigned_students = serializers.ListField(
    child=serializers.CharField(), write_only=True
    )
    assigned_student_names = serializers.SerializerMethodField(read_only=True)

    def get_assigned_student_names(self, obj):
        return [s.user.get_full_name() for s in obj.assigned_students.all()]

    def validate_assigned_students(self, value):
        matched_students = []
        errors = []
        for full_name in value:
            parts = full_name.strip().split()
            if len(parts) < 2:
                errors.append(full_name)
                continue

            first_name = parts[0]
            last_name = " ".join(parts[1:])

            students = Student.objects.filter(
                user__first_name__iexact=first_name,
                user__last_name__iexact=last_name
            )

            if students.exists():
                matched_students.append(students.first())
            else:
                errors.append(full_name)

        if errors:
            raise serializers.ValidationError(
                f"Student(s) not found or invalid format: {', '.join(errors)}"
            )

        return matched_students

    def create(self, validated_data):
        assigned_students = validated_data.pop("assigned_students")
        exam = Exam.objects.create(**validated_data)
        exam.assigned_students.set(assigned_students)
        return exam

    def update(self, instance, validated_data):
        assigned_students = validated_data.pop("assigned_students", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if assigned_students is not None:
            instance.assigned_students.set(assigned_students)
        instance.save()
        return instance


    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes', 'teacher', 'assigned_students', 'assigned_student_names']
        read_only_fields = ['teacher']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'exam', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option']


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ['id', 'question', 'selected_option']


class StudentExamSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True, write_only=True)
    score = serializers.IntegerField(read_only=True)
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = StudentExam
        fields = ['id', 'student', 'exam', 'start_time', 'end_time', 'score', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        student_exam = StudentExam.objects.create(**validated_data)

        correct_count = 0
        for ans_data in answers_data:
            question = ans_data['question']
            selected = ans_data['selected_option']
            is_correct = question.correct_option == selected
            if is_correct:
                correct_count += 1
            StudentAnswer.objects.create(student_exam=student_exam, **ans_data)

        student_exam.score = correct_count
        student_exam.save()
        return student_exam
