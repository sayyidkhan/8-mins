export type ObjectKind = 'door' | 'phone' | 'speech' | 'stop' | 'headphones' | 'signal' | 'bridge';

export type StoryChoice = {
  id: string;
  object: ObjectKind;
  label: string;
  description: string;
  outcomeTitle: string;
  outcome: string;
  takeaway: string;
  memory: string;
};

export type StoryChapter = {
  id: string;
  title: string;
  location: string;
  eyebrow: string;
  narration: string;
  dialogue: { speaker: string; text: string };
  instruction: string;
  choices: StoryChoice[];
  detour: { title: string; body: string };
  emergency?: boolean;
};

export const chapters: StoryChapter[] = [
  {
    id: 'the-invitation',
    title: 'The invitation',
    location: 'Outside the neighbourhood court',
    eyebrow: '01 / A way out',
    narration:
      'The court lights flicker on. Bob tucks his sketchbook under his arm, ready for home. A group calls him back and offers him a substance. He wants to leave, but being the first to say no feels difficult.',
    dialogue: {
      speaker: 'Someone in the group',
      text: 'Stay a bit. Everyone else has tried it. Want some?',
    },
    instruction: 'Choose an exit, an ally, or a clear no. Trace the object to help Bob act.',
    choices: [
      {
        id: 'invitation-leave',
        object: 'door',
        label: 'Leave the situation',
        description: 'Give a short refusal and take the well-lit route home.',
        outcomeTitle: 'A doorway opens',
        outcome:
          'The drawn doorway opens towards the lit path. “No thanks, I’m heading home,” Bob says. Someone calls after him. He keeps walking towards other people, ready to seek help if the pressure follows.',
        takeaway: 'You do not need to win an argument to leave. Move towards support if pressure continues.',
        memory: 'You drew a doorway. Bob declined and walked towards the well-lit route home.',
      },
      {
        id: 'invitation-call',
        object: 'phone',
        label: 'Call an ally',
        description: 'Ask someone trusted to help you leave.',
        outcomeTitle: 'A familiar voice',
        outcome:
          'The phone takes shape. Bob calls his cousin: “I want to leave. Can you meet me?” They agree on a nearby staffed shop. His cousin stays on the line as Bob walks there.',
        takeaway: 'An ally can help you plan an exit. Say where you are and what support you need.',
        memory: 'You drew a phone. Bob called his cousin and arranged a meeting point to leave.',
      },
      {
        id: 'invitation-refuse',
        object: 'speech',
        label: 'Say no clearly',
        description: 'Keep your refusal short; you can still leave or seek help.',
        outcomeTitle: 'Words of his own',
        outcome:
          'A speech bubble fills with Bob’s words: “No, I don’t want it.” The group does not immediately back off. He repeats his no and steps towards the exit, keeping his phone ready to call someone trusted.',
        takeaway: 'A clear no is enough; you owe no explanation. Refusal may not end pressure, so keep an exit or ally in mind.',
        memory: 'You drew a speech bubble. Bob said no and moved towards the exit when pressure continued.',
      },
    ],
    detour: {
      title: 'The page is still yours',
      body: 'Bob hesitates; he has not accepted the offer. Your progress is saved for this playthrough. Retry this page or choose untimed mode.',
    },
  },
  {
    id: 'the-reassuring-claim',
    title: 'The reassuring claim',
    location: 'Beside the bus stop',
    eyebrow: '02 / A claim is not proof',
    narration:
      'Near the bus stop, an acquaintance holds out something Bob cannot identify. Their voice sounds certain. Bob looks down at his sketchbook. A confident promise still leaves him with a question: what does he actually know?',
    dialogue: {
      speaker: 'An acquaintance',
      text: 'It’s harmless. Trust me, you don’t need to worry.',
    },
    instruction: 'Draw a boundary or a way to ask for support. Do not accept the unknown substance.',
    choices: [
      {
        id: 'claim-decline',
        object: 'stop',
        label: 'Decline the offer',
        description: 'Do not take an unknown substance on someone’s assurance.',
        outcomeTitle: 'A line he can hold',
        outcome:
          'A stop sign rises from the page. “No thanks. I don’t know what that is,” Bob says. He does not accept it and moves away. He can leave the uncertainty unresolved rather than test the claim.',
        takeaway: 'Confidence, popularity, and appearance do not establish safety. Avoid taking unknown substances.',
        memory: 'You drew a stop sign. Bob declined the unknown substance and moved away.',
      },
      {
        id: 'claim-advice',
        object: 'phone',
        label: 'Seek reliable advice',
        description: 'Step away and contact someone trusted for support and reliable information.',
        outcomeTitle: 'Room to check',
        outcome:
          'Bob leaves the offer behind and calls his aunt. She cannot identify the substance either. She listens, helps him find official support information, and reminds him he does not need to accept it while seeking advice.',
        takeaway: 'Step away from the offer. Seek trusted support and official information rather than relying on someone’s reassurance.',
        memory: 'You drew a phone. Bob stepped away and asked his aunt for support and reliable information.',
      },
    ],
    detour: {
      title: 'Uncertainty can wait',
      body: 'An unfinished drawing does not mean accepting the offer. Bob can still step away. Retry this page or continue in untimed mode; earlier pages stay complete.',
    },
  },
  {
    id: 'the-difficult-moment',
    title: 'The difficult moment',
    location: 'At the edge of the neighbourhood park',
    eyebrow: '03 / Make room to breathe',
    narration:
      'The evening feels heavier now. Bob sits near the park, replaying what happened and wondering whether anyone understands. Someone nearby offers him a substance to forget it all. His feelings need care, and he can choose another response.',
    dialogue: {
      speaker: 'Someone nearby',
      text: 'Rough evening? Want something to forget about it?',
    },
    instruction: 'Help Bob decline and find a calmer moment or someone to talk to.',
    choices: [
      {
        id: 'distress-pause',
        object: 'headphones',
        label: 'Take a calming pause',
        description: 'Decline, reach a safe place, and pause with familiar music.',
        outcomeTitle: 'A little breathing space',
        outcome:
          'Bob declines and goes inside the staffed community centre. Seated there, he puts on familiar music and takes a few slow breaths. The evening still hurts, but he has space to decide who he could talk to.',
        takeaway: 'A calming pause can help with a difficult moment. If distress persists, reach out to a trusted adult or counsellor.',
        memory: 'You drew headphones. Bob declined, reached the community centre, and took a calming pause.',
      },
      {
        id: 'distress-connect',
        object: 'phone',
        label: 'Tell someone how you feel',
        description: 'Decline and ask someone trusted to listen.',
        outcomeTitle: 'Someone listens',
        outcome:
          'Bob declines and steps into the community centre to call his older sister. “I’m upset. Can you listen for a bit?” She stays on the line. Talking does not solve everything, but he no longer carries the moment alone.',
        takeaway: 'You can ask for company without having all the words. Persistent distress deserves support from a trusted adult or counsellor.',
        memory: 'You drew a phone. Bob told his sister he was upset and asked her to listen.',
      },
    ],
    detour: {
      title: 'Another moment is available',
      body: 'Feeling overwhelmed is not a failure. Bob can still decline and seek support. Retry this page or use untimed mode; your earlier choices remain.',
    },
  },
  {
    id: 'a-friend-needs-help',
    title: 'A friend needs help',
    location: 'Under the covered walkway',
    eyebrow: '04 / Get urgent help',
    narration:
      'Under the covered walkway, Bob finds his friend swaying and struggling to answer. They seem dizzy, confused, and seriously unwell. Bob does not know why. He needs emergency help now, rather than waiting for the feeling to pass.',
    dialogue: {
      speaker: 'Bob’s friend',
      text: 'I feel really dizzy. I can’t think properly. Please stay.',
    },
    instruction: 'In a real emergency, call 995 now. Stay with your friend and follow the operator. Never wait for a drawing.',
    emergency: true,
    choices: [
      {
        id: 'emergency-call',
        object: 'phone',
        label: 'Call 995 now',
        description: 'Get emergency help immediately, stay with your friend, and follow the operator.',
        outcomeTitle: 'Help is called now',
        outcome:
          'Bob immediately calls 995, gives their location, and describes what he sees. He stays with his friend and follows the operator’s instructions while emergency help is arranged.',
        takeaway: 'Serious confusion or changes in responsiveness need urgent help. Call 995, stay with the person, and follow the operator’s instructions.',
        memory: 'You drew a phone. Bob called 995 immediately, stayed with his friend, and followed the operator.',
      },
      {
        id: 'emergency-alert',
        object: 'signal',
        label: 'Ask an adult to call 995',
        description: 'Alert a nearby adult immediately and stay with your friend.',
        outcomeTitle: 'Another pair of hands',
        outcome:
          'Bob signals a nearby adult: “Call 995 now. My friend is seriously unwell.” The adult calls immediately on speaker. Bob stays with his friend, gives their location, and follows the operator’s instructions with the adult.',
        takeaway: 'Ask someone nearby to call 995 immediately. Stay with your friend and follow the operator; do not wait for symptoms to pass.',
        memory: 'You drew a signal. Bob got an adult to call 995 immediately, stayed with his friend, and followed the operator.',
      },
    ],
    detour: {
      title: 'Do not wait for the drawing',
      body: 'Call 995 immediately, or ask a nearby adult to call now. Give your location, stay with your friend, and follow the operator’s instructions. You can continue with emergency help in untimed mode; no retry is needed.',
    },
  },
  {
    id: 'the-last-stretch',
    title: 'The last stretch',
    location: 'On the path towards home',
    eyebrow: '05 / A connection home',
    narration:
      'Once the ambulance crew takes over his friend’s care, Bob heads towards home. Warm windows glow beyond the path. He wants to tell someone about tonight, but worries they will judge him. His sketchbook has room for one more connection.',
    dialogue: {
      speaker: 'Bob',
      text: 'What if they judge me? I could use someone beside me right now.',
    },
    instruction: 'Draw a bridge to someone trusted. Ask for help getting home and talking things through.',
    choices: [
      {
        id: 'home-connect',
        object: 'bridge',
        label: 'Reach someone trusted',
        description: 'Ask a trusted adult to meet you and hear what happened.',
        outcomeTitle: 'The last stretch, together',
        outcome:
          'The bridge becomes a path forward. Bob calls his aunt: “Could you meet me? I need to talk.” She meets him and walks home with him. Over a warm drink, he begins telling her about the evening.',
        takeaway: 'Asking for help is a useful action. A parent, caregiver, counsellor, or another trusted adult can offer support.',
        memory: 'You drew a bridge. Bob asked his aunt to meet him, walked home with her, and shared what happened.',
      },
    ],
    detour: {
      title: 'The connection is still there',
      body: 'Bob can ask for company even if the words take time. Retry this page or finish in untimed mode. All your earlier choices stay in the sketchbook.',
    },
  },
];

export const resources = [
  {
    label: 'NCADA support resources',
    href: 'https://www.ncada.org.sg/seeking-help/',
    description: 'Find Singapore support resources for concerns about drugs, for yourself or someone you care about.',
  },
  {
    label: 'SCDF emergency medical services',
    href: 'https://www.scdf.gov.sg/home/about-us/information-on-ems',
    description: 'Learn about Singapore emergency medical services. For an ambulance or fire emergency, call 995 immediately.',
  },
];
