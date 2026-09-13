# Trade Assist — AI Trading Research Structuring Tool

A single-page web application that converts natural-language trading research questions into structured, testable experiment specifications. The user types a question like *"Does buying NIFTY after a 1% fall work better in high volatility?"*, and the system uses an LLM to extract structured fields (instrument, timeframe, entry condition, etc.), validates completeness, asks clarifying follow-ups if needed, and returns a clean experiment spec. This is an internship assignment prototype — it structures experiments but does not execute backtests or connect to live market data.

## Architecture

```
User Input → React Frontend (accumulates conversation array in local state)
           → POST /api/conversation/experiment { conversation: [...] }
           → Express Backend (stateless — no server-side history)
           → LangChain agent + Zod schema via Groq LLM (one-shot structured extraction)
           → Deterministic JS validation (findMissingFields)
           → Response: { status: "invalid" | "incomplete" | "complete", ... }
```

- The backend is **stateless**. It stores no conversation history; the frontend sends the full accumulated conversation array on every request. On page reload, the conversation resets.
- The LLM is used purely for **structured extraction** via LangChain's `toolStrategy` with a Zod schema, not as a general chatbot. Each call is a fresh one-shot extraction over the concatenated conversation text.
- Missing-field validation is done by **deterministic JS logic** (`findMissingFields`), not by trusting the model's own `missingFields` output. The model extracts; the code validates.

## Tech Stack

**Backend**: Node.js, Express 5, LangChain (`langchain` + `@langchain/groq`), Zod (schema validation), Mongoose/MongoDB (connected at startup, not actively used for the core feature), CORS.

**Frontend**: React 19, Vite 8, Tailwind CSS 4, Axios, Framer Motion, React Hot Toast, TanStack React Query.

**LLM**: Groq (`openai/gpt-oss-120b` model via `ChatGroq`).

## How the Core Loop Works

The single endpoint `POST /api/conversation/experiment` accepts `{ conversation: string[] }` and returns one of three statuses:

**`invalid`** — The LLM sets `isValidTradingQuestion: false`. Returned for off-topic input (greetings, general advice, non-trading questions).

**`incomplete`** — The LLM extracted a valid trading question, but deterministic validation found that one or more required fields (`instrument`, `timeframe`, `entryCondition`) are missing. The backend returns a pre-written clarifying question for the first missing field.

**`complete`** — All required fields are present. The full structured experiment object is returned.

```
// Example: incomplete → complete flow

POST { conversation: ["Does buying NIFTY after a 1% fall work in high volatility?"] }
→ { status: "incomplete", clarifyingQuestion: "What timeframe are you analyzing — daily, weekly, intraday?" }

POST { conversation: ["Does buying NIFTY after a 1% fall work in high volatility?",
                       "What timeframe are you analyzing — daily, weekly, intraday?",
                       "Daily"] }
→ { status: "complete", experiment: {
     instrument: "NIFTY", timeframe: "Daily",
     entryCondition: "Buy NIFTY when it drops at least 1% in a day",
     filters: ["Only consider days with high volatility"],
     researchQuestion: "Does buying NIFTY after a 1% fall work better in high volatility?", ... }}
```

## Key Design Decisions

- **Stateless backend** — No persistence of conversation history. Matches assignment scope; the frontend owns the conversation array and sends it fresh each time.
- **Small required-field set** — Only `instrument`, `timeframe`, and `entryCondition` are required. Fields like `exitCondition` and `holdingPeriod` are optional, matching the reality that many research questions leave those unspecified.
- **Deterministic validation over LLM judgment** — The Zod schema includes a `missingFields` array from the model, but the controller ignores it and uses its own `findMissingFields()` against `REQUIRED_FIELDS`. This prevents the model from inconsistently deciding what's "missing enough to ask about."
- **Pre-written clarifying questions** — Rather than asking the LLM to generate a follow-up question, `buildClarifyingQuestion()` maps field names to fixed, clear questions. Removes variability and keeps the UX predictable.

## Out of Scope / Known Limitations

- **No persisted history** — Conversation state lives in React `useState`. A page reload clears everything.
- **No backtesting engine** — The output is a structured experiment spec, not an executed strategy with P&L results.
- **Single instrument only** — The schema has one `instrument` string field; there is no support for multi-instrument comparison.
- **No retry/streaming** — API calls are single-shot with no retry logic beyond basic error handling. No streaming of partial results.
- **MongoDB connected but unused** — `connectDB()` runs at startup (Mongoose connects), but no models are read or written in the active code path. It's wired up for future use but currently inert.
- **Nav buttons are decorative** — The Methodology, History, and Settings buttons in the header are not wired to any functionality.

## AI Tools Used

- **Groq LLM** is a core product component — it performs the natural-language-to-structured-experiment extraction. This is the primary feature, not a coding aid.
- An **AI coding assistant** was used during development for architecture discussion, debugging, and code generation. All product and scope decisions were made by the developer.

## What I'd Improve With More Time

- Database-backed conversation history (persist experiments to MongoDB, allow revisiting past sessions)
- Real backtest execution against historical price data, returning quantitative results
- Multi-instrument and multi-timeframe comparison in a single experiment
- Saved experiment templates that users can fork and modify
- Authentication to gate saved experiments per user