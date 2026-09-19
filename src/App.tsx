import { memo, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, Clock3, Home, Leaf, Pause, Pencil, Play, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import StoryWorld from './game/StoryWorld';
import TraceCanvas, { ObjectGlyph } from './game/TraceCanvas';
import { chapters, resources } from './game/story';
import type { StoryChoice } from './game/story';

type Phase = 'intro' | 'reading' | 'drawing' | 'outcome' | 'detour' | 'ending';
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
      if (left === 0 && phaseRef.current === 'drawing') goTo('detour');
    }, 40);
    return () => {
      window.clearInterval(interval);
      remainingRef.current = Math.max(0, deadlineRef.current - performance.now());
    };
  }, [phase, relaxed, blocked]);

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
      panelRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [phase, chapterIndex]);

  function beginAttempt(untimed = relaxed) {
    remainingRef.current = WINDOW_MS;
    setRemaining(WINDOW_MS);
    setSelected(null);
    setAttempt(current => current + 1);
    setRelaxed(untimed);
    setPaused(false);
    goTo('drawing');
  }

  function finishDrawing() {
    if (phaseRef.current !== 'drawing' || !selected || blocked) return;
    if (!relaxed && performance.now() >= deadlineRef.current) { goTo('detour'); return; }
    setMemories(current => [...current.slice(0, chapterIndex), selected]);
    goTo('outcome');
  }

  function continueStory() {
    if (chapterIndex === chapters.length - 1) { goTo('ending'); return; }
    setChapterIndex(current => current + 1);
    setSelected(null);
    goTo('reading');
  }

  function reset() {
    goTo('intro'); setChapterIndex(0); setSelected(null); setMemories([]);
    setPaused(false); setHelp(false); setRestartPrompt(false);
    remainingRef.current = WINDOW_MS; setRemaining(WINDOW_MS);
  }

  function emergencyContinue() {
    const response = chapter.choices[0];
    setSelected(response);
    setMemories(current => [...current.slice(0, chapterIndex), response]);
    goTo('outcome');
  }

  return <div className={`storybook phase-${phase}`}>
    <header className="site-header">
      <button className="wordmark" onClick={() => inStory ? setRestartPrompt(true) : reset()} aria-label="The Next 8 Minutes, return to cover">
        <span className="brand-icon"><BookOpen size={23} strokeWidth={1.5} /><span>✦</span></span>
        <span>THE NEXT <b>8</b> MINUTES<small>A LITTLE COURAGE GOES A LONG WAY</small></span>
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
          <p className="cover-description">Help Bob find his way home. When pressure gets in the way, trace something that helps him take the next safe step.</p>
          <div className="mode-picker" role="group" aria-label="Choose your play mode">
            <button className={!relaxed ? 'active' : ''} onClick={() => setRelaxed(false)} aria-pressed={!relaxed}><Clock3 size={15} /> 8-second challenge</button>
            <button className={relaxed ? 'active' : ''} onClick={() => setRelaxed(true)} aria-pressed={relaxed}><Leaf size={15} /> Untimed</button>
          </div>
          <p className="mode-explanation">{relaxed ? 'Your own pace. Trace, or use the keyboard-friendly action button.' : 'Read at your own pace. Then choose and trace in eight seconds.'}</p>
          <button className="button button-primary cover-cta" onClick={() => goTo('reading')}>Open the storybook <ArrowRight size={19} /></button>
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
        <section className={`play-layout ${phase === 'drawing' ? 'is-drawing' : ''}`}>
          <div className="scene-column">
            <div className="scene-art"><World chapter={chapterIndex} phase={phase} object={selected?.object} />
              <div className="scene-location"><span className="location-dot" />{chapter.location}</div>
              <div className="scene-folio">{String(chapterIndex + 1).padStart(2, '0')}<span>/ 05</span></div>
            </div>
            <div className="scene-caption"><span className="tiny-star">✦</span><p>{phase === 'outcome' ? 'Something you drew became a way forward.' : phase === 'detour' ? 'There is still a way forward. Turn the page gently.' : 'A little courage. A little ink. One step closer to home.'}</p></div>
          </div>

          <section className="story-panel" ref={panelRef} aria-label={`Chapter ${chapterIndex + 1}`}>
            <div className="panel-topline"><span className="section-tag">CHAPTER {String(chapterIndex + 1).padStart(2, '0')}</span><span className="page-mode">{relaxed ? <><Leaf size={13} /> Untimed</> : <><Clock3 size={13} /> 8-second challenge</>}</span></div>
            {phase === 'reading' && <div className="page-enter">
              <h1 ref={headingRef} tabIndex={-1}>{chapter.title}<span className="title-dot">.</span></h1>
              <p className="narration">{chapter.narration}</p>
              <blockquote className="character-dialogue"><span>{chapter.dialogue.speaker}</span><p>“{chapter.dialogue.text}”</p></blockquote>
              {chapter.emergency && <div className="emergency-note"><ShieldCheck size={18} /><p>Real emergency? Call <b>995</b> in Singapore. Stay with the person and follow the operator. Don’t wait for a game.</p></div>}
              <div className="prepare-note"><Pencil size={17} /><p>{chapter.instruction}</p></div>
              <div className="preview-objects" aria-label="Objects you can choose">{chapter.choices.map(choice => <div key={choice.id}><ObjectGlyph shape={choice.object} size={33} /><span>{choice.label}</span></div>)}</div>
              <button className="button button-primary full-width" onClick={() => beginAttempt()}>{relaxed ? 'Open your sketchbook' : 'I’m ready — start 8 seconds'} <ArrowRight size={17} /></button>
              <button className="text-button mode-link" onClick={() => setRelaxed(current => !current)}>{relaxed ? 'Switch to the 8-second challenge' : 'Prefer no timer? Play untimed'}</button>
            </div>}

            {phase === 'drawing' && <div className="drawing-page">
              <div className="drawing-title"><h1 ref={headingRef} tabIndex={-1}>Draw a way<br /><em>forward.</em></h1>
                {relaxed ? <div className="relaxed-emblem"><Leaf size={26} /><span>YOUR PACE</span></div> : <div className={`countdown ${remaining <= 3000 ? 'countdown-urgent' : ''}`} role="timer" aria-label={`${Math.ceil(remaining / 1000)} seconds remaining`}>
                  <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="35" /><circle cx="40" cy="40" r="35" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - remaining / WINDOW_MS * 100} /></svg><strong>{Math.ceil(remaining / 1000)}</strong><span>SECONDS</span>
                </div>}
              </div>
              <p className="draw-instruction">{selected ? 'Hold and follow the dotted line. Start anywhere.' : 'Pick your action. Then trace it into the story.'}</p>
              <div className="object-choices" role="group" aria-label="Choose an object to trace">{chapter.choices.map(choice => <button key={choice.id} aria-pressed={selected?.id === choice.id} onClick={() => setSelected(choice)} disabled={blocked} className={selected?.id === choice.id ? 'selected' : ''} title={choice.description}>
                <ObjectGlyph shape={choice.object} size={37} /><span>{choice.label}</span>{selected?.id === choice.id && <Check className="choice-check" size={12} />}
              </button>)}</div>
              {selected ? <TraceCanvas key={`${attempt}-${selected.id}`} shape={selected.object} enabled={!blocked} relaxed={relaxed} onComplete={finishDrawing} /> : <div className="empty-sketchbook"><span className="empty-star">✧</span><Pencil size={39} strokeWidth={1} /><p>Your next step starts<br />with a little line.</p><span>CHOOSE AN OBJECT ABOVE</span></div>}
              <button className="text-button drawing-pause" onClick={() => setPaused(true)}><Pause size={13} /> Take a breath · Pause</button>
            </div>}

            {phase === 'outcome' && selected && <div className="page-enter outcome-page">
              <div className="outcome-seal"><ObjectGlyph shape={selected.object} size={57} /><span>✦</span></div>
              <span className="small-label">YOUR DRAWING CAME TO LIFE</span>
              <h1 ref={headingRef} tabIndex={-1}>{selected.outcomeTitle}<span className="title-dot">.</span></h1>
              <p className="narration">{selected.outcome}</p>
              <div className="takeaway-note"><Leaf size={19} /><div><span>A LITTLE THING TO REMEMBER</span><p>{selected.takeaway}</p></div></div>
              <button className="button button-primary full-width" onClick={continueStory}>{chapterIndex === 4 ? 'Bring Bob home' : 'Turn the page'} <ArrowRight size={17} /></button>
              <p className="saved-note"><Check size={12} /> A new memory in your sketchbook</p>
            </div>}

            {phase === 'detour' && <div className="page-enter detour-page">
              <div className="detour-symbol"><Leaf size={33} strokeWidth={1} /></div>
              <span className="small-label">A PAUSE, NOT THE END</span>
              <h1 ref={headingRef} tabIndex={-1}>{chapter.detour.title}<span className="title-dot">.</span></h1>
              <p className="narration">{chapter.detour.body}</p>
              {chapter.emergency ? <button className="button button-primary full-width" onClick={emergencyContinue}>Continue: Bob gets emergency help <ArrowRight size={17} /></button> : <button className="button button-primary full-width" onClick={() => beginAttempt()}><RotateCcw size={16} /> Try these eight seconds again</button>}
              <button className="button button-secondary full-width" onClick={() => beginAttempt(true)}><Leaf size={16} /> Continue without a timer</button>
              <p className="saved-note">Earlier pages are safe in your sketchbook.</p>
            </div>}
          </section>
        </section>
      </>}

      {phase === 'intro' && <section className="how-it-works" aria-label="How the story works"><div className="how-heading"><span className="section-tag">A LITTLE MAGIC.<br />A REAL-LIFE LESSON.</span><span className="handdrawn-arrow">⤳</span></div>
        <div className="how-step"><span className="how-icon"><BookOpen size={21} strokeWidth={1.3} /></span><div><h2>Read the moment</h2><p>Meet Bob. See what’s in his way.</p></div></div>
        <div className="how-step"><span className="how-icon"><Pencil size={21} strokeWidth={1.3} /></span><div><h2>Draw a response</h2><p>Choose an object. Follow its outline.</p></div></div>
        <div className="how-step"><span className="how-icon"><Sparkles size={21} strokeWidth={1.3} /></span><div><h2>Change the story</h2><p>Watch your little drawing help.</p></div></div>
      </section>}
    </main>

    <footer className="site-footer"><span>MADE OF LITTLE CHOICES & A LITTLE COURAGE</span><button onClick={() => setHelp(true)}>About this story <ChevronRight size={12} /></button><span className="footer-edition">THE NEXT 8 MINUTES · VOL. 01</span></footer>

    {help && <Modal title="A little guide to your journey." onClose={() => setHelp(false)}>
      <p>Read each page at your own pace. When you’re ready, choose an object and trace its dotted outline within eight seconds. Your drawing becomes Bob’s next action.</p>
      <div className="dialog-callout"><Leaf size={20} /><p><b>There’s no perfect way to draw.</b> If you need more time, choose Untimed. You can trace or use the keyboard-friendly “Bring drawing to life” button. Your story has the same possibilities.</p></div>
      <p>Missing the timer means another chance, not failure. Open this guide or pause to stop the clock. Switching tabs pauses the story too.</p>
      <h3>Support beyond the story</h3><p>This fictional story practises refusal and seeking help. It does not diagnose drug use or replace professional advice. In a real emergency in Singapore, call <b>995</b>, stay with the person, and follow the operator.</p>
      <div className="resource-links">{resources.map(resource => <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer">{resource.label}<ArrowRight size={16} /></a>)}</div>
      <small>Playable prototype · Authored story and local tracing, with no live AI responses. Educational wording should be reviewed with a hackathon facilitator before submission.</small>
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
