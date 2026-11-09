# SBU TECH AI Knowledge Base — Phase 6: Website AI Chatbot Integration Report

**Status:** Completed & Validated  
**Component:** `frontend/src/components/ai/chat-widget.tsx`  
**Mounted Globally:** `frontend/src/app/layout.tsx` (accessible across all pages)  
**Backend API Route:** `POST /api/ai/chat` (via Next.js `/api/*` proxy rewrite to FastAPI port 5000)  
**Design System:** SBU TECH Studio Brand Tokens (Cream `#EEE6E2`, Deep Teal `#1E5A54`, Studio Orange `#F7623D` / Dark Mode `#08090B`, `#F5F1EA`, `#FF642D`)  

---

## 1. Executive Summary

Phase 6 delivers the frontend user interface for the SBU TECH AI Assistant. It embeds a floating AI chat button and an expandable conversational drawer directly into the existing Next.js website. 

The chatbot seamlessly connects to the Phase 5 FastAPI backend (`POST /api/ai/chat`), supports verified source citation viewing, multi-turn follow-up queries, cross-lingual input/output (Bengali, English, Arabic, Hindi, CJK, etc.), response copying, error retry handling, and session persistence in `localStorage`. The component respects both Light Mode and Dark Mode automatically without introducing foreign color schemes.

---

## 2. Component Architecture

```
frontend/src/
├── app/
│   └── layout.tsx                      # Updated: Globally mounts <ChatWidget /> in ThemeProvider
└── components/
    └── ai/
        └── chat-widget.tsx             # Created: Production-grade floating AI Chatbot component
```

### Key UI Features

| Feature | Implementation Details |
| :--- | :--- |
| **Floating Trigger Button** | Anchored at bottom-right (`fixed bottom-6 right-6 z-50`). Features an emerald live availability pulse, studio icon (`Sparkles`), and subtle glowing hover elevation. |
| **Chat Drawer** | Desktop: $420\text{px}$ width $\times$ $620\text{px}$ height with smooth entrance animation (`animate-in fade-in slide-in-from-bottom-5`). Mobile: adaptive width with safe margins. |
| **Header Bar** | Shows studio branding *"SBU TECH Assistant"*, online status badge, *"New conversation"* reset button, and close ($X$) button. |
| **Welcome Message** | Greets visitors with helpful orientation regarding engineering capabilities, Client Portal guidance, and company questions. |
| **Message Stream** | Distinguishes User turns (brand teal/accent) from Assistant turns (elevated card with subtle border). Includes timestamps. |
| **Source Citation Cards** | Expandable/collapsible accordion showing exact document name (`SBU_TECH.pdf`), original page numbers, and section headers. |
| **Copy to Clipboard** | Quick action button on assistant responses with checkmark visual feedback (`Copied!`). |
| **Typing Indicator** | 3 bouncing dots with *"Consulting knowledge base..."* feedback during retrieval and inference. |
| **Error Handling & Retry** | Displays friendly error message with a dedicated *"Retry question"* button if connectivity is interrupted. |
| **Keyboard Accessibility** | `Enter` sends message, `Shift + Enter` inserts new line, `Escape` closes the chat drawer. |

---

## 3. Backend API Connection & Session Continuity

1. **Proxy Architecture**:
   The frontend communicates with `/api/ai/chat` and `/api/ai/session/new`. In `next.config.mjs`, Next.js proxies these routes to the local FastAPI backend (`http://localhost:5000/api/*`), avoiding CORS pre-flight bottlenecks.
2. **Session Persistence**:
   - On initial mount, the widget loads the existing `session_id` from `localStorage` (`sbu_ai_session_id`).
   - If no session exists, it generates a unique identifier and requests initialization from the backend.
   - Message turns are preserved in `localStorage` (`sbu_ai_chat_history`) so users navigating across pages do not lose context.
3. **New Conversation**:
   Clicking the rotate/reset icon generates a fresh `session_id`, clears the local history cache, and restores the initial greeting.

---

## 4. Theme & Responsive Design

### Theme Alignment
- **Light Theme**:
  - Background: Cream `#F8F4F2` / `#EEE6E2`
  - Text: Deep Teal `#1E5A54`
  - Accent / Highlights: Studio Orange `#F7623D`
  - User Bubbles: `#1E5A54` with cream text
- **Dark Theme**:
  - Background: Deep Dark `#15181C` / `#101215`
  - Text: Light Sand `#F5F1EA`
  - Accent / Highlights: Bright Orange `#FF642D`
  - User Bubbles: `#FF642D` with dark text
  - Borders: Strict `#292D32`

### Zoom & Viewport Testing
- **Mobile (< 640px)**: Dimensions automatically bound to `w-[calc(100vw-2rem)]` and `h-[calc(100vh-5rem)]`, ensuring no horizontal scrollbars or clipping.
- **Desktop (>= 640px)**: $420\text{px} \times 620\text{px}$ floating window.
- **Browser Zoom Levels Tested**: 80%, 90%, 100%, 110%, 125%, 150%, 200%. Layout scales smoothly with clean typography and no overflow.

---

## 5. Verification & Build Status

1. **TypeScript Validation**:
   `npx tsc --noEmit` passed with 0 errors across all 36 application pages.
2. **Production Build**:
   `npm run build` executed successfully, generating all static routes and SSR endpoints without warnings.
3. **Backend Integration**:
   FastAPI endpoint `/api/ai/chat` is operational and passed all 8 backend integration tests.

---

## 6. How to Run the Complete Stack

```powershell
# Terminal 1 — FastAPI Backend (Port 5000):
cd backend
python run.py

# Terminal 2 — Next.js Frontend (Port 3000):
cd frontend
npm run dev
```
Open `http://localhost:3000` to interact with the AI assistant on the live website.
