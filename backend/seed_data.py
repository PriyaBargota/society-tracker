import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socsync_backend.settings')
django.setup()

import random
from datetime import timedelta
from django.utils import timezone
from users.models import User
from societies.models import Society, Event

def run_seeder():
    print('Seeding data...')
    
    # Clear existing data
    print('Clearing existing data...')
    User.objects.all().delete()
    Society.objects.all().delete()
    Event.objects.all().delete()
    
    # Create users
    print('Creating users...')
    create_users()
    
    # Create societies
    print('Creating societies...')
    create_societies()
    
    # Create events
    print('Creating events...')
    create_events()
    
    print('Successfully seeded database')

def create_users():
    # Create admin user
    User.objects.create_superuser(
        email='admin@example.com',
        name='Admin',
        university='Admin University',
        account_type='student',
        password='admin123'
    )
    
    # Create student users
    universities = ['King\'s College London', 'UCL', 'Imperial College', 'LSE', 'Queen Mary']
    
    for i in range(1, 21):
        User.objects.create_user(
            email=f'student{i}@example.com',
            name=f'Student {i}',
            university=random.choice(universities),
            account_type='student',
            password='password123'
        )
    
    # Create society presidents
    for i in range(1, 6):
        User.objects.create_user(
            email=f'president{i}@example.com',
            name=f'President {i}',
            university=random.choice(universities),
            account_type='president',
            password='password123'
        )

def create_societies():
    presidents = User.objects.filter(account_type='president')
    
    society_data = [
        {
            'name': 'Computer Science Society',
            'description': 'A society for computer science enthusiasts.'
        },
        {
            'name': 'Chess Club',
            'description': 'Weekly chess meetings and tournaments.'
        },
        {
            'name': 'Debate Society',
            'description': 'Improving public speaking and critical thinking through debates.'
        },
        {
            'name': 'Film Society',
            'description': 'Watch and discuss films from various genres and cultures.'
        },
        {
            'name': 'Photography Club',
            'description': 'Learn photography skills and share your work.'
        }
    ]
    
    societies = []
    for i, data in enumerate(society_data):
        society = Society.objects.create(
            name=data['name'],
            description=data['description']
        )
        societies.append(society)

def create_events():
    societies = Society.objects.all()
    
    event_types = [
        'Workshop', 'Social', 'Competition', 'Talk', 'Conference', 
        'Meetup', 'Hackathon', 'Exhibition', 'Game Night'
    ]
    
    for society in societies:
        # Create 3-5 events per society
        num_events = random.randint(3, 5)
        
        for i in range(num_events):
            event_type = random.choice(event_types)
            days_offset = random.randint(-10, 60)  # Events from 10 days ago to 60 days in future
            event_date = timezone.now() + timedelta(days=days_offset)
            
            Event.objects.create(
                title=f"{society.name} {event_type}",
                description=f"Join us for this exciting {event_type.lower()} hosted by {society.name}. All students welcome!",
                date=event_date,
                society=society
            )

if __name__ == '__main__':
    run_seeder()
