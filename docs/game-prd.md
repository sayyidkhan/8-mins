# The Next 8 Minutes — Draw Your Way Home

## Status and purpose

Agreed product direction for a quick playable proof of concept. This replaces the current chat-based experience with an illustrated, interactive storybook and timed tracing game.

Build for the [hackathon brief](./hackathon-problem-statement.md) and [judging criteria](./hackathon-judging-criteria.md): concept 30%, message 40%, product 30%. The intended learning outcome is greater confidence in refusing drugs, leaving pressure-filled situations, and seeking appropriate support.

## Concept

**Title:** The Next 8 Minutes

**Tagline:** Draw your way home.

Bob is heading home after an evening out. His sketchbook has an unusual power: whatever he finishes drawing becomes real. Along the way, he meets situations involving peer pressure, uncertain claims, distress, and asking for help. Players help him reach safety by selecting and tracing objects that become useful actions in the story.

The creative inspiration is *The Tale We Drew*: “The thing I drew actually helped.” See [inspiration notes](./inpiration/the-tale-we-drew-linkedin.md) and the screenshots and gameplay video in `research/`. These are references, not production game assets.

## Core decisions

- The decision and tracing both happen within an **eight-second encounter countdown**.
- Players trace one of a small set of offered options. There is no unrestricted drawing or generated branching in the POC.
- Finished drawings materialise in the scene, in the spirit of sketching a useful tool or magical defence into existence.
- Outcomes remain recoverable. Missing a deadline or making an unhelpful decision never automatically causes drug use.
- The countdown represents situational/social pressure, not a scientifically asserted increase in desire for drugs.
- “Eight minutes” describes the short story experience and brand, not a second enforced global countdown. Actual play length may vary.

## Audience and tone

Youth encountering peer pressure and learning how to help themselves or friends. Warm, hopeful, painterly storybook adventure with a little urgency. Use familiar situations, short dialogue, and respectful language. Avoid shame, moral labels, graphic harm, or making drugs appealing.

## Encounter loop

1. **Read:** an illustrated page introduces the situation. Reading is untimed.
2. **Prepare:** explain the trace interaction and show the options. The timer starts only after an explicit player action.
3. **Choose and trace:** select one of two or three labelled outline objects; trace it with mouse, touch, or pen before the eight seconds expire. The countdown is shared across selection and drawing and must not reset when changing options.
4. **Materialise:** completing enough of the outline brings the chosen object into the world.
5. **Consequence:** show Bob taking the corresponding action and a brief grounded learning takeaway.
6. **Continue:** move along the route home. An incomplete trace instead introduces a short recoverable detour with a retry or an accessible untimed way forward.

Tracing should be generous, using coverage of the outline rather than artistic quality. Merely tapping, holding still, or drawing somewhere unrelated must not instantly complete it. Prevent page scrolling during a touch trace. Use simple silhouettes feasible within eight seconds.

## Proposed five-page story

### 1. The invitation

A group asks Bob to stay and try something, saying everyone else has.

- **Doorway — leave the situation:** Bob gives a short refusal and heads toward the well-lit route home.
- **Phone — call an ally:** Bob calls someone trusted who helps him leave.
- **Speech bubble — say no:** Bob clearly refuses; if pressure continues, he can still leave or seek support.

Takeaway: you can refuse without winning an argument. A practical exit or ally can help.

### 2. The reassuring claim

Someone says an unknown substance is harmless and urges Bob to trust them.

- **Stop sign — decline:** Bob does not accept the offer.
- **Phone — seek reliable advice:** Bob steps away from the offer and contacts someone trusted rather than relying on the claim.

Takeaway: confidence, popularity, or an unknown product's appearance does not establish safety. Avoid taking unknown substances.

### 3. The difficult moment

Bob feels upset and alone after the encounter. Someone offers a substance as an escape.

- **Headphones — take a calming pause:** Bob declines, reaches a safe place, and takes a moment to settle himself.
- **Phone — contact someone trusted:** Bob tells someone how he feels and asks for support.

Takeaway: safer responses to distress include a calming pause and reaching out; persistent distress deserves appropriate support. Music is not presented as treatment for addiction or a guarantee of safety.

### 4. A friend needs help

Bob meets a friend who is dizzy, confused, and seriously unwell.

- **Phone — get emergency help:** Bob contacts emergency services and stays with the friend while following their instructions.
- **Signal — bring an adult over:** Bob alerts a nearby adult and asks them to contact emergency services immediately; he stays nearby.

Both successful options must lead to urgent help, not to waiting for symptoms to pass. For this Singapore-focused story, ambulance/fire emergency assistance is 995. Keep this guidance authored and fixed. A timeout must never suggest that real emergency action should wait for a drawing: show direct guidance and an immediate way to continue with the safe response.

Takeaway: take serious changes in behaviour or responsiveness seriously, seek emergency help, and do not leave the person alone.

### 5. The last stretch

Bob worries that telling someone about the evening will get him judged.

- **Bridge — reach someone trusted:** Bob connects with a trusted person who helps him get home and talk through what happened.

Takeaway: asking for help is a useful action, not a failure. Trusted support can be a parent, caregiver, counsellor, or another appropriate adult.

## Recovery and accessibility

- When time runs out, Bob hesitates or needs another route. Present another opportunity, not shame or inevitable harm.
- Preserve completed chapters; retry only the current encounter.
- Provide a clearly labelled untimed/accessibility mode from the start and after a timeout. It must offer the same narrative and learning outcomes.
- Provide a keyboard-accessible alternative to pointer tracing, such as choosing the action and bringing the object to life with a button in relaxed mode.
- Support reduced motion, readable contrast, visible focus, touch input, and small screens.
- Pause the countdown when the page is hidden or help/pause is opened. Explain pause/resume visibly; do not silently consume the eight seconds behind an overlay.

## Ending

Bob reaches safety. His sketchbook displays the player's actual completed choices, with concrete captions rather than a moral score or support-personality badge.

Examples:

> You drew an exit. Bob learned he could leave.
>
> You drew a phone. Bob learned he could ask for help.
>
> You helped Bob get home.

Include replay and a help/resources action. The drawings are metaphors; the story must explicitly show the real-world actions they represent.

## POC scope

- Replace the current chat UI with one complete, replayable five-encounter story.
- Use the existing React, TypeScript, Vite, Motion, and CSS stack.
- Create original lightweight SVG/CSS storybook scenery and traceable object outlines. Do not copy the reference game's characters or artwork.
- Keep narrative, choices, outlines, and outcomes in typed data separate from game orchestration.
- Implement deterministic local tracing and authored consequences. No API key, backend, generated medical advice, or external image generation is required to play.
- Clearly distinguish the locally implemented POC from any future AI feature. AI-assisted creation and a possible later bounded interpretation feature are separate from what this build actually does.
- No accounts, database, multiplayer, 3D world, or persistence across reloads required.

## Visual direction

Cream paper, ink typography, forest greens, warm sunset tones, layered hills and trees, a visible winding route toward a warmly lit home, and a recognisable Bob character. Objects should feel like ink strokes on parchment before becoming a coloured scene element. Keep the playable scene prominent, with choices and tracing obvious on mobile and desktop.

## Content and sources

- Explain refusal, practical exits, uncertainty about offered substances, trusted support, and emergency escalation through action.
- Do not equate slow responses, distress, or drawing ability with drug desire or moral worth.
- Avoid unsupported claims about substances and avoid procedural drug-use detail.
- Link to [NCADA support resources](https://www.ncada.org.sg/seeking-help/) and [SCDF emergency medical services](https://www.scdf.gov.sg/home/about-us/information-on-ems) for Singapore help context.
- Have final educational wording reviewed with an NCADA/hackathon facilitator before submission, consistent with the judging rubric.

## Acceptance criteria

1. A new player can understand the objective and start without facilitator instructions.
2. All five encounters can be completed in timed and relaxed modes.
3. Timed play uses one eight-second window per attempt, including choice selection and tracing.
4. A reasonable trace completes; off-target strokes and stationary taps do not.
5. Timeouts offer a working recovery path without losing story progress.
6. Each completed object produces an authored story consequence and a practical learning takeaway.
7. The final sketchbook reflects the objects/actions the player actually chose.
8. Replay clears previous choices and timers.
9. Mobile touch and desktop pointer interaction work; keyboard users have an explicit alternative.
10. Type checking and production build pass, with browser checks for the main path, timeout/retry, relaxed mode, pause, and replay.
