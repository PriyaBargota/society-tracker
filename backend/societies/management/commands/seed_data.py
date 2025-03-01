import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from societies.models import Society, Event

class Command(BaseCommand):
    help = 'Seed the database with sample societies and events'

    def add_arguments(self, parser):
        parser.add_argument('--societies', type=int, default=30, help='Number of societies to create')
        parser.add_argument('--events', type=int, default=150, help='Number of events to create')
        parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Event.objects.all().delete()
            Society.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Successfully cleared existing data'))

        num_societies = options['societies']
        num_events = options['events']

        self._create_societies(num_societies)
        self._create_events(num_events)

        self.stdout.write(
            self.style.SUCCESS(f'Successfully seeded {num_societies} societies and {num_events} events')
        )

    def _create_societies(self, count):
        self.stdout.write(f'Creating {count} societies...')
        
        society_data = [
            {'name': 'Computer Science Society', 'description': 'For computer science enthusiasts'},
            {'name': 'AI & Data Science Society', 'description': 'Exploring artificial intelligence and data science'},
            {'name': 'Robotics Society', 'description': 'Building and programming robots'},
            {'name': 'Cybersecurity Society', 'description': 'Learning about digital security and ethical hacking'},
            {'name': 'Game Development Society', 'description': 'Creating video games and interactive experiences'},
            {'name': 'Mathematics Society', 'description': 'Exploring the world of numbers and equations'},
            {'name': 'Physics Society', 'description': 'Understanding the laws that govern our universe'},
            {'name': 'Chemistry Society', 'description': 'Experiments and discussions about chemical sciences'},
            {'name': 'Engineering Society', 'description': 'For all engineering disciplines'},
            {'name': 'Biomedical Society', 'description': 'Intersection of medicine and technology'},
            {'name': 'Blockchain Society', 'description': 'Exploring cryptocurrency and distributed ledger technologies'},
            {'name': 'Photography Society', 'description': 'Capturing moments through a lens'},
            {'name': 'Film Society', 'description': 'Appreciating cinema and filmmaking'},
            {'name': 'Debate Society', 'description': 'Developing argument and public speaking skills'},
            {'name': 'Entrepreneurship Society', 'description': 'For aspiring business founders and innovators'},
            {'name': 'Marketing Society', 'description': 'Understanding consumer behavior and advertising'},
            {'name': 'Music Society', 'description': 'Playing, listening, and appreciating music'},
            {'name': 'Dance Society', 'description': 'Exploring different dance styles and techniques'},
            {'name': 'Fashion Society', 'description': 'Fashion shows, design workshops, and more'},
            {'name': 'Cooking Society', 'description': 'Sharing recipes and culinary experiences'},
            {'name': 'Gardening Society', 'description': 'Growing plants and maintaining gardens'},
            {'name': 'Astronomy Society', 'description': 'Stargazing and learning about celestial objects'},
            {'name': 'Literature Society', 'description': 'Book discussions, writing workshops, and more'},
            {'name': 'History Society', 'description': 'Exploring past events and historical figures'},
            {'name': 'Language Society', 'description': 'Learning and practicing different languages'},
            {'name': 'Travel Society', 'description': 'Sharing travel experiences and tips'},
            {'name': 'Environment Society', 'description': 'Promoting sustainability and environmental awareness'},
            {'name': 'Health & Fitness Society', 'description': 'Workouts, nutrition tips, and wellness activities'},
            {'name': 'Psychology Society', 'description': 'Understanding human behavior and mental processes'},
            {'name': 'Philosophy Society', 'description': 'Discussions on life, knowledge, and existence'},
            {'name': 'Art Society', 'description': 'Appreciating and creating visual arts'},
            {'name': 'Theatre Society', 'description': 'Acting, directing, and producing plays'},
            {'name': 'Volunteering Society', 'description': 'Community service and social impact initiatives'},
            {'name': 'Student Council', 'description': 'Representing and organizing student body activities'},
            {'name': 'Sports Society', 'description': 'Playing and watching sports events'},
            {'name': 'Chess Society', 'description': 'Playing chess and organizing tournaments'},
            {'name': 'Magic Society', 'description': 'Learning and performing magic tricks'},
            {'name': 'Board Games Society', 'description': 'Playing and exploring various board games'},
            {'name': 'Anime & Manga Society', 'description': 'Discussing and watching anime and manga series'},
            {'name': 'D&D Society', 'description': 'Playing Dungeons & Dragons and other tabletop RPGs'},
            {'name': 'Music Production Society', 'description': 'Creating and producing music tracks'},
            {'name': 'Fashion Design Society', 'description': 'Designing and showcasing fashion collections'},
            {'name': 'Film Production Society', 'description': 'Producing short films and video projects'},
            {'name': 'Coding Society', 'description': 'Coding workshops and hackathons'},
            {'name': 'Startup Society', 'description': 'Supporting student startups and entrepreneurship'}
        ]
        
        # Create more if needed by generating random ones
        while len(society_data) < count:
            society_data.append({
                'name': f'Society {len(society_data) + 1}',
                'description': f'Description for Society {len(society_data) + 1}'
            })
        
        # Take the needed number of societies
        selected_societies = society_data[:count]
        
        for society_info in selected_societies:
            Society.objects.create(**society_info)

    def _create_events(self, count):
        self.stdout.write(f'Creating {count} events...')
        
        societies = list(Society.objects.all())
        if not societies:
            self.stdout.write(self.style.ERROR('No societies found, cannot create events'))
            return
        
        event_types = ['Workshop', 'Conference', 'Hackathon', 'Meetup', 'Seminar', 'Competition', 'Social']
        topics = ['Programming', 'AI', 'Machine Learning', 'Web Development', 'Mobile Apps', 
                 'Cybersecurity', 'Data Science', 'Game Design', 'Networking', 'Career']
        
        # Generate random dates spanning the next year
        now = timezone.now()
        
        for i in range(count):
            society = random.choice(societies)
            event_type = random.choice(event_types)
            topic = random.choice(topics)
            
            # Random date within the next year
            days_ahead = random.randint(1, 365)
            date = now + timedelta(days=days_ahead)
            
            title = f"{event_type}: {topic}"
            description = f"Join {society.name} for this exciting {event_type.lower()} about {topic.lower()}."
            
            Event.objects.create(
                title=title,
                description=description,
                date=date,
                society=society
            )
