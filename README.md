# Planet Pulse 🌱

**"Measure Today. Improve Tomorrow."**

Planet Pulse is a next-generation environmental intelligence platform that goes beyond simple carbon calculators. It helps users **Understand, Track, Predict, and Reduce** their environmental impact through data analytics, AI-powered coaching, behavioral tracking, and future impact forecasting.

Designed with a premium, venture-backed SaaS aesthetic (inspired by Stripe, Linear, and Vercel), Planet Pulse delivers an immersive, dark-mode first experience for environmentally conscious consumers, governments, and sustainability-focused organizations.

---

## 🌟 Key Features

1. **Understand (Assessment Engine):** A comprehensive multi-step wizard to evaluate transportation, home energy, diet, and work habits.
2. **Track (Analytics Dashboard):** Historical tracking with trend line charts, category breakdowns, and benchmarking against global averages and Paris Climate Targets.
3. **AI Coach:** Powered by Gemini AI, offering personalized reduction strategies, estimated cost savings, and emission impact reasoning based on user data.
4. **Predict (Future Simulator):** An interactive tool to forecast long-term environmental and financial savings.
5. **Reduce (Mission System):** Gamified, actionable goals that allow users to earn Eco Points and level up their sustainability journey.
6. **Community Impact:** A global dashboard showcasing aggregate metrics and tracking the collective difference our users make.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (Dark Mode First, Glassmorphism, CSS Variables)
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Form Management:** React Hook Form & Zod
- **State Management:** Zustand
- **Icons:** Lucide React

### Backend Architecture
- **Framework:** FastAPI (Python 3.11)
- **Validation:** Pydantic v2
- **Rate Limiting:** SlowAPI
- **AI Integration:** OpenRouter (DeepSeek Chat V3)
- **Database:** Supabase (PostgreSQL)
- **Async Tasks:** FastAPI BackgroundTasks

---

## 🚀 Getting Started

To run the Planet Pulse platform locally, you will need to start both the frontend and backend development servers.

### 1. Running the Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file by copying the provided example:
   ```bash
   cp .env.example .env
   ```
   *Make sure to populate `OPENROUTER_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`.*
5. Run the Supabase SQL migration:
   - Execute `backend/supabase_schema/migrations/001_initial_schema.sql` in your Supabase SQL editor.
6. Start the API server:
   ```bash
   uvicorn main:app --reload
   ```
The backend API will be available at `http://localhost:8000`. You can view the interactive Swagger documentation at `http://localhost:8000/docs`.

### 2. Running the Frontend (React + Vite)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file by copying the provided example:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
The frontend application will be available at the URL provided by Vite (typically `http://localhost:5173`).

---

## ♿ Accessibility & Performance

Planet Pulse has been rigorously audited to meet premium industry standards:
- **WCAG 2.1 AA Compliance:** Includes skip-navigation links, robust `:focus-visible` indicators, ARIA live regions for dynamic step changes, and screen-reader optimized forms.
- **Lighthouse Performance:** Optimized with appropriate meta tags, structural semantics, and native Vite build optimization for blazing-fast load times.

---

## ☁️ Cloud Architecture (Production Ready)

The application is designed to be completely free/low-cost to host, relying on modern open-tier services:
- **OpenRouter:** To generate real-time personalized sustainability insights using DeepSeek models.
- **Supabase (PostgreSQL):** For secure, scalable, anonymous history storage and analytics.
- **Railway:** Containerized deployment of the FastAPI backend.
- **Vercel:** Edge deployment for the React/Vite frontend.
- **GitHub Actions:** CI/CD pipelines to automate testing and deployment.

---

*Built with ❤️ for a greener tomorrow.*
