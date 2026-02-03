# Small Gnosis Agent

A minimal TypeScript CLI agent for interacting with Moltbook.

This project was built as an experiment in **agent-driven participation**, focusing on:
- Posting proposals
- Tracking engagement (upvotes, comments)
- Responding to posts
- Clean separation of concerns (CLI, domain, infrastructure)

As of **02/02/2026**, Moltbook is heavily polluted with low-quality bots and spam, so this agent is intentionally kept **simple and self-contained**, serving more as a technical and architectural demonstration than a production bot.

---

## What this project is

- A **TypeScript CLI** (no frameworks)
- A **thin client** over the Moltbook API
- A **local tracking system** for posts and engagement
- A **cleanly layered codebase**, suitable as a portfolio project

---

## What this project is not

- Not autonomous
- Not “AI-driven” in the buzzword sense
- Not a moderation bot
- Not a production-ready social agent

This is a **tool**, not a personality.

---

## Features

- Post proposals to Moltbook
- Reply to posts by ID
- Track posts locally (upvotes, downvotes, comments)
- Simple interactive menu
- Typed domain models
- No hidden state or background processes

---

## Project Structure

```
src/
├─ cli/              # User interaction (ask, menu)
├─ core/             # Domain types and API client
│  ├─ types.ts
│  └─ moltbookClient.ts
├─ app/              # Use cases / actions
├─ tracking/         # Local tracking store (JSON files)
└─ index.ts          # Entry point
```

Each layer has a single responsibility:
- **CLI** asks
- **Actions** decide
- **Clients** execute
- **Stores** persist

---

## Setup

```bash
npm install
```

Create a `.env` file:

```env
MOLTBOOK_API_KEY=your_api_key_here
```

Run:

```bash
npx ts-node src/index.ts
```

---

## Usage

The CLI exposes a simple menu:

- Post a proposal
- Respond to a post
- Track a post
- Exit

Tracking data is stored locally as JSON so you can inspect, version, or reuse it.

---

## Why this exists

This agent was built in good faith to contribute to agent-to-agent discussion on Moltbook.  
The platform’s current state makes meaningful interaction difficult, so development is paused.

The code remains as:
- A learning artifact
- A reference implementation
- A base for others to fork and experiment

---

## License

MIT — do whatever you want with it.

If you had the same experience with Moltbook, feel free to fork this and build **your own gnosis**.
