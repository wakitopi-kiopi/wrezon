import io
import wave
import numpy as np
from scipy.ndimage import zoom
from piper.voice import PiperVoice
import random

voice = PiperVoice.load("en_US-lessac-medium.onnx", "en_US-lessac-medium.onnx.json")

"""def process_text_to_wav(text: str, pitch_factor: float = 1.2) -> bytes:
    print(f"🔍 Input text: '{text}'")
    print(f"🔍 Voice object: {voice}")
    print(f"🔍 Voice config sample_rate: {voice.config.sample_rate}")
    
    ❌❌❌❌ FAILLED DUE TO GENERATOR SYNTHESIS ITERATION LAZYNESS IT NEEDS AN ACTIVATION LOOP 
    TO KEEP SPINNING EXECUTION.. FIXED BY ADDING A FOR LOOP
   
    # 1. Synthesize raw 16-bit PCM audio into an in-memory buffer
    pcm_buffer = io.BytesIO()
    
    voice.synthesize(text, pcm_buffer)
    raw_bytes = pcm_buffer.getvalue()
    print(f"🔍 raw_bytes length: {len(raw_bytes)}")
    

    if not raw_bytes:
        return b""

    # 2. Convert PCM bytes into a NumPy array
    audio_array = np.frombuffer(raw_bytes, dtype=np.int16)

    # 3. Pitch shift via resampling
    resampled = zoom(audio_array, 1 / pitch_factor)
    manipulated = np.clip(resampled, -32768, 32767).astype(np.int16)

    # 4. Wrap manipulated PCM inside a WAV container
    sample_rate = voice.config.sample_rate
    wav_io = io.BytesIO()

    with wave.open(wav_io, "wb") as wav_file:
        wav_file.setnchannels(1)                  # Mono
        wav_file.setsampwidth(2)                  # 16-bit (2 bytes per sample)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(manipulated.tobytes())

    return wav_io.getvalue()"""




def process_text_to_wav(text: str, pitch_factor: float = 0.88) -> bytes:
    #print(f"🔍 Input text: '{text}'")
    #print(f"🔍 Voice object: {voice}")
    #print(f"🔍 Voice config sample_rate: {voice.config.sample_rate}")
    #tts_chunk = text
    
    
    # 1. Collect raw 16-bit PCM bytes directly from the generator
    pcm_chunks = []
    
    # Piper yields AudioChunk objects containing .audio_int16_bytes
    for chunk in voice.synthesize(text):
        pcm_chunks.append(chunk.audio_int16_bytes)

    raw_bytes = b"".join(pcm_chunks)
    #(f"🔍 raw_bytes length: {len(raw_bytes)}")

    if not raw_bytes:
        return b""

    # 2. Convert PCM bytes into a NumPy array
    audio_array = np.frombuffer(raw_bytes, dtype=np.int16)

    # 3. Resample array for pitch adjustment
    resampled = zoom(audio_array, 1 / pitch_factor)
    manipulated = np.clip(resampled, -32768, 32767).astype(np.int16)

    # 4. Pack into final WAV file structure
    sample_rate = voice.config.sample_rate
    wav_io = io.BytesIO()

    with wave.open(wav_io, "wb") as wav_file:
        wav_file.setnchannels(1)                # Mono
        wav_file.setsampwidth(2)                # 16-bit PCM (2 bytes)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(manipulated.tobytes())

    return wav_io.getvalue()