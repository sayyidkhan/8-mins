# The Next 8 Seconds

**Draw your way home.** A playable storybook about helping Bob refuse pressure, find support, and get home safely. Built for the anti-drug hackathon with React, TypeScript, and Vite.

## Run locally

```sh
npm install
cp .env.example .env   # First setup only, if .env does not already exist
```

Choose the provider explicitly in `.env` or your deployment environment. All keys are **server-only**: never prefix them with `VITE_` or put them in client code.

| Environment | Setting | Required key | Optional model setting (default) |
| --- | --- | --- | --- |
| Local development | `DRAWING_AI_PROVIDER=openai` | `OPENAI_API_KEY` | `OPENAI_MODEL` (`gpt-4.1-mini`) |
| Google AI Studio | `DRAWING_AI_PROVIDER=gemini` | `GEMINI_API_KEY` | `GEMINI_MODEL` (`gemini-3.6-flash`) |

When the provider is unset, it defaults to Gemini. The application never silently falls back to another provider. Both integrations need model access and available API credits/quota. Restart the server after changing provider settings.

```sh
npm run dev
```

Open the URL printed by Vite (port `3000` by default; another port if occupied). The Vite plugin serves the recognition API in both development and preview.

```sh
npm run lint    # TypeScript checks
npm run test:api # API contract/error tests with a mocked provider
npm run build   # Production output in dist/
npm run preview # Preview the build with the API
npm start       # Production Express server: built frontend + API
```

Run `npm run build` before preview or production. `npm start` uses `tsx`, currently a dev dependency, so install with `npm install` including dev dependencies. Express defaults to port `3000` (`PORT` can override it). Static hosting alone does not provide the API. Automated API tests do not establish live provider availability; a live recognition check requires configured credentials and available credits/quota.

## Play

1. Choose the **8-second challenge** or **Untimed** on the cover.
2. **Open the storybook** starts the eight-second countdown immediately in timed mode.
3. Read the situation and freely sketch one of the three object hints **directly over the story art**, using a mouse, finger, or pen. Hint cards are not preselection buttons; there is no separate tracing pad. Undo and clear/erase are available without resetting the clock.
4. At expiry, your actual ink is cropped into a PNG and automatically sent to the server for recognition by the configured AI provider. **Finish sketch** submits earlier. A confident match brings the authored object/action to life and shows its learning takeaway.
5. Click **Turn the page** to start the next chapter and its fresh eight-second countdown immediately. Complete five chapters to fill the final sketchbook with your actual choices.

There is no separate ready/start step. Empty or insufficient ink offers recovery; an uncertain match asks for a clearer drawing. Network, timeout, configuration, and quota errors offer **Retry recognizing this sketch**, which resends the exact saved PNG without guessing an answer. Earlier chapters remain complete. Pause, help, and hiding the tab preserve the drawing and remaining time; returning from another tab requires an explicit resume.

**Untimed** supports the same free drawing with **Finish sketch**, plus an explicit **Keyboard alternative · no drawing recognition** section whose buttons choose an authored action directly without AI. There is no moral score or claim that a missed timer increases drug desire. The emergency chapter shows fixed 995 guidance and offers direct emergency continuation on recovery.

## Implementation

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Game states, timer, chapter navigation, recovery, dialogs, and ending |
| `src/game/story.ts` | Five authored chapters, choices, consequences, and support links |
| `src/game/SceneSketch.tsx` | Freehand scene overlay, undo/clear, and cropped ink-only PNG export |
| `src/game/ObjectGlyph.tsx` | Object hint and memory illustrations |
| `src/game/StoryWorld.tsx` | Original layered SVG scenery, characters, and materialised objects |
| `src/index.css` | Responsive storybook UI |
| `src/game/sketch.css`, `src/game/world.css` | Drawing overlay and scene styles |
| `server/recognition.ts` | Validated PNG API, provider selection, and bounded OpenAI/Gemini classification |
| `server/env.ts`, `server/vite-plugin.ts` | Server-only environment loading and dev/preview API |
| `server/index.ts` | Production Express API and built frontend hosting |
| `server/recognition.test.ts` | Provider-independent API validation and failure tests |

`POST /api/recognize-drawing` accepts a chapter ID and the player's ink-only PNG, excluding the scene artwork. The server supplies the chapter's three authored choices and uses the same prompt and output schema for OpenAI and Gemini: a matching choice ID or `null`, plus confidence. Only an allowed ID with confidence at least `0.55` triggers an authored scene/outcome; uncertainty prompts redraw. AI does not write story branches or safety advice, and service errors never select a fallback answer. OpenAI requests use the Responses API with `store: false`.

The world is original SVG artwork. Images and videos in `research/` are inspiration references; the game has no runtime dependency on them.

Progress is held in memory and resets on reload or replay. The existing starter components in `src/components/` are not used by this experience.

## Product context

- [Product requirements](docs/game-prd.md)
- [Hackathon brief](docs/hackathon-problem-statement.md)
- [Judging criteria](docs/hackathon-judging-criteria.md)
- [Storybook inspiration](docs/inspiration/the-tale-we-drew-linkedin.md)

The story is educational rehearsal, not medical advice. Emergency guidance is fixed and Singapore-specific: call **995**, stay with the person, and follow the operator. Educational wording should be reviewed with a hackathon facilitator before submission.
