import re
import json
import requests
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from decouple import config
from geopy.geocoders import GoogleV3

from openai import OpenAI  # ✅ Official OpenAI SDK client
from langchain_core.prompts import PromptTemplate  # ✅ Updated LangChain import

from .models import Jobs




import requests


OPENAI_API_KEY = config('OPENAI_API_KEY')
GOOGLE_PLACES_API_KEY = config('GOOGLE_PLACES_API_KEY')
WEATHER_API_KEY = config('WEATHER_API_KEY')

print(OPENAI_API_KEY)
print(GOOGLE_PLACES_API_KEY)

geolocator = GoogleV3(api_key=GOOGLE_PLACES_API_KEY)

# Correct OpenAI client usage for openai>=1.0
client = OpenAI(api_key=OPENAI_API_KEY)

# Define prompt templates
store_prompt_template = PromptTemplate(
    input_variables=["location"], 
    template="Find landscaping stores near {location}."
)

# Function to find stores using Google Places API
def find_stores(location):

    if not location or ',' not in location:
        return "Invalid location format. Please provide a location in the format 'latitude,longitude'."

    latitude, longitude = location.split(',')
    radius = 5000  # Radius in meters
    google_places_url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={latitude},{longitude}"
        f"&radius={radius}"
        f"&keyword=landscaping+store"
        f"&key={GOOGLE_PLACES_API_KEY}"
    )
    response = requests.get(google_places_url).json()
    if 'results' in response and response['results']:
        stores = response['results'][:5]  # Get up to 5 results
        store_info = []
        for store in stores:
            store_name = store['name']
            store_address = store['vicinity']
            store_location = store['geometry']['location']
            maps_url = f"https://www.google.com/maps/search/?api=1&query={store_location['lat']},{store_location['lng']}"
            store_info.append(f"{store_name} located at <a href='{maps_url}'>{store_address}</a>")
        return "Here are the nearest landscaping stores:<br>" + "<br>".join(store_info)
    else:
        return "Sorry, I couldn't find any landscaping stores near you."
    

# GET TRAFFIC TIME
def get_traffic_info(origin, destination):

    latitude, longitude = origin.split(',')

    google_maps_url = (
        f"https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={latitude},{longitude}"
        f"&destinations={destination['latitude']},{destination['longitude']}"
        f"&departure_time=now"
        f"&key={GOOGLE_PLACES_API_KEY}"
    )
    response = requests.get(google_maps_url).json()
    location = geolocator.reverse((destination['latitude'], destination['longitude']), exactly_one=True)

    if 'rows' in response and response['rows'][0]['elements'][0]['status'] == 'OK':
        duration_in_traffic = response['rows'][0]['elements'][0]['duration_in_traffic']['text']
        return f"The address is {location.address} for customer {destination['customer']}. The estimated travel time with current traffic is {duration_in_traffic}."
    else:
        return "Sorry, I couldn't retrieve traffic information at this moment."


# GET WEATHER INFORMATION
def get_weather(latitude, longitude):
    openweather_url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?lat={latitude}&lon={longitude}"
        f"&appid={WEATHER_API_KEY}"
        f"&units=metric"  # Use 'imperial' for Fahrenheit
    )
    response = requests.get(openweather_url).json()

    print("Response", response)

    if response.get('weather'):
        weather_description = response['weather'][0]['description']
        temperature = response['main']['temp']
        return f"The current weather is {weather_description} with a temperature of {temperature}°C."
    else:
        return "Sorry, I couldn't retrieve the weather information at this moment."


# Function to recognize intent
def recognize_intent(user_input):
    store_patterns = [
        re.compile(r'find.*landscaping store.*near (?P<location>.+)', re.IGNORECASE),
        re.compile(r'show.*landscaping store.*near (?P<location>.+)', re.IGNORECASE),
    ]

    traffic_patterns = [
        re.compile(r'what.*traffic.*to my next job', re.IGNORECASE),
        re.compile(r'how.*traffic.*to my next job', re.IGNORECASE),
        re.compile(r'what.*traffic.*to my next job address', re.IGNORECASE),
        re.compile(r'how.*traffic.*to my next job address', re.IGNORECASE),
    ]

    weather_patterns = [
        re.compile(r'what.*weather.*at my next job', re.IGNORECASE),
        re.compile(r'how.*weather.*at my next job', re.IGNORECASE),
        re.compile(r'what.*weather.*at my next job site', re.IGNORECASE),
        re.compile(r'how.*weather.*at my next job site', re.IGNORECASE),
    ]

    for pattern in store_patterns:
        match = pattern.match(user_input)
        if match:
            return 'store', match.group('location')
    
    for pattern in traffic_patterns:
        if pattern.match(user_input):
            return 'traffic', None

    for pattern in weather_patterns:
        if pattern.match(user_input):
            return 'weather', None

    return 'general', user_input


@csrf_exempt
def chatbot_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message')
        location = data.get('location', None)

        intent, data = recognize_intent(user_message)

        if intent == 'store':
            store_response = find_stores(location)

            print("Store response", store_response)
            return JsonResponse({'response': store_response})
        
        elif intent == 'traffic':
            # Get the next job from the backend
            today = timezone.now().date()
            job_data = Jobs.objects.filter(status=1, date=today).first()  # Assuming status 1 is for scheduled jobs

            if job_data:
                destination = {
                    "latitude": job_data.customer.latitude,
                    "longitude": job_data.customer.longitude,
                    "customer": job_data.customer.fullname
                }

                print("Destination", destination)
                print("Location", location)

                if location:
                    traffic_info = get_traffic_info(location, destination)
                    return JsonResponse({'response': traffic_info})
                else:
                    return JsonResponse({'response': 'Location information is missing.'})
            else:
                return JsonResponse({'response': 'No scheduled jobs found for today.'})
        
        elif intent == 'weather':
            today = timezone.now().date()
            job_data = Jobs.objects.filter(status=1, date=today).first()
            if job_data:
                latitude = job_data.customer.latitude
                longitude = job_data.customer.longitude
                weather_info = get_weather(latitude, longitude)
                return JsonResponse({'response': weather_info})
            else:
                return JsonResponse({'response': 'No scheduled jobs found for today.'})
        
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150
            )
            return JsonResponse({'response': response.choices[0].message.content.strip()})


    return JsonResponse({'error': 'Invalid request method'}, status=400)