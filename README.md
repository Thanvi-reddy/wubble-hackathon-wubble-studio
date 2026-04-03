# 🎧 Wubble Studio — Intelligent AI Music Experience

Wubble Studio is a forward-thinking AI music generation platform that focuses on **guided exploration** and **intelligent evolution**. Instead of just generating static outputs, it acts as a co-creator, suggesting moods, adding depth, and allowing for instant version comparison.

---

## 🏆 Engineering Excellence (Hire This Person Build)

This project has been architected for **scalability, maintainability, and product-level performance.** Unlike a typical hackathon "wrapper," this is a full-stack system.

### 🧩 Specialized Architecture
- **📡 Services Layer (`/src/services/wubbleApi.js`):** High-reliability API interaction with robust polling, timeout management, and custom error handling.
- **🧠 Logic Engine (`/src/utils/promptEngine.js`):** An organic "thinking" layer that selects random variations for remixing to ensure diverse, intelligent outputs.
- **🔊 Audio Controller Hook (`/src/hooks/useAudio.js`):** A custom React hook that manages play/pause, preloading, and track switching to enable **instant A/B comparison.**
- **⚛️ Centralized State:** A unified `session` state design for deterministic UI behavior.

### 🎯 Key Product Differentiators
- **Guided Intelligence:** Explains *why* suggestions are made (e.g., "Adding bass will give it more depth").
- **Compare Mode:** Seamlessly switch between v1 and v2 instantly (zero buffering).
- **Evolution Path:** Visual breadcrumb UI tracking your creative journey.

---

## 📺 Winning Demo Script

1. **The Hook:** *"I built Wubble Studio to bridge the gap between complex AI and intuitive music creation via guided evolution."*
2. **The Preset:** Click **"🎧 Study,"** then **Generate.** 
3. **The Intelligence:** Show the "AI Suggested Next" button. Say: *"The system intelligently recommends energy for focus."* Hit the energy button.
4. **The Aha! Moment:** Click **"COMPARE v1 vs v2."** Switch between them instantly. Say: *"Notice the growth from lofi to a focused beat. This is evolving sound."*
5. **The Close:** *"Thank you."*

---

## 🛠️ Setup

1. `npm install`
2. Update `src/config.js` with your `WUBBLE_API_KEY`.
3. `npm run dev`

---

Built for the **Wubble Hackathon** by **Thanvi Reddy**.
