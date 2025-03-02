from django.shortcuts import render
# api/views.py
import os
import openai
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

# Load OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

@csrf_exempt
@login_required
def chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_query = data.get('message')
            
            # Example: Get user's subscribed societies (replace with your logic)
            societies = request.user.subscribed_societies.all()
            society_data = "\n".join(
                f"Society: {s.name}\nEvents: {', '.join(e.name for e in s.events.all())}"
                for s in societies
            )
            
            # Call OpenAI API
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{
                    "role": "user",
                    "content": f"""Analyze this query: {user_query}
                    Available societies and events: {society_data}
                    Respond in JSON format: {{"reply": "text response", "table_data": [{{"column1": "...", ...}}]}}"""
                }]
            )
            
            # Parse OpenAI response
            ai_response = json.loads(response.choices[0].message.content)
            return JsonResponse(ai_response)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)