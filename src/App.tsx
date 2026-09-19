
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Headphones,
  HeartHandshake,
  MessageCircleMore,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type Intent = 'exit' | 'direct' | 'question' | 'support' | 'emergency' | 'trusted' | 'stay' | 'dismiss' | 'listen' | 'connect' | 'secret' | 'lecture';

type Choice = { label: string; message: string; intent: Intent };
type Outcome = { title: string; body: string; takeaway: string; delta: number; tone: 'strong' | 'steady' | 'weak' };
type Scene = {
  kicker: string;
  time: string;
  messages: string[];
  prompt: string;
  placeholder: string;
  choices: Choice[];
  outcomes: Partial<Record<Intent, Outcome>>;
};

const scenes: Scene[] = [
  {
    kicker: 'A way out',
    time: 'SAT · 10:48 PM',
    messages: [
      "i'm at maya's place",
      "someone brought a vape. they said it's not the usual kind",
      "everyone's saying one puff. i don't want to look lame",
    ],
    prompt: 'What do you send Kai?',
    placeholder: 'Type what you would actually say…',
    choices: [
      { label: 'Create an exit', message: 'Call me now. I need you—use me as your excuse to leave.', intent: 'exit' },
      { label: 'Back them up', message: "You don't owe anyone a yes. I'm with you—step outside and call me.", intent: 'support' },
      { label: 'Be direct', message: 'Just say no and leave.', intent: 'direct' },
    ],
    outcomes: {
      exit: { title: 'You gave Kai an exit.', body: 'Your phone rings. Kai answers, walks outside, and does not have to win an argument before leaving.', takeaway: 'A believable exit can make refusing feel socially safer.', delta: 28, tone: 'strong' },
      support: { title: 'Kai knows they are not alone.', body: 'Your message shifts the pressure. Kai steps outside to call you instead of staying silent in the room.', takeaway: 'Specific support works better than “be careful”.', delta: 24, tone: 'strong' },
      direct: { title: 'Clear, but hard to carry alone.', body: 'Kai agrees, but the social pressure is still right in front of them. A concrete next step would make the refusal easier.', takeaway: 'Pair “no” with an exit, ally, or alternative.', delta: 12, tone: 'steady' },
      question: { title: 'The uncertainty becomes visible.', body: 'Kai starts questioning what is being offered. That creates a pause—but they still need a safe way to leave.', takeaway: 'Questions can interrupt pressure; practical support completes the move.', delta: 14, tone: 'steady' },
    },
  },
  {
    kicker: 'Stay with the person',
    time: 'SAT · 10:56 PM',
    messages: [
      "i'm outside now",
      "but jay stayed. he's dizzy and not making sense",
      'he keeps saying he is fine. what do i do?',
    ],
    prompt: 'What should Kai do next?',
    placeholder: 'Give Kai one clear next step…',
    choices: [
      { label: 'Get urgent help', message: "Don't leave Jay alone. Get an adult and emergency help now.", intent: 'emergency' },
      { label: 'Find a trusted adult', message: 'Get Maya’s parent or another trusted adult right now. Stay with Jay.', intent: 'trusted' },
      { label: 'Wait and watch', message: 'Give him some water and see if he feels better.', intent: 'stay' },
    ],
    outcomes: {
      emergency: { title: 'You treated the signs seriously.', body: 'Kai gets an adult and emergency help. Jay is not left alone, and the adults can explain what they know.', takeaway: 'If someone is seriously unwell or in immediate danger, get emergency help.', delta: 34, tone: 'strong' },
      trusted: { title: 'You brought in someone who can act.', body: 'Kai finds an adult and stays nearby. The situation is no longer resting on one frightened friend.', takeaway: 'Seeking trusted help is protection—not betrayal.', delta: 28, tone: 'strong' },
      stay: { title: 'Staying helps, but waiting can cost time.', body: 'Kai remains with Jay, which is better than leaving. But unusual behaviour needs adult or emergency help, not guesswork.', takeaway: 'Stay with them and escalate; do not try to manage a serious situation alone.', delta: 10, tone: 'steady' },
      dismiss: { title: 'The risk stays hidden.', body: 'Kai leaves because Jay insists he is fine. No one else knows that something may be wrong.', takeaway: 'Take concerning changes in behaviour seriously.', delta: 0, tone: 'weak' },
    },
  },
  {
    kicker: 'The morning after',
    time: 'SUN · 11:12 AM',
    messages: [
      'jay texted me. he feels ashamed',
      'he says please do not tell anyone',
      "i don't want him to shut me out",
    ],
    prompt: 'How do you help without judging?',
    placeholder: 'Write the first message you would send…',
    choices: [
      { label: 'Listen first', message: "I'm glad you told me. I'm here to listen, and we can work out the next step together.", intent: 'listen' },
      { label: 'Connect to support', message: "You don't have to handle this alone. I'll go with you to someone we trust.", intent: 'connect' },
      { label: 'Promise secrecy', message: "I promise I won't tell anyone, whatever happens.", intent: 'secret' },
    ],
    outcomes: {
      listen: { title: 'You kept the conversation open.', body: 'Jay replies. Shame loses some of its grip because your first response is care—not a lecture.', takeaway: 'Listen calmly, then help the person connect with appropriate support.', delta: 26, tone: 'strong' },
      connect: { title: 'You made help feel less frightening.', body: 'Jay agrees to speak with someone because you offered to go with him instead of simply telling him what to do.', takeaway: 'Offering to accompany someone turns advice into support.', delta: 32, tone: 'strong' },
      secret: { title: 'Trust matters—but safety needs room.', body: 'Jay keeps talking, but an absolute promise could stop you from getting help if someone is in danger.', takeaway: 'Respect privacy, but do not promise secrecy when safety is at risk.', delta: 10, tone: 'steady' },
      lecture: { title: 'The conversation closes.', body: 'Jay stops replying. The facts may matter later, but shame makes it difficult to hear them now.', takeaway: 'Connection first. Advice works better after the person feels heard.', delta: 2, tone: 'weak' },
    },
  },
];

const intentLabels: Record<Intent, string> = {
  exit: 'create an exit', direct: 'set a clear boundary', question: 'slow the pressure down', support: 'stand beside them',
  emergency: 'get urgent help', trusted: 'bring in a trusted adult', stay: 'stay and monitor', dismiss: 'wait and hope',
  listen: 'listen without judgement', connect: 'connect them to support', secret: 'promise secrecy', lecture: 'lead with a lecture',
};

function classifyResponse(sceneIndex: number, value: string): Intent {
  const text = value.toLowerCase();
  if (sceneIndex === 0) {
    if (/call|pick.*up|come get|leave|outside|exit|excuse|home/.test(text)) return 'exit';
    if (/with you|not alone|got you|here for|back you/.test(text)) return 'support';
    if (/what|ask|know what|inside|sure/.test(text)) return 'question';
    return 'direct';
  }
  if (sceneIndex === 1) {
    if (/emergency|ambulance|995|urgent|medical|call.*help/.test(text)) return 'emergency';
    if (/adult|parent|teacher|security|trusted|staff/.test(text)) return 'trusted';
    if (/leave|fine|sleep|ignore|later/.test(text)) return 'dismiss';
    return 'stay';
  }
  if (/counsell|adult|support|help|together|with you|go with/.test(text)) return 'connect';
  if (/promise|secret|won't tell|will not tell/.test(text)) return 'secret';
  if (/stupid|wrong|shouldn't|should not|told you|lecture/.test(text)) return 'lecture';
  return 'listen';
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [connection, setConnection] = useState(18);
  const [complete, setComplete] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const scene = scenes[sceneIndex];
  const outcome = selectedIntent ? scene.outcomes[selectedIntent] : null;
  const progress = complete ? 100 : ((sceneIndex + (outcome ? 1 : 0)) / scenes.length) * 100;
  const supportStyle = useMemo(() => {
    if (connection >= 88) return { name: 'THE ANCHOR', icon: HeartHandshake, copy: 'You create calm, practical ways for people to move toward safety.' };
    if (connection >= 68) return { name: 'THE ALLY', icon: ShieldCheck, copy: 'You stay beside people and help them take the next useful step.' };
    return { name: 'THE SIGNAL', icon: MessageCircleMore, copy: 'You notice when something is wrong. The next level is making your support more specific.' };
  }, [connection]);

  const resolve = (intent: Intent) => {
    const resolved = scene.outcomes[intent] ? intent : Object.keys(scene.outcomes)[0] as Intent;
    setSelectedIntent(resolved);
    setConnection((current) => Math.min(100, current + (scene.outcomes[resolved]?.delta ?? 0)));
  };
  const choose = (choice: Choice) => { if (!selectedIntent) { setDraft(choice.message); resolve(choice.intent); } };
  const submitDraft = () => { if (draft.trim() && !selectedIntent) resolve(classifyResponse(sceneIndex, draft)); };
  const next = () => {
    if (sceneIndex === scenes.length - 1) return setComplete(true);
    setSceneIndex((current) => current + 1); setDraft(''); setSelectedIntent(null);
  };
  const reset = () => {
    setStarted(false); setSceneIndex(0); setDraft(''); setSelectedIntent(null); setConnection(18); setComplete(false); setShowSources(false);
  };

  return (
    <main className="app-shell" data-build-source="github-sync">
      <header className="topbar">
        <button className="brand" onClick={reset} aria-label="Restart The Next 8 Minutes"><span className="brand-mark">8</span><span>THE NEXT <b>8</b> MINUTES</span></button>
        <div className="topbar-actions">
          {started && !complete && <span className="chapter-label">CHAPTER {sceneIndex + 1} / {scenes.length}</span>}
          <button className="icon-button" onClick={() => setShowSources(true)} aria-label="About this experience"><CircleHelp size={20} /></button>
        </div>
      </header>
      <div className="progress-track" aria-hidden="true"><motion.div animate={{ width: `${progress}%` }} /></div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.section className="intro-screen" key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            <div className="intro-copy">
              <p className="eyebrow"><span /> AN INTERACTIVE STORY ABOUT SHOWING UP</p>
              <h1>You have eight seconds.<br /><em>What happens next?</em></h1>
              <p className="intro-lead">A friend is one message away from a different night. Your words shape what they do next.</p>
              <button className="primary-button" onClick={() => setStarted(true)}>Enter the story <ArrowRight size={19} /></button>
              <p className="duration"><Clock3 size={15} /> About 4 minutes · Headphones optional</p>
            </div>
            <div className="intro-visual" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="eight-glyph">8</div>
              <div className="message-ping ping-one">you there?</div><div className="message-ping ping-two">what do i do?</div>
            </div>
          </motion.section>
        ) : complete ? (
          <motion.section className="complete-screen" key="complete" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="completion-halo" /><p className="eyebrow centered"><span /> STORY COMPLETE <span /></p>
            <h1>You changed<br />the next <em>8 minutes.</em></h1>
            <div className="style-card"><supportStyle.icon size={32} /><div><span>YOUR SUPPORT STYLE</span><h2>{supportStyle.name}</h2><p>{supportStyle.copy}</p></div></div>
            <blockquote>“You don’t need perfect words. A specific next step can make someone feel less alone.”</blockquote>
            <div className="complete-actions"><button className="primary-button" onClick={reset}><RotateCcw size={18} /> Play again</button><button className="secondary-button" onClick={() => setShowSources(true)}>Help & sources</button></div>
          </motion.section>
        ) : (
          <motion.section className="story-layout" key={sceneIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <aside className="story-context">
              <button className="back-button" onClick={reset}><ChevronLeft size={17} /> Exit story</button>
              <div className="chapter-number">0{sceneIndex + 1}</div><p className="eyebrow"><span /> {scene.kicker}</p>
              <h2>{sceneIndex === 0 ? 'Pressure loves silence.' : sceneIndex === 1 ? 'Take the signs seriously.' : 'Connection before correction.'}</h2>
              <p>{sceneIndex === 0 ? 'Give your friend something practical to do—not another argument to win.' : sceneIndex === 1 ? 'You do not need to diagnose the situation. You need to bring in help.' : 'The first reply can decide whether someone keeps talking or disappears.'}</p>
              <div className="connection-meter"><div className="meter-label"><span>CONNECTION</span><b>{connection}%</b></div><div className="meter-track"><motion.div animate={{ width: `${connection}%` }} /></div><small>Built through specific, non-judgemental support.</small></div>
            </aside>

            <section className="phone-card" aria-label="Conversation with Kai">
              <div className="phone-header"><div className="avatar">K</div><div><b>KAI</b><span>online</span></div><span className="scene-time">{scene.time}</span></div>
              <div className="message-thread">
                {scene.messages.map((message, index) => <motion.div className="bubble incoming" key={message} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .15 }}>{message}</motion.div>)}
                {draft && selectedIntent && <motion.div className="bubble outgoing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{draft}</motion.div>}
              </div>
              <div className="response-panel">
                <AnimatePresence mode="wait">
                  {!outcome ? (
                    <motion.div key="respond" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="prompt-row"><Sparkles size={17} /><b>{scene.prompt}</b></div>
                      <div className="choice-grid">{scene.choices.map((choice) => <button key={choice.intent} onClick={() => choose(choice)}><span>{choice.label}</span><ArrowRight size={16} /></button>)}</div>
                      <div className="divider"><span>OR WRITE YOUR OWN</span></div>
                      <div className="composer"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={scene.placeholder} maxLength={180} /><button onClick={submitDraft} disabled={!draft.trim()} aria-label="Send response"><Send size={18} /></button></div>
                    </motion.div>
                  ) : (
                    <motion.div className={`outcome-card ${outcome.tone}`} key="outcome" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="intent-chip"><Check size={14} /> INTERPRETED AS: {intentLabels[selectedIntent!]}</div><h3>{outcome.title}</h3><p>{outcome.body}</p>
                      <div className="takeaway"><ShieldCheck size={18} /><span><b>KEEP THIS:</b> {outcome.takeaway}</span></div>
                      <button className="primary-button compact" onClick={next}>{sceneIndex === scenes.length - 1 ? 'See your impact' : 'Continue'} <ArrowRight size={18} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSources && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSources(false)}>
            <motion.section className="info-modal" role="dialog" aria-modal="true" aria-label="Help and sources" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowSources(false)}>Close</button><Headphones size={28} /><h2>This is rehearsal, not a test.</h2>
              <p>The story helps you practise concrete ways to support a friend. It does not diagnose drug use or replace professional help.</p>
              <div className="source-block"><b>If someone is in immediate danger</b><p>Get emergency help and a trusted adult. Do not leave the person alone.</p></div>
              <div className="source-block"><b>Need support in Singapore?</b><p>NCADA maintains current youth, family, counselling and recovery support options.</p><a href="https://www.ncada.org.sg/seeking-help/" target="_blank" rel="noreferrer">Open NCADA support resources <ArrowRight size={15} /></a></div>
              <small>Prototype content should be reviewed with an NCADA facilitator before submission.</small>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
