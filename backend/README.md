# Backend

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set your Gemini API key as an environment variable:
   ```bash
   set GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   (On Linux/macOS: `export GEMINI_API_KEY=your_actual_gemini_api_key`)

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at http://localhost:8000 