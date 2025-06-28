import pyttsx3
import tempfile
import os

def speak(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def generate_speech_file(text):
    """Generate speech file from text and return file path"""
    try:
        engine = pyttsx3.init()
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        temp_file.close()
        
        # Save speech to file
        engine.save_to_file(text, temp_file.name)
        engine.runAndWait()
        
        return temp_file.name
    except Exception as e:
        print(f"Error generating speech file: {e}")
        return None
