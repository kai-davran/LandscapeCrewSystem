# chatbot.py
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Jobs
from django.utils import timezone
import json

OPENAI_API_KEY = '<your-openai-api-key>'
FINE_TUNED_MODEL = 'gpt-3.5-turbo'
GOOGLE_PLACES_API_KEY = '<your-weather-api-key>'

@csrf_exempt
def chatbot_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message').lower()
        location = data.get('location', None)

        # List of keywords/phrases that indicate the user is asking about the next job
        next_job_keywords = ["next job", "next task", "upcoming job", "upcoming task", "job for today"]

        if any(keyword in user_message for keyword in next_job_keywords):
            today = timezone.now().date()
            next_job = Jobs.objects.filter(status=1, date=today).first()  # Assuming status 1 is for scheduled jobs

            if next_job:
                job_info = {
                    "address": next_job.customer.address,
                    "city": next_job.customer.city,
                    "state": next_job.customer.state,
                    "zipcode": next_job.customer.zipcode,
                    "customer_name": next_job.customer.fullname
                }

                prompt = f"What is the next job? It is at {job_info['address']}, {job_info['city']}, {job_info['state']}, {job_info['zipcode']} for {job_info['customer_name']}."

                headers = {
                    'Authorization': f'Bearer {OPENAI_API_KEY}',
                    'Content-Type': 'application/json',
                }

                payload = {
                    'model': FINE_TUNED_MODEL,
                    'messages': [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    'max_tokens': 150,
                    'temperature': 0.7
                }

                response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)

                if response.status_code == 200:
                    bot_response = response.json()['choices'][0]['message']['content'].strip()
                    return JsonResponse({'response': bot_response})
                else:
                    return JsonResponse({'error': 'Failed to get response from OpenAI'}, status=500)
            else:
                return JsonResponse({'response': 'There are no scheduled jobs for today.'})

        elif "show landscaping store near me" in user_message and location:
            latitude, longitude = location['latitude'], location['longitude']
            radius = 5000  # Radius in meters

            google_places_url = (
                f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                f"?location={latitude},{longitude}"
                f"&radius={radius}"
                f"&keyword=landscaping+store"
                f"&key={GOOGLE_PLACES_API_KEY}"
            )

            response = requests.get(google_places_url)
            places_data = response.json()

            if places_data.get('results'):
                store_info = places_data['results'][0]  # Taking the first result for simplicity
                store_name = store_info['name']
                store_address = store_info['vicinity']
                store_rating = store_info.get('rating', 'No rating available')

                bot_response = f"The nearest landscaping store is {store_name} located at {store_address}. Rating: {store_rating}"
            else:
                bot_response = "Sorry, I couldn't find any landscaping stores near you."

            return JsonResponse({'response': bot_response})

        else:
            # Default to OpenAI for other questions
            headers = {
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json',
            }

            payload = {
                'model': FINE_TUNED_MODEL,
                'messages': [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ],
                'max_tokens': 150,
                'temperature': 0.7
            }

            response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)

            if response.status_code == 200:
                bot_response = response.json()['choices'][0]['message']['content'].strip()
                return JsonResponse({'response': bot_response})
            else:
                return JsonResponse({'error': 'Failed to get response from OpenAI'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)