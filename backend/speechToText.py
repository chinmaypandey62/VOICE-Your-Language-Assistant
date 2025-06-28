import whisper
import pyaudio
import wave
import tempfile

def initializeModel():
    model = whisper.load_model("base", device="cpu")  # Options: tiny, base, small, medium, large
    return model

def transcribe_audio_file(model, audio_file_path):
    """Transcribe audio file to text"""
    try:
        result = model.transcribe(audio_file_path, language="en", fp16=False)
        return result["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return ""

def record_and_transcribe(model):
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    RECORD_SECONDS = 5

    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK, ) # input_device_index=2,

    print("Listening...")
    frames = [stream.read(CHUNK) for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS))]

    stream.stop_stream()
    stream.close()
    p.terminate()

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        wf = wave.open(tmp.name, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()

        print("Transcribing...")
        result = model.transcribe(tmp.name, language="en", fp16=False)
        print("You said:", result["text"])
        return result["text"]