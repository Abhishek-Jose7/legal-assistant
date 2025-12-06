# Future Implementation Plan

Here are several high-impact features suggested to enhance the Legal AI Assistant:

## 1. Multilingual Support (Indic Languages)
**Why:** Legal terminology is complex, and many Indian users are more comfortable in vernacular languages (Hindi, Marathi, Tamil, etc.).
**Implementation:**
- Use the **Google Translate API** or **Azure Translator** to translate user queries before processing and AI responses before displaying.
- Add a "Language Toggle" in the header.

## 2. Voice-to-Text Legal Queries
**Why:** Typing long legal situations on mobile is difficult. Voice input makes the app accessible to a wider demographic.
**Implementation:**
- Integrate **Web Speech API** (native browser support) for the microphone input in the Chat interface.
- Add a "Mic" button next to the Send button.

## 3. "Uber-style" Lawyer Map
**Why:** Users often want to find lawyers *nearby*.
**Implementation:**
- Use **Mapbox** or **Google Maps API**.
- Show lawyer pins based on location.
- Integrate with the existing `/lawyers` page.

## 4. Document OCR Scanner
**Why:** Users often have physical notices or court documents. Uploading a photo and extracting text is faster than typing.
**Implementation:**
- Use **Tesseract.js** (client-side) or **Google Cloud Vision API** (server-side).
- Add a "Camera" button in the Chat input area to capture/upload documents directly.

## 5. WhatsApp Integration
**Why:** WhatsApp is the primary communication tool in India.
**Implementation:**
- Use **Twilio API** or **WhatsApp Business API** to allow users to chat with the Legal Bot via WhatsApp.

---

## Mobile Optimization Status
- **Chat Interface:** Converted to a fixed-height, app-like experience (Footer removed, internal scrolling enabled).
- **Dashboard:** Grid layouts confirmed responsive (`grid-cols-1` on mobile).
- **Navigation:** Mobile drawer (Hamburger menu) is active and functional.
