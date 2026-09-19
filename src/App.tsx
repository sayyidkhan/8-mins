import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, Clock3, Home, Leaf, LoaderCircle, Pause, Pencil, Play, RotateCcw, ShieldCheck, Sparkles, Trash2, Undo2, X } from 'lucide-react';
import StoryWorld from './game/StoryWorld';
import SceneSketch from './game/SceneSketch';
import type { SceneSketchHandle } from './game/SceneSketch';
import ObjectGlyph, { objectNames } from './game/ObjectGlyph';
import { chapters, resources } from './game/story';
import type { StoryChoice } from './game/story';

type Phase = 'intro' | 'drawing' | 'recognizing' | 'outcome' | 'detour' | 'ending';
const World = memo(StoryWorld);
const WINDOW_MS = 8000;

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => { dialog.current?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="book-dialog" aria-labelledby="dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-inner">
      <button className="icon-control dialog-close" aria-label="Close dialog" onClick={onClose}><X size={20} /></button>
      <div className="section-tag"><BookOpen size={14} /> A NOTE IN THE MARGIN</div>
      <h2 id="dialog-title">{title}</h2>
      {children}
    </div>
  </dialog>;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const phaseRef = useRef<Phase>('intro');
  const [chapterIndex, setChapterIndex] = useState(0);
  const [relaxed, setRelaxed] = useState(false);
  const [selected, setSelected] = useState<StoryChoice | null>(null);
  const [memories, setMemories] = useState<StoryChoice[]>([]);
  const [remaining, setRemaining] = useState(WINDOW_MS);
  const remainingRef = useRef(WINDOW_MS);
  const deadlineRef = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [help, setHelp] = useState(false);
  const [restartPrompt, setRestartPrompt] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [recognitionIssue, setRecognitionIssue] = useState<{ title: string; message: string; retry: boolean } | null>(null);
  const [usedAI, setUsedAI] = useState(false);
  const sketchRef = useRef<SceneSketchHandle>(null);
  const lastImage = useRef<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const submitRef = useRef<() => void>(() => {});
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chapter = chapters[chapterIndex];
  const inStory = phase !== 'intro' && phase !== 'ending';
  const blocked = paused || help || restartPrompt;

  function goTo(next: Phase) { phaseRef.current = next; setPhase(next); }

  useEffect(() => {
    if (phase !== 'drawing' || relaxed || blocked) return;
    deadlineRef.current = performance.now() + remainingRef.current;
    const interval = window.setInterval(() => {
      const left = Math.max(0, deadlineRef.current - performance.now());
      remainingRef.current = left;
      setRemaining(left);
      if (left === 0 && phaseRef.current === 'drawing') submitRef.current();
    }, 40);
    return () => {
      window.clearInterval(interval);
      remainingRef.current = Math.max(0, deadlineRef.current - performance.now());
    };
  }, [phase, relaxed, blocked]);

  useLayoutEffect(() => { submitRef.current = () => { void recognizeSketch(); }; });
  useEffect(() => () => { requestId.current += 1; requestRef.current?.abort(); }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && phaseRef.current === 'drawing') setPaused(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    if (phase !== 'intro' && window.matchMedia('(max-width: 900px)').matches) {
      if (phase === 'drawing') document.querySelector('.play-layout')?.scrollIntoView({ block: 'start', behavior: 'instant' });
      else panelRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [phase, chapterIndex]);

  function beginAttempt(untimed = relaxed) {
    requestId.current += 1;
    requestRef.current?.abort();
    lastImage.current = null;
    setRecognitionIssue(null);
    setHasInk(false);
    setUsedAI(false);
    remainingRef.current = WINDOW_MS;
    setRemaining(WINDOW_MS);
    setSelected(null);
    setAttempt(current => current + 1);
    setRelaxed(untimed);
    setPaused(false);
    goTo('drawing');
  }

  function completeChoice(choice: StoryChoice, fromAI = false) {
    setSelected(choice);
    setUsedAI(fromAI);
    setMemories(current => [...current.slice(0, chapterIndex), choice]);
    goTo('outcome');
  }

  async function recognizeSketch(retry = false) {
    if (blocked || (retry ? phaseRef.current !== 'detour' : phaseRef.current !== 'drawing')) return;
    const image = retry ? lastImage.current : sketchRef.current?.getImage();
    if (!image) {
      setRecognitionIssue(null);
      goTo('detour');
      return;
    }
    lastImage.current = image;
    setRecognitionIssue(null);
    goTo('recognizing');
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;
    const currentRequest = ++requestId.current;
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch('/api/recognize-drawing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: chapter.id, image }), signal: controller.signal,
      });
      const result = await response.json().catch(() => {
        throw new Error('The recognition service did not return a valid response. Your sketch is saved here; please try again.');
      });
      if (currentRequest !== requestId.current) return;
      if (!response.ok) {
        const messages: Record<string, string> = {
          KEY_NOT_CONFIGURED: 'The selected AI provider is not configured yet. Add its server API key, then retry your saved sketch.',
          PROVIDER_QUOTA_EXCEEDED: 'The AI provider has reached its credits or quota limit. Your sketch is saved here; retry after credits or quota are available.',
          PROVIDER_AUTH_FAILED: 'The server’s AI credentials need attention. Your sketch is saved here for a retry.',
          MODEL_UNAVAILABLE: 'The configured AI model is unavailable. Update OPENAI_MODEL or GEMINI_MODEL for the selected provider, then retry.',
          RECOGNITION_TIMEOUT: 'The AI took too long to respond. Your sketch is saved here; try recognizing it again.',
        };
        throw new Error(messages[result?.code] ?? 'The AI could not be reached. Your sketch is saved here; please try again.');
      }
      const match = chapter.choices.find(choice => choice.id === result.choiceId);
      if (!match || typeof result.confidence !== 'number' || !Number.isFinite(result.confidence) || result.confidence < 0.55 || result.confidence > 1) {
        setRecognitionIssue({ title: 'Let’s try a clearer shape.', message: 'The AI could not confidently match your sketch to one of these three objects. Try drawing just one object, with a clear outline.', retry: false });
        goTo('detour');
        return;
      }
      completeChoice(match, true);
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setRecognitionIssue({ title: 'Your sketch is safe.', message: controller.signal.aborted ? 'Recognition took too long. Try sending your saved sketch again.' : error instanceof Error ? error.message : 'Recognition is unavailable. Please try again.', retry: true });
      goTo('detour');
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  function continueStory() {
    if (chapterIndex === chapters.length - 1) { goTo('ending'); return; }
    setChapterIndex(current => current + 1);
    beginAttempt();
  }

  function reset() {
    requestId.current += 1; requestRef.current?.abort(); lastImage.current = null;
    setHasInk(false); setRecognitionIssue(null); setUsedAI(false);
    goTo('intro'); setChapterIndex(0); setSelected(null); setMemories([]);
    setPaused(false); setHelp(false); setRestartPrompt(false);
    remainingRef.current = WINDOW_MS; setRemaining(WINDOW_MS);
  }

  function emergencyContinue() {
    requestId.current += 1; requestRef.current?.abort();
    completeChoice(chapter.choices[0]);
  }

  return <div className={`storybook phase-${phase}`}>
    <header className="site-header">
      <button className="wordmark" onClick={() => inStory ? setRestartPrompt(true) : reset()} aria-label="The Next 8 Seconds, return to cover">
        <span className="brand-icon"><BookOpen size={23} strokeWidth={1.5} /><span>✦</span></span>
        <span>THE NEXT <b>8</b> SECONDS<small>A LITTLE COURAGE GOES A LONG WAY</small></span>
      </button>
      <div className="header-right">
        <span className="edition-label">AN INTERACTIVE STORYBOOK</span>
        <button className="help-button" aria-label="How to play" onClick={() => setHelp(true)}><CircleHelp size={17} /><span>How to play</span></button>
        {inStory && <button className="icon-control" onClick={() => setPaused(true)} aria-label="Pause story"><Pause size={18} /></button>}
      </div>
    </header>

    <main>
      {phase === 'intro' ? <section className="cover page-enter">
        <div className="cover-copy">
          <p className="section-tag"><span className="tiny-star">✦</span> A STORY YOU HELP CREATE</p>
          <h1>A little ink.<br />A way <em>home.</em></h1>
          <p className="cover-lead">One boy. One magical sketchbook.<br />And the courage to choose his own path.</p>
          <p className="cover-description">Help Bob find his way home. Draw right into his world. AI reads your sketch and brings a helpful object to life.</p>
          <div className="mode-picker" role="group" aria-label="Choose your play mode">
            <button className={!relaxed ? 'active' : ''} onClick={() => setRelaxed(false)} aria-pressed={!relaxed}><Clock3 size={15} /> 8-second challenge</button>
            <button className={relaxed ? 'active' : ''} onClick={() => setRelaxed(true)} aria-pressed={relaxed}><Leaf size={15} /> Untimed</button>
          </div>
          <p className="mode-explanation">{relaxed ? 'Sketch at your own pace, or use the keyboard alternative.' : 'Each page starts the clock. Sketch one of three objects in eight seconds.'}</p>
          <button className="button button-primary cover-cta" onClick={() => beginAttempt()}>Open the storybook <ArrowRight size={19} /></button>
          <div className="cover-meta"><span><BookOpen size={14} /> 5 little chapters</span><span className="meta-dot">·</span><span>No perfect drawings needed</span></div>
        </div>
        <div className="cover-art">
          <div className="book-corner corner-top" /><div className="book-corner corner-bottom" />
          <World chapter={0} phase="intro" />
          <div className="art-caption"><span>THE WAY HOME</span><p>Every brave choice begins with a little line.</p><span className="caption-star">✦</span></div>
          <div className="sketch-stamp"><Pencil size={20} strokeWidth={1.3} /><span>YOUR DRAWINGS<br />MAKE A DIFFERENCE</span></div>
        </div>
      </section> : phase === 'ending' ? <section className="ending page-enter" ref={panelRef}>
        <div className="ending-heading"><span className="section-tag"><Home size={15} /> THE LIGHT WAS ON FOR YOU</span><h1 ref={headingRef} tabIndex={-1}>A way home.<br /><em>Drawn by you.</em></h1><p>Bob is home, with someone who listens.<br />These are the little things you helped him do.</p></div>
        <div className="ending-art"><World chapter={4} phase="ending" /></div>
        <div className="memory-heading"><span className="section-tag">BOB’S SKETCHBOOK</span><span>Five pages. Five ways forward.</span></div>
        <div className="memory-grid">{memories.map((memory, index) => <article className="memory-card" key={memory.id}>
          <span className="memory-number">0{index + 1}</span><ObjectGlyph shape={memory.object} size={84} /><h3>{memory.label}</h3><p>{memory.memory}</p>
        </article>)}</div>
        <div className="ending-note"><Leaf size={21} /><p>You don’t need magic to leave a difficult situation,<br className="desktop-break" /> say no, or ask someone to stand beside you.</p></div>
        <div className="ending-actions"><button className="button button-primary" onClick={reset}><RotateCcw size={17} /> Draw another journey</button><button className="button button-secondary" onClick={() => setHelp(true)}>Help & resources <ArrowRight size={16} /></button></div>
      </section> : <>
        <nav className="journey-nav" aria-label="Story progress">
          <button className="text-button back-cover" onClick={() => setRestartPrompt(true)}><ArrowLeft size={15} /> Cover</button>
          <ol>{chapters.map((item, index) => <li key={item.id} className={`${index === chapterIndex ? 'current' : ''} ${index < memories.length ? 'visited' : ''}`} aria-current={index === chapterIndex ? 'step' : undefined}><span>{index < memories.length ? <Check size={12} /> : index + 1}</span><span className="step-name">{['The invitation', 'A quiet question', 'Room to breathe', 'Show up', 'Home'][index]}</span></li>)}</ol>
          <span className="journey-home"><Home size={16} /></span>
        </nav>
        <section className={`play-layout ${(phase === 'drawing' || phase === 'recognizing') ? 'is-drawing' : ''}`}>
          <div className="scene-column">
            <div className="scene-art"><World chapter={chapterIndex} phase={phase === 'recognizing' ? 'drawing' : phase} object={selected?.object} />
              {(phase === 'drawing' || phase === 'recognizing' || phase === 'detour') && <SceneSketch key={`${chapter.id}-${attempt}`} ref={sketchRef} enabled={phase === 'drawing' && !blocked} onInkChange={setHasInk} />}
              <div className="scene-location"><span className="location-dot" />{chapter.location}</div>
              <div className="scene-folio">{String(chapterIndex + 1).padStart(2, '0')}<span>/ 05</span></div>
              {phase === 'drawing' && !hasInk && <div className="scene-draw-hint"><Pencil size={24} strokeWidth={1.4} /><span>Draw your idea over the scene</span></div>}
              {phase === 'recognizing' && <div className="recognition-overlay" role="status"><LoaderCircle className="loading-spin" size={27} /><span>Understanding your drawing…</span><small>The clock has stopped. Let’s see what you made.</small></div>}
            </div>
            {phase === 'drawing' && <div className="sketch-toolbar"><div><button className="icon-control" onClick={() => sketchRef.current?.undo()} disabled={blocked || !hasInk} aria-label="Undo last stroke"><Undo2 size={17} /></button><button className="icon-control" onClick={() => sketchRef.current?.clear()} disabled={blocked || !hasInk} aria-label="Clear drawing"><Trash2 size={17} /></button></div><span>{relaxed ? 'A little ink. Your own pace.' : 'AI reads your sketch when time is up.'}</span><button className="button button-primary" onClick={() => { void recognizeSketch(); }} disabled={!hasInk || blocked}>Finish sketch <Check size={17} /></button></div>}
            <div className="scene-caption"><span className="tiny-star">✦</span><p>{phase === 'outcome' ? 'Something you drew became a way forward.' : phase === 'detour' ? 'There is still a way forward. Turn the page gently.' : 'A little courage. A little ink. One step closer to home.'}</p></div>
          </div>

          <section className="story-panel" ref={panelRef} aria-label={`Chapter ${chapterIndex + 1}`}>
            <div className="panel-topline"><span className="section-tag">CHAPTER {String(chapterIndex + 1).padStart(2, '0')}</span><span className="page-mode">{relaxed ? <><Leaf size={13} /> Untimed</> : <><Clock3 size={13} /> 8-second challenge</>}</span></div>
            {phase === 'drawing' && <div className="drawing-page">
              <div className="drawing-title"><h1 ref={headingRef} tabIndex={-1}>{chapter.title}<span className="title-dot">.</span></h1>
                {relaxed ? <div className="relaxed-emblem"><Leaf size={26} /><span>YOUR PACE</span></div> : <div className={`countdown ${remaining <= 3000 ? 'countdown-urgent' : ''}`} role="timer" aria-label={`${Math.ceil(remaining / 1000)} seconds remaining`}>
                  <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="35" /><circle cx="40" cy="40" r="35" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - remaining / WINDOW_MS * 100} /></svg><strong>{Math.ceil(remaining / 1000)}</strong><span>SECONDS</span>
                </div>}
              </div>
              <div className="encounter-cue" key={chapter.id}>
                <p>“{chapter.dialogue.text}”</p>
                <details>
                  <summary>About this moment</summary>
                  <p>{chapter.narration}</p>
                  <p>{chapter.instruction}</p>
                </details>
              </div>
              {chapter.emergency && <div className="emergency-note"><ShieldCheck size={18} /><p>Real emergency? Call <b>995</b> in Singapore. Stay with the person and follow the operator. Don’t wait for a game.</p></div>}
              <p className="draw-instruction">Sketch one of these over the scene. No need to tap an option.</p>
              <ul className="object-hints" aria-label="Three objects you can draw">{chapter.choices.map(choice => <li key={choice.id}>
                <ObjectGlyph shape={choice.object} size={58} /><strong>{objectNames[choice.object]}</strong><span>{choice.label}</span>
              </li>)}</ul>
              <p className="ai-explanation"><Sparkles size={14} /> AI reads the shape you draw and picks the matching action.</p>
              {relaxed && <details className="keyboard-alternative"><summary>Keyboard alternative · no drawing recognition</summary><p>Choose an action directly. This alternative does not use AI.</p>{chapter.choices.map(choice => <button className="button button-secondary full-width" key={choice.id} onClick={() => completeChoice(choice)} disabled={blocked}>{choice.label}<ArrowRight size={14} /></button>)}</details>}
              <button className="text-button drawing-pause" onClick={() => setPaused(true)}><Pause size={13} /> Take a breath · Pause</button>
            </div>}

            {phase === 'recognizing' && <div className="recognition-page page-enter">
              <span className="small-label">A LITTLE MAGIC IN PROGRESS</span><h1 ref={headingRef} tabIndex={-1}>What did you<br /><em>imagine?</em></h1>
              <p className="narration">The AI is looking at your lines and comparing them with this chapter’s three objects. Your drawing time is finished.</p>
              <ul className="object-hints" aria-label="Possible drawing matches">{chapter.choices.map(choice => <li key={choice.id}><ObjectGlyph shape={choice.object} size={54} /><strong>{objectNames[choice.object]}</strong></li>)}</ul>
              <p className="saved-note" role="status"><LoaderCircle className="loading-spin" size={14} /> Recognizing your sketch…</p>
              {chapter.emergency && <div className="emergency-note"><ShieldCheck size={18} /><p>In a real emergency, call <b>995</b> immediately. Never wait for AI or a drawing.</p></div>}
              <button className="text-button mode-link" onClick={() => beginAttempt()}>Cancel and draw again</button>
            </div>}

            {phase === 'outcome' && selected && <div className="page-enter outcome-page">
              <div className="outcome-seal"><ObjectGlyph shape={selected.object} size={57} /><span>✦</span></div>
              <span className="small-label">{usedAI ? `AI RECOGNIZED: ${objectNames[selected.object].toUpperCase()}` : 'YOUR CHOSEN ACTION CAME TO LIFE'}</span>
              <h1 ref={headingRef} tabIndex={-1}>{selected.outcomeTitle}<span className="title-dot">.</span></h1>
              <p className="narration">{selected.outcome}</p>
              <div className="takeaway-note"><Leaf size={19} /><div><span>A LITTLE THING TO REMEMBER</span><p>{selected.takeaway}</p></div></div>
              <button className="button button-primary full-width" onClick={continueStory}>{chapterIndex === 4 ? 'Bring Bob home' : 'Turn the page'} <ArrowRight size={17} /></button>
              <p className="saved-note"><Check size={12} /> A new memory in your sketchbook</p>
            </div>}

            {phase === 'detour' && <div className="page-enter detour-page">
              <div className="detour-symbol"><Leaf size={33} strokeWidth={1} /></div>
              <span className="small-label">A PAUSE, NOT THE END</span>
              <h1 ref={headingRef} tabIndex={-1}>{recognitionIssue?.title ?? chapter.detour.title}<span className="title-dot">.</span></h1>
              <p className="narration" role={recognitionIssue ? 'alert' : undefined}>{recognitionIssue?.message ?? chapter.detour.body}</p>
              {recognitionIssue?.retry && <button className="button button-primary full-width" onClick={() => { void recognizeSketch(true); }}><Sparkles size={16} /> Retry recognizing this sketch</button>}
              {chapter.emergency ? <button className="button button-primary full-width" onClick={emergencyContinue}>Continue: Bob gets emergency help <ArrowRight size={17} /></button> : <button className="button button-primary full-width" onClick={() => beginAttempt()}><RotateCcw size={16} /> Try these eight seconds again</button>}
              <button className="button button-secondary full-width" onClick={() => beginAttempt(true)}><Leaf size={16} /> Continue without a timer</button>
              <p className="saved-note">Earlier pages are safe in your sketchbook.</p>
            </div>}
          </section>
        </section>
      </>}

      {phase === 'intro' && <section className="how-it-works" aria-label="How the story works"><div className="how-heading"><span className="section-tag">A LITTLE MAGIC.<br />A REAL-LIFE LESSON.</span><span className="handdrawn-arrow">⤳</span></div>
        <div className="how-step"><span className="how-icon"><BookOpen size={21} strokeWidth={1.3} /></span><div><h2>Read the moment</h2><p>Meet Bob. See what’s in his way.</p></div></div>
        <div className="how-step"><span className="how-icon"><Pencil size={21} strokeWidth={1.3} /></span><div><h2>Draw into the world</h2><p>Sketch one of three objects over the scene.</p></div></div>
        <div className="how-step"><span className="how-icon"><Sparkles size={21} strokeWidth={1.3} /></span><div><h2>Watch it come to life</h2><p>AI recognizes your idea. Bob takes action.</p></div></div>
      </section>}
    </main>

    <footer className="site-footer"><span>MADE OF LITTLE CHOICES & A LITTLE COURAGE</span><button onClick={() => setHelp(true)}>About this story <ChevronRight size={12} /></button><span className="footer-edition">THE NEXT 8 SECONDS · VOL. 01</span></footer>

    {help && <Modal title="A little guide to your journey." onClose={() => setHelp(false)}>
      <p>Opening the storybook or turning the page starts eight seconds immediately. Look at the three object hints, then sketch one directly over the illustrated scene. You do not select an option first.</p>
      <div className="dialog-callout"><Leaf size={20} /><p><b>There’s no perfect way to draw.</b> AI reads your sketch when time runs out, or when you press “Finish sketch.” If it cannot identify an object, you get another chance. Untimed mode includes a keyboard alternative that chooses an action directly without AI.</p></div>
      <p>Missing the timer means another chance, not failure. Open this guide or pause to stop the clock. Switching tabs pauses the story too.</p>
      <h3>Support beyond the story</h3><p>This fictional story practises refusal and seeking help. It does not diagnose drug use or replace professional advice. In a real emergency in Singapore, call <b>995</b>, stay with the person, and follow the operator.</p>
      <div className="resource-links">{resources.map(resource => <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer">{resource.label}<ArrowRight size={16} /></a>)}</div>
      <small>Only your drawing is sent through the server to the configured AI provider (OpenAI or Gemini). The AI chooses among three authored actions; it does not generate safety advice. Recognition needs a configured API key and available quota. Educational wording should be reviewed with a hackathon facilitator before submission.</small>
      <button className="button button-primary full-width" onClick={() => setHelp(false)}>Back to the story <ArrowRight size={16} /></button>
    </Modal>}

    {paused && !help && <Modal title="The story can wait." onClose={() => setPaused(false)}>
      <p>Take a breath. Your page, drawing, and remaining time are right where you left them.</p>
      <button className="button button-primary full-width" onClick={() => setPaused(false)}><Play size={16} /> Resume the story</button>
      {!relaxed && <button className="button button-secondary full-width" onClick={() => { setRelaxed(true); setPaused(false); }}><Leaf size={16} /> Keep playing without a timer</button>}
    </Modal>}

    {restartPrompt && <Modal title="Turn back to the cover?" onClose={() => setRestartPrompt(false)}><p>This will start a fresh sketchbook. Your current journey will be cleared.</p><button className="button button-primary full-width" onClick={() => setRestartPrompt(false)}>Keep my place <ArrowRight size={16} /></button><button className="button button-secondary full-width" onClick={reset}><RotateCcw size={16} /> Start a new journey</button></Modal>}
  </div>;
}
