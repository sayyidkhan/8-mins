# The Next 8 Seconds — Draw Your Way Home

## Status and purpose

Product requirements reflecting the implemented playable proof of concept: an illustrated, interactive storybook with timed freehand drawing over the scene and server-side AI recognition. Local development uses OpenAI; Google AI Studio uses Gemini, selected explicitly through configuration. It replaces the earlier chat-based experience.

The recognition integrations are implemented. Automated API contract/error tests use mocked providers; they do not establish live recognition quality or service availability. End-to-end live validation requires configured credentials, model access, and available credits/quota for the selected provider. Record live validation separately from implementation and automated checks.

Build for the [hackathon brief](./hackathon-problem-statement.md) and [judging criteria](./hackathon-judging-criteria.md): concept 30%, message 40%, product 30%. The intended learning outcome is greater confidence in refusing drugs, leaving pressure-filled situations, and seeking appropriate support.

## Concept

**Title:** The Next 8 Seconds

**Tagline:** Draw your way home.

Bob is heading home after an evening out. His sketchbook has an unusual power: helpful objects he draws can become real. Along the way, he meets situations involving peer pressure, uncertain claims, distress, and asking for help. Players freely sketch an object directly over the storyline art, guided by three object hint cards. AI matches the sketch to an authored action that helps him reach safety.

The creative inspiration is *The Tale We Drew*: “The thing I drew actually helped.” See [inspiration notes](./inspiration/the-tale-we-drew-linkedin.md) and the screenshots and gameplay video in `research/`. These are references, not production game assets. The game uses an original SVG world and has no runtime dependency on research images or videos.

## Core decisions

- Reading the moment and freely sketching happen within an **eight-second encounter countdown**.
- Opening the storybook or clicking **Turn the page** starts the next chapter's countdown immediately; there is no separate ready/start confirmation. Untimed mode remains available.
- Each chapter shows **three object hint cards**. Players do not preselect a card or use a separate tracing pad; they draw directly over the illustrated scene with mouse, touch, or pen.
- At expiry, meaningful ink is automatically exported as an actual cropped PNG and sent to the server AI. **Finish sketch** submits earlier. Drawing stops during recognition.
- OpenAI and Gemini use the same prompt and schema, returning only one of the chapter's three authored choice IDs or no match. A confident match materialises the corresponding object and triggers its fixed authored scene/outcome; AI does not generate branches or safety advice.
- Uncertain recognition asks for a redraw. Network, timeout, configuration, and quota errors preserve the exact submitted PNG for retry; the application never guesses a fallback answer.
- Undo and clear/erase are available while drawing without resetting the countdown. Pause, help, and hiding the tab preserve the ink and remaining time.
- Untimed mode supports free drawing and an explicit keyboard direct-action alternative that bypasses AI.
- Outcomes remain recoverable. Missing a deadline or making an unhelpful decision never automatically causes drug use.
- The countdown represents situational/social pressure, not a scientifically asserted increase in desire for drugs.
- “The Next 8 Seconds” names the eight-second challenge at each encounter, not the duration of the whole story. There is no global countdown; total play length may vary.

## Audience and tone

Youth encountering peer pressure and learning how to help themselves or friends. Warm, hopeful, painterly storybook adventure with a little urgency. Use familiar situations, short dialogue, and respectful language. Avoid shame, moral labels, graphic harm, or making drugs appealing.

## Encounter loop

1. **Enter the page:** **Open the storybook** on the cover or **Turn the page** immediately starts a fresh eight-second countdown in timed mode and shows the situation and three object hints.
2. **Understand the moment:** a short dialogue cue stays visible alongside the drawing controls, with expandable narrative details. There is no separate untimed reading or ready screen; players can pause or choose Untimed if they want more time.
3. **Sketch into the world:** freely draw one hinted object over the art. No card selection or outline coverage is required. Undo or erase without restarting the clock.
4. **Submit and recognise:** expiry automatically submits the current meaningful ink, including an active stroke; **Finish sketch** sends it earlier. Export a padded, proportion-preserving crop of the player's actual ink as black strokes on white PNG, excluding the scene art. The clock stops while the server calls the configured AI provider.
5. **Materialise and learn:** an allowed choice ID with confidence at least `0.55` brings its authored object into the world. Show Bob taking the corresponding action and a brief grounded learning takeaway.
6. **Recover or continue:** an empty/insufficient sketch enters recovery without calling the provider. A null or low-confidence result asks for a clearer redraw. A service error offers **Retry recognizing this sketch**, resending the exact saved image. Redraw starts a fresh attempt; untimed recovery is also available. Successful players use **Turn the page** to immediately start the next chapter's clock, or **Bring Bob home** after chapter five.

Simple silhouettes should be feasible within eight seconds; artistic quality is not scored. A stationary tap or insufficient ink cannot submit. Unrelated or ambiguous strokes must not be deliberately mapped to a default action. Prevent page scrolling while drawing with touch.

## Implemented five-page story

`src/game/story.ts` is the shared source of truth. Each chapter has exactly three authored options; the IDs below are the server's allowed recognition targets for that chapter.

### 1. The invitation

A group asks Bob to stay and try something, saying everyone else has.

- **Doorway — leave the situation** (`invitation-leave`): Bob gives a short refusal and heads toward the well-lit route home, ready to seek support if pressure follows.
- **Phone — call an ally** (`invitation-call`): Bob calls his cousin, arranges to meet at a staffed shop, and stays on the line while walking there.
- **Speech bubble — say no clearly** (`invitation-refuse`): Bob refuses, repeats his no when pressure continues, and moves toward the exit with his phone ready.

Takeaway: you can refuse without winning an argument. A practical exit or ally can help.

### 2. The reassuring claim

Someone says an unknown substance is harmless and urges Bob to trust them.

- **Stop sign — decline the offer** (`claim-decline`): Bob does not accept the unknown drug and moves away without testing the claim.
- **Phone — seek reliable advice** (`claim-advice`): Bob steps away and calls his aunt, who helps him find official support information rather than pretending to identify the drug.
- **Doorway — leave the offer behind** (`claim-leave`): Bob declines and enters a nearby lit, staffed shop for distance from the offer.

Takeaway: confidence, popularity, or an unknown product's appearance does not establish safety. Avoid taking unknown substances.

### 3. The difficult moment

Bob feels upset and alone after the encounter. Someone offers a substance as an escape.

- **Headphones — take a calming pause** (`distress-pause`): Bob declines, enters the staffed community centre, and takes a moment with familiar music and slow breaths.
- **Phone — call someone trusted** (`distress-connect`): Bob declines, enters the community centre, and calls his older sister to listen.
- **Doorway — ask staff for support** (`distress-support`): Bob declines and asks community centre staff for help in person; they help him contact a trusted adult.

Takeaway: safer responses to distress include a calming pause and reaching out; persistent distress deserves appropriate support. Music is not presented as treatment for addiction or a guarantee of safety.

### 4. A friend needs help

Bob meets a friend who is dizzy, confused, and seriously unwell.

- **Phone — call 995 now** (`emergency-call`): Bob calls immediately, gives their location, stays with his friend, and follows the operator.
- **Signal — signal an adult** (`emergency-alert`): Bob signals a nearby adult to call 995 immediately on speaker, stays with his friend, and follows the operator with the adult.
- **Speech bubble — call out for help** (`emergency-shout`): Bob calls out to an adult facing away with the specific request “Call 995 now,” stays with his friend, and follows the operator when the adult calls.

All three options lead to urgent help, not to waiting for symptoms to pass. For this Singapore-focused story, ambulance/fire emergency assistance is 995. Keep this guidance authored and fixed, visible during drawing and recognition. Recovery offers **Continue: Bob gets emergency help**, a direct authored action without AI or another drawing. Real emergency action must never wait for a game timer, drawing, or AI response.

Takeaway: take serious changes in behaviour or responsiveness seriously, seek emergency help, and do not leave the person alone.

### 5. The last stretch

Bob worries that telling someone about the evening will get him judged.

- **Bridge — reach someone trusted** (`home-connect`): Bob asks his aunt to meet him, walks home with her, and talks about the evening.
- **Phone — call for company home** (`home-call`): Bob calls his dad from a lit, staffed shop, shares his location, waits inside, and walks home with him.
- **Speech bubble — ask for help in person** (`home-talk`): Bob approaches a trusted adult from the community centre, begins talking inside, and arranges for his aunt to accompany him home.

Takeaway: asking for help is a useful action, not a failure. Trusted support can be a parent, caregiver, counsellor, or another appropriate adult.

## Recovery and accessibility

- Timer expiry submits meaningful ink rather than automatically failing the encounter. Empty/insufficient ink or uncertain recognition offers another opportunity, not shame or inevitable harm.
- Service errors retain the exact submitted PNG in memory for recognition retry. Never substitute a guessed answer or label a direct-action choice as AI recognition.
- Preserve completed chapters; retry only the current encounter.
- Provide clearly labelled **Untimed** mode on the cover, through pause, and during recovery. It offers the same narrative and learning outcomes; free drawing still uses AI when **Finish sketch** is pressed.
- In Untimed mode, provide **Keyboard alternative · no drawing recognition** with direct-action buttons for all three authored choices. This explicit alternative does not call AI or require drawing.
- Support reduced motion, readable contrast, visible focus, touch input, and small screens.
- Pause the countdown and preserve ink when the page is hidden or help/pause is opened. Explain pause/resume visibly; do not silently consume the eight seconds behind an overlay. Returning from a hidden tab requires explicit resume. Undo and clear/erase do not reset remaining time.

## Ending

Bob reaches safety. His sketchbook displays the player's actual completed choices as authored object glyphs and concrete memory captions rather than a moral score or support-personality badge. It summarises recognised or directly chosen actions, not an archive of the original PNGs.

Examples:

> You drew an exit. Bob learned he could leave.
>
> You drew a phone. Bob learned he could ask for help.
>
> You helped Bob get home.

Include replay and a help/resources action. The drawings are metaphors; the story must explicitly show the real-world actions they represent.

## POC scope

- One complete, replayable five-encounter story, replacing the earlier chat UI.
- Use the existing React, TypeScript, Vite, Motion, and CSS stack.
- Original lightweight SVG/CSS scenery, characters, object hints, and materialised objects. Do not copy the reference game's characters or artwork; no external image generation or research assets are needed at runtime.
- Typed narrative, choice IDs, consequences, and learning takeaways separate from orchestration and drawing components.
- Freehand scene-overlay input and actual ink-only PNG export; server-side OpenAI/Gemini recognition bounded to three authored actions per chapter. Generated branches or medical advice are outside scope.
- Server-only credentials and the same recognition middleware in Vite development, built-app preview, and production Express hosting. Drawing recognition requires a configured key and available provider credits/quota; the explicit keyboard alternative uses no AI. Provider selection is explicit, with no silent cross-provider fallback.
- No accounts, database, multiplayer, 3D world, or persistence across reloads required.

## Architecture and runtime

```text
Open cover / Turn page -> drawing over original SVG scene (8 seconds, or Untimed)
  |-- Untimed keyboard direct action ----------------------> authored outcome
  |-- expiry / Finish sketch -> cropped ink PNG + chapterId
  |     -> POST /api/recognize-drawing
  |     -> server validates input + loads 3 choices from story.ts
  |     -> configured OpenAI / Gemini -> validates { choiceId, confidence }
  |          |-- allowed ID, confidence >= 0.55 ------------> authored outcome
  |          |-- null / low confidence --------------------> redraw recovery
  |          `-- service error ----------------------------> retry same saved PNG
  `-- empty / insufficient ink ----------------------------> recovery

Authored outcome -> object in scene + takeaway -> next page / final sketchbook
Recovery -> fresh attempt / Untimed / direct emergency continuation (chapter 4)
```

### Components

| Component | Responsibility |
| --- | --- |
| `src/App.tsx` | Cover, phases, immediate countdown, recognition submission, exact-image retry, pause/help, recovery, chapter progression, ending |
| `src/game/story.ts` | Five chapters with three authored choices each, fixed consequences, takeaways, memory captions, and support URLs; shared with server |
| `src/game/SceneSketch.tsx` | Pointer strokes over scene, undo/clear, meaningful-ink check, proportion-preserving padded PNG crop up to 768 px on its longest side |
| `src/game/StoryWorld.tsx` | Original SVG scenery, characters, and authored materialisation |
| `src/game/ObjectGlyph.tsx` | Object illustrations for hints and completed-choice memories |
| `src/index.css`, `src/game/sketch.css`, `src/game/world.css` | Responsive storybook, ink overlay, scene styling, and motion treatment |
| `server/recognition.ts` | Request/PNG validation, explicit provider selection, shared OpenAI/Gemini prompt/schema, confidence and ID validation, safe error responses, timeouts |
| `server/env.ts` | Server-only `.env` loading; deployment environment takes precedence |
| `server/vite-plugin.ts`, `vite.config.ts` | Recognition endpoint for Vite development and preview |
| `server/index.ts` | Production Express API plus static `dist/` and SPA hosting |
| `server/recognition.test.ts` | Mocked-provider tests for API constraints, validation, failures, timeouts, and cancellation |

### Recognition boundary

- The browser sends only `{ chapterId, image }`, where `image` is the actual ink-only PNG data URI. The scene artwork is excluded; the client does not submit a selected choice or define the allowed choices.
- The server validates the request and PNG, then derives the three allowed IDs, object names, and action labels from the authored chapter. The selected provider receives those options and the player's ink, not full story narration or safety advice to rewrite. OpenAI uses the Responses API with `store: false`; neither integration exposes keys to the browser.
- Structured output permits an allowed `choiceId` or `null`, with numeric confidence from 0 to 1. The server validates the response, maps confidence below `0.55` to no match, and rejects invalid IDs or malformed results. The client also checks the returned ID and confidence before completing a choice.
- Null/low-confidence responses prompt redraw. Network, quota, credentials, model, timeout, and invalid-response failures produce recoverable errors rather than fabricated recognition. Retry resends the exact PNG retained for the current attempt.
- Chapter progress, strokes, and the retry image are held in memory. A fresh attempt replaces the current sketch; reload/replay clears the journey. Requests are cancelled or ignored when the player starts a new attempt or restarts.

### Configuration and commands

- Install with `npm install`. On first setup, the developer copies `.env.example` to `.env` if needed. For local development set **`DRAWING_AI_PROVIDER=openai`** and **`OPENAI_API_KEY`**. For Google AI Studio set **`DRAWING_AI_PROVIDER=gemini`** and **`GEMINI_API_KEY`**. Keep keys server-only; never use a `VITE_` prefix or expose them in the browser bundle.
- An unset provider defaults to Gemini; unsupported names are configuration errors, and missing keys never cause fallback to another provider. **`OPENAI_MODEL`** defaults to **`gpt-4.1-mini`**; **`GEMINI_MODEL`** defaults to **`gemini-3.6-flash`**. The selected project needs model access and available API credits/quota. Restart the server after changing provider settings.
- **`npm run dev`** runs Vite with the API plugin. **`npm run build`**, then **`npm run preview`**, serves the built app with the same API plugin.
- **`npm run build`**, then **`npm start`**, runs production Express serving the built frontend and API. `PORT` defaults to `3000`. The start command uses `tsx`, currently a dev dependency: install dev dependencies with `npm install`. A static-only deployment cannot supply recognition.
- **`npm run lint`** checks TypeScript; **`npm run test:api`** exercises the API and both adapters with mocked providers. A build or automated test pass is distinct from a successful live provider check.

## Visual direction

Cream paper, ink typography, forest greens, warm sunset tones, layered hills and trees, a visible winding route toward a warmly lit home, and a recognisable Bob character. Player ink sits directly over the original SVG storyline art before a recognised object becomes an authored scene element. Keep the scene prominent, with three readable object hints and visible drawing controls on mobile and desktop.

## Content and sources

- Explain refusal, practical exits, uncertainty about offered substances, trusted support, and emergency escalation through action.
- Do not equate slow responses, distress, or drawing ability with drug desire or moral worth.
- Avoid unsupported claims about substances and avoid procedural drug-use detail.
- Link to [NCADA support resources](https://www.ncada.org.sg/seeking-help/) and [SCDF emergency medical services](https://www.scdf.gov.sg/home/about-us/information-on-ems) for Singapore help context.
- Have final educational wording reviewed with an NCADA/hackathon facilitator before submission, consistent with the judging rubric.

## Acceptance criteria

1. A new player can understand the objective and start without facilitator instructions.
2. All five encounters have three authored options and can be completed through timed drawing, Untimed drawing, and the explicit keyboard direct-action alternative.
3. Timed play starts a fresh eight-second window immediately on **Open the storybook** or **Turn the page**, including reading and drawing, with no second start button or hint-card preselection.
4. Freehand ink appears directly over the storyline art. Expiry automatically sends a cropped ink-only PNG; **Finish sketch** sends it earlier. Stationary taps/insufficient ink enter recovery without a provider call. Undo/clear do not reset the clock.
5. A valid allowed ID with confidence at least `0.55` completes its authored action. Uncertain recognition requests redraw; network/quota and other service errors offer exact-image retry without guessing a choice or losing earlier chapter progress.
6. Each completed object produces an authored story consequence and practical learning takeaway. AI cannot invent choices, outcomes, or safety advice. Chapter four keeps fixed emergency guidance visible and offers direct emergency continuation in recovery.
7. The final sketchbook reflects the objects/actions actually recognised or explicitly chosen, using authored glyphs and captions.
8. Replay clears previous choices and timers.
9. Mobile touch and desktop pointer interaction work; keyboard users have an explicit alternative.
10. Pause, help, and a hidden tab preserve the drawing and remaining time; returning from a hidden tab requires explicit resume.
11. Type checking, production build, and `npm run test:api` pass. Browser checks cover automatic expiry submission, early finish, clear/undo, uncertainty/redraw, exact-image retry, Untimed drawing, keyboard direct actions, pause/help/hidden state, emergency recovery, and replay.
12. Development, built preview, and Express production expose the same server API with no client-side credentials. Live provider checks are recorded separately and require available provider credits/quota; mocked API tests are not evidence of successful live recognition.
