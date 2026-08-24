"""Codebase Documentation Note
Issue: process_text_to_wav returned empty audio (b"") / HTTP 200 with no content. 
date 20/08/2026---> 2days debugging

Root Cause: API contract mismatch with piper-tts. voice.synthesize() was called 
as a standard synchronous function with a target buffer, but in piper-tts v1.0.0, 
synthesize() is a lazy Python generator.

Explanation in Simple Terms:
Calling a generator creates an execution iterator in memory—it does not 
actually run the underlying C++ synthesis code or ONNX model. Because nothing 
triggered the generator (no for loop or next() call), execution bypassed audio
creation entirely, leaving the buffer empty (0 bytes) and returning b"".

Resolution:
Iterate over voice.synthesize(text) using a for loop to consume the yielded
AudioChunk objects, collect chunk.audio_int16_bytes, and join them into a unified byte buffer.

3 Rules for Working with Unfamiliar Audio & ML Libraries
Watch Out for "Lazy" Generator Returns: If a library function returns immediately
without throw-away errors or processing time, check if it's yielding items instead 
of returning a finished object. Audio, video, and LLM streaming tools almost always 
use generators (yield).

Check the Return Types, Not Just Function Names: In compiled wrapper packages 
(like Python wrappers over C++ or Rust tools like Piper, ONNX, or Whisper), functions
rarely write straight to Python buffer objects (io.BytesIO) unless explicitly 
accepting a wrapper handle like wave.open(). Always print type(result) during initial testing.

Test the Model Standalone First: When integrating native wrappers into API 
frameworks (FastAPI, Flask, etc.), verify the model call inside an isolated script 
with a simple print(type(output)) before placing it inside endpoint handlers that might
obscure return types."""