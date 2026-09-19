import { Chapter } from '../types';

export const STORY_CHAPTERS: Chapter[] = [
  {
    id: 1,
    kicker: 'Chapter 1 · The Invitation',
    title: 'The Porch Outside',
    sceneTheme: 'alley',
    situation:
      'Bob is heading home after an evening out. A gathering on the porch calls him over. Someone holds out an unfamiliar vape and urges him to join in.',
    dialogueSpeaker: 'An acquaintance',
    dialogueQuote: '"Come on, Bob! Everyone here has already tried it. One puff won\'t hurt, don\'t be lame."',
    prompt: 'Choose what to sketch into Bob’s magical notebook before the social pressure builds:',
    options: [
      {
        id: 'doorway',
        name: 'Open Doorway',
        subtitle: 'Create a clear exit route',
        actionText: 'Step away toward the well-lit road',
        icon: 'DoorOpen',
        // Simple arched doorway outline in 100x100 viewBox
        viewBox: '0 0 100 100',
        outlinePath: 'M 25,90 L 25,45 A 25,25 0 0,1 75,45 L 75,90 Z M 35,90 L 35,48 A 15,15 0 0,1 65,48 L 65,90 Z',
        outcomeTitle: 'You sketched an exit. Bob walked away.',
        outcomeNarrative:
          'Bob gives a polite but firm wave: "No thanks, I have to be home." He steps onto the brightly lit sidewalk before the pressure can continue.',
        takeaway:
          'You don’t have to win an argument or explain yourself. Having an exit strategy makes saying no natural and safe.',
        sketchbookCaption: 'You drew a doorway. Bob learned he could walk away safely.',
      },
      {
        id: 'phone-ally',
        name: 'Pocket Phone',
        subtitle: 'Call a trusted ally',
        actionText: 'Reach someone who can back him up',
        icon: 'PhoneCall',
        viewBox: '0 0 100 100',
        outlinePath: 'M 32,15 C 32,10 68,10 68,15 L 68,85 C 68,90 32,90 32,85 Z M 46,20 L 54,20 M 47,80 A 3,3 0 1,1 53,80 A 3,3 0 1,1 47,80',
        outcomeTitle: 'You sketched a phone. Bob called his brother.',
        outcomeNarrative:
          'Bob taps his phone screen: "Hey, can you pick me up at the corner?" Having someone on the other end gave Bob instant social backup.',
        takeaway:
          'A quick call or text to a friend or sibling can provide a seamless excuse to leave any awkward spot.',
        sketchbookCaption: 'You drew a phone. Bob learned an ally can back you up anytime.',
      },
      {
        id: 'speech-bubble',
        name: 'Clear Words',
        subtitle: 'Speak a direct boundary',
        actionText: 'Say no clearly without wavering',
        icon: 'MessageSquare',
        viewBox: '0 0 100 100',
        outlinePath: 'M 18,22 C 18,16 82,16 82,22 L 82,62 C 82,68 55,68 55,68 L 35,84 L 38,68 L 18,68 Z',
        outcomeTitle: 'You sketched clear words. Bob spoke with confidence.',
        outcomeNarrative:
          'Bob looks them in the eye: "I don\'t touch that stuff, but you guys have a good night." He doesn\'t hesitate or look back.',
        takeaway:
          'Direct, calm communication removes ambiguity. True friends respect boundaries without persistent badgering.',
        sketchbookCaption: 'You drew clear words. Bob learned to speak his boundary proudly.',
      },
    ],
  },
  {
    id: 2,
    kicker: 'Chapter 2 · The Reassuring Claim',
    title: 'The Street Corner',
    sceneTheme: 'corner',
    situation:
      'Near the crossroads, an older acquaintance intercepts Bob. They flash a tiny foil packet, swearing it is "all-natural herbal relaxer" tested by everyone.',
    dialogueSpeaker: 'Older teen',
    dialogueQuote: '"Bro, trust me! It’s 100% safe, completely legal herbs. It just clears your head after a rough week."',
    prompt: 'Sketch a tool to help Bob critically evaluate the claim before curiosity takes over:',
    options: [
      {
        id: 'stop-sign',
        name: 'Stop Sign',
        subtitle: 'Raise an immediate shield',
        actionText: 'Decline unknown substances on the spot',
        icon: 'Octagon',
        viewBox: '0 0 100 100',
        outlinePath: 'M 32,15 L 68,15 L 85,32 L 85,68 L 68,85 L 32,85 L 15,68 L 15,32 Z',
        outcomeTitle: 'You sketched a stop sign. Bob held his ground.',
        outcomeNarrative:
          'Bob steps back two paces with his palms up: "I don\'t take things when I don\'t know exactly what\'s inside." He turns down the cross-street toward safety.',
        takeaway:
          'Claims of "all-natural" or "harmless" are commonly used to mask unregulated synthetic drugs and dangerous adulterants.',
        sketchbookCaption: 'You drew a stop sign. Bob learned that unknown claims require strict caution.',
      },
      {
        id: 'verify-phone',
        name: 'Fact Checker',
        subtitle: 'Verify with a reliable source',
        actionText: 'Pause to look up real medical facts',
        icon: 'Search',
        viewBox: '0 0 100 100',
        outlinePath: 'M 40,20 A 22,22 0 1,1 25,58 L 12,78 L 22,88 L 42,75 A 22,22 0 0,1 40,20 Z',
        outcomeTitle: 'You sketched a magnifying lens. Bob examined the risk.',
        outcomeNarrative:
          'Bob asks: "What exact chemical is in it?" When the other person gets evasive, Bob confirms his instincts and walks off without touching it.',
        takeaway:
          'Confidence and charm do not equal safety. If someone cannot verify contents or guarantees safety casually, step away.',
        sketchbookCaption: 'You drew a lens of truth. Bob learned to question risky claims.',
      },
    ],
  },
  {
    id: 3,
    kicker: 'Chapter 3 · The Difficult Moment',
    title: 'The Park Bench',
    sceneTheme: 'bench',
    situation:
      'Alone on a quiet park bench, Bob sits down, feeling drained, isolated, and anxious. A passing crowd laughs, and Bob’s chest tightens with loneliness.',
    dialogueSpeaker: 'Inner doubt',
    dialogueQuote: '"Nobody cares anyway. Why not just take something to turn off your brain for a few hours?"',
    prompt: 'Sketch something into the sketchbook to help Bob comfort his distress safely:',
    options: [
      {
        id: 'headphones',
        name: 'Headphones',
        subtitle: 'Grounding mindfulness pause',
        actionText: 'Breathe, listen to music, and reset',
        icon: 'Headphones',
        viewBox: '0 0 100 100',
        outlinePath: 'M 20,55 A 30,30 0 0,1 80,55 L 80,75 C 80,82 72,85 68,80 L 68,60 C 68,55 72,55 80,55 M 20,55 L 20,75 C 20,82 28,85 32,80 L 32,60 C 32,55 28,55 20,55',
        outcomeTitle: 'You sketched headphones. Bob took a calming pause.',
        outcomeNarrative:
          'Bob slips on his headphones. The soothing melody and gentle evening breeze ground him. His heart rate slows, and the urge to escape dissolves.',
        takeaway:
          'Strong emotions are temporary waves. Healthy sensory pauses—music, rhythmic breathing, a walk—give your brain room to recover.',
        sketchbookCaption: 'You drew headphones. Bob learned to soothe distress through calming pauses.',
      },
      {
        id: 'support-chat',
        name: 'Support Line',
        subtitle: 'Reach out to a warm listener',
        actionText: 'Message a supportive family member or helpline',
        icon: 'HeartHandshake',
        viewBox: '0 0 100 100',
        outlinePath: 'M 50,85 C 25,65 15,48 15,35 A 18,18 0 0,1 50,22 A 18,18 0 0,1 85,35 C 85,48 75,65 50,85 Z',
        outcomeTitle: 'You sketched an open heart. Bob reached out for care.',
        outcomeNarrative:
          'Bob texts his aunt: "Had a pretty rough evening, can I talk?" Her immediate reply—"Of course, I’m putting the kettle on"—warms his chest.',
        takeaway:
          'Vulnerability is courage. Sharing your heavy feelings with someone who cares dissolves the isolation that often fuels risky choices.',
        sketchbookCaption: 'You drew a caring heart. Bob learned that asking for support brings real relief.',
      },
    ],
  },
  {
    id: 4,
    kicker: 'Chapter 4 · A Friend Needs Help',
    title: 'The Shadowed Alleyway',
    sceneTheme: 'street',
    situation:
      'Turning past the market stalls, Bob discovers Leo slumped against a brick pillar. Leo is breathing shallowly, slurring words, and cannot stay upright.',
    dialogueSpeaker: 'Leo (unwell)',
    dialogueQuote: '"Bob… everything is spinning… my chest hurts… please don’t tell anyone…"',
    prompt: 'This is a medical emergency. Sketch the rapid response Bob must take:',
    options: [
      {
        id: 'emergency-call',
        name: 'Emergency 995',
        subtitle: 'Call medical services immediately',
        actionText: 'Dial 995 and stay with Leo',
        icon: 'ShieldAlert',
        viewBox: '0 0 100 100',
        outlinePath: 'M 20,20 L 80,20 L 80,80 L 20,80 Z M 50,30 L 50,70 M 30,50 L 70,50',
        outcomeTitle: 'You sketched the Emergency Cross (995). Help is on the way.',
        outcomeNarrative:
          'Bob calls 995 immediately. He gives their exact location, rolls Leo onto his side in the recovery position, and stays on the line until paramedics arrive.',
        takeaway:
          'When someone is unresponsive or confused after taking something, never let them "sleep it off". Dial emergency services (995 in SG) without delay.',
        sketchbookCaption: 'You drew 995 Emergency Help. Bob learned never to leave an unwell friend.',
      },
      {
        id: 'lantern-signal',
        name: 'Lantern Beacon',
        subtitle: 'Alert nearby security or adults',
        actionText: 'Summon immediate adult help to assist',
        icon: 'Flame',
        viewBox: '0 0 100 100',
        outlinePath: 'M 50,15 L 65,30 L 60,75 L 40,75 L 35,30 Z M 30,80 L 70,80 L 70,88 L 30,88 Z M 48,15 C 48,8 52,8 52,15',
        outcomeTitle: 'You sketched a glowing beacon. An adult stepped in.',
        outcomeNarrative:
          'Bob signals the station security officer nearby: "My friend collapsed, we need an ambulance right now!" The officer sprints over with first aid and calls 995.',
        takeaway:
          'In a crisis, involving responsible adults and first responders saves lives. You will never get in trouble for seeking medical help for a friend.',
        sketchbookCaption: 'You drew a beacon of light. Bob learned that urgent help saves lives.',
      },
    ],
  },
  {
    id: 5,
    kicker: 'Chapter 5 · The Last Stretch',
    title: 'The Home Threshold',
    sceneTheme: 'doorstep',
    situation:
      'Bob stands on the garden path in front of his apartment block. The porch light is warm, but fear of being scolded or misunderstood makes his legs feel like lead.',
    dialogueSpeaker: 'Bob’s thoughts',
    dialogueQuote: '"What if Mom is disappointed in where I was? Maybe I should just pretend tonight never happened…"',
    prompt: 'Sketch the final magical object to help Bob open up to his family:',
    options: [
      {
        id: 'golden-key',
        name: 'Golden Key',
        subtitle: 'Open the door to honesty',
        actionText: 'Unlock the door and speak truth',
        icon: 'Key',
        viewBox: '0 0 100 100',
        outlinePath: 'M 35,30 A 18,18 0 1,1 35,66 A 18,18 0 1,1 35,30 M 53,48 L 88,48 L 88,62 M 76,48 L 76,58',
        outcomeTitle: 'You sketched the Golden Key. Bob unlocked the door.',
        outcomeNarrative:
          'Bob turns the key. Sitting at the dining table with hot tea, he tells his mother about the party, the pressure, and Leo. She hugs him tightly: "I’m so proud of you for choosing your way home."',
        takeaway:
          'Honest conversations with family or trusted mentors turn difficult nights into deep resilience. You never have to carry fears alone.',
        sketchbookCaption: 'You drew the golden key. Bob found safety, openness, and peace at home.',
      },
      {
        id: 'bridge-trust',
        name: 'Living Bridge',
        subtitle: 'Connect across the worry',
        actionText: 'Bridge the emotional gap',
        icon: 'Sparkles',
        viewBox: '0 0 100 100',
        outlinePath: 'M 15,65 Q 50,30 85,65 L 85,78 Q 50,45 15,78 Z M 25,60 L 25,85 M 50,42 L 50,85 M 75,60 L 75,85',
        outcomeTitle: 'You sketched a bridge of trust. Bob took the leap.',
        outcomeNarrative:
          'Bob walks inside and opens his sketchbook. He shares the events with his parents honestly. They listen with love and discuss how to keep each other safe.',
        takeaway:
          'Trust is built one honest conversation at a time. Seeking guidance from loved ones shields you from future crises.',
        sketchbookCaption: 'You drew a bridge of trust. Bob learned courage is choosing connection.',
      },
    ],
  },
];
