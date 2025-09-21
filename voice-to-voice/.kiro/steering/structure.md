# Project Structure

## Directory Layout
```
gemini-vtvbot/
├── main.py          # Main application entry point
├── README.md        # Project documentation
├── .env             # Environment variables (API keys)
└── .git/            # Git repository data
```

## File Organization

### `main.py`
- Single-file application architecture
- Contains all core functionality:
  - Speech recognition setup
  - Generative AI configuration
  - Audio processing and playback
  - Main execution flow

### Configuration Files
- `.env` - Stores sensitive API keys and configuration
- `README.md` - Comprehensive setup and usage documentation

## Code Organization Patterns

### Function Structure
- Modular functions for specific tasks (`get_gemini_response`)
- Global initialization for shared resources (recognizer, model)
- Linear execution flow for voice interaction cycle

### Error Handling
- Try-catch blocks for speech recognition failures
- Graceful degradation for API request errors
- User feedback for recognition issues

### Audio Management
- Temporary file creation for TTS output (`output.mp3`)
- Pygame mixer for audio playback control
- Synchronous audio playback with completion waiting

## Development Conventions
- Environment variable usage for sensitive data
- Descriptive variable names and comments
- Console output for user feedback and debugging
- Device enumeration for hardware compatibility