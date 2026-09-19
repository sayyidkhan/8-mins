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
      'The court lights flicker on. Bob tucks his sketchbook under his arm, ready for home. A group calls him back and offers him drugs. He wants to leave, but being the first to say no feels difficult.',
    dialogue: {
      speaker: 'Someone in the group',
      text: 'Stay a bit. Everyone else has tried it. Want some?',
    },
    instruction: 'Freely sketch one of three objects over the scene image: a door, phone, or speech bubble. You have 8 seconds; AI identifies which choice you drew.',
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
      'Near the bus stop, an acquaintance offers Bob a drug he cannot identify. Their voice sounds certain. Bob looks down at his sketchbook. A confident promise still leaves him with a question: what does he actually know?',
    dialogue: {
      speaker: 'An acquaintance',
      text: 'It’s harmless. Trust me, you don’t need to worry.',
    },
    instruction: 'Freely sketch one of three objects over the scene image: a stop sign, phone, or door. You have 8 seconds; AI identifies your choice. Leave the unknown drug behind.',
    choices: [
      {
        id: 'claim-decline',
        object: 'stop',
        label: 'Decline the offer',
        description: 'Do not take an unknown drug on someone’s assurance.',
        outcomeTitle: 'A line he can hold',
        outcome:
          'A stop sign rises from the page. “No thanks. I don’t know what that is,” Bob says. He does not accept it and moves away. He can leave the uncertainty unresolved rather than test the claim.',
        takeaway: 'Confidence, popularity, and appearance do not establish safety. Avoid taking unknown drugs.',
        memory: 'You drew a stop sign. Bob declined the unknown drug and moved away.',
      },
      {
        id: 'claim-advice',
        object: 'phone',
        label: 'Seek reliable advice',
        description: 'Step away and contact someone trusted for support and reliable information.',
        outcomeTitle: 'Room to check',
        outcome:
          'Bob leaves the offer behind and calls his aunt. She cannot identify the drug either. She listens, helps him find official support information, and reminds him he does not need to accept it while seeking advice.',
        takeaway: 'Step away from the offer. Seek trusted support and official information rather than relying on someone’s reassurance.',
        memory: 'You drew a phone. Bob stepped away and asked his aunt for support and reliable information.',
      },
      {
        id: 'claim-leave',
        object: 'door',
        label: 'Leave the offer behind',
        description: 'Decline and move to a nearby lit, staffed shop.',
        outcomeTitle: 'Away from the offer',
        outcome:
          'A doorway opens towards the nearby shop. Bob leaves without taking the drug and goes inside, where staff and other customers are present. He gives himself distance from the offer without staying to debate the claim.',
        takeaway: 'You can leave an unknown drug behind without identifying it or proving someone wrong. Move towards a lit, staffed place.',
        memory: 'You drew a door. Bob left the unknown drug behind and went into a lit, staffed shop.',
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
      'The evening feels heavier now. Bob sits near the park, replaying what happened and wondering whether anyone understands. Someone nearby offers him drugs to forget it all. His feelings need care, and he can choose another response.',
    dialogue: {
      speaker: 'Someone nearby',
      text: 'Rough evening? Want something to forget about it?',
    },
    instruction: 'Freely sketch one of three objects over the scene image: headphones, a phone, or a door. You have 8 seconds; AI identifies your choice. Help Bob decline and find support.',
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
        label: 'Call someone trusted',
        description: 'Decline and ask someone trusted to listen.',
        outcomeTitle: 'Someone listens',
        outcome:
          'Bob declines and steps into the community centre to call his older sister. “I’m upset. Can you listen for a bit?” She stays on the line. Talking does not solve everything, but he no longer carries the moment alone.',
        takeaway: 'You can ask for company without having all the words. Persistent distress deserves support from a trusted adult or counsellor.',
        memory: 'You drew a phone. Bob told his sister he was upset and asked her to listen.',
      },
      {
        id: 'distress-support',
        object: 'door',
        label: 'Ask staff for support',
        description: 'Decline and enter the staffed community centre to ask for help.',
        outcomeTitle: 'Support through the doorway',
        outcome:
          'Bob declines the drugs and walks through the community centre doors. At the staffed desk, he says, “I’m having a difficult evening. Could someone help?” A staff member sits with him and helps him contact a trusted adult for support.',
        takeaway: 'You can ask for help in person. A staffed community space can help you connect with a trusted adult or counsellor.',
        memory: 'You drew a door. Bob entered the staffed community centre and asked for support in person.',
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
    instruction: 'In a real emergency, call 995 now, stay with your friend, and follow the operator. Never wait for a drawing. In the game, freely sketch one of three objects over the scene image: a phone, signal, or speech bubble. You have 8 seconds; AI identifies your choice.',
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
        label: 'Signal an adult',
        description: 'Alert a nearby adult immediately and stay with your friend.',
        outcomeTitle: 'Another pair of hands',
        outcome:
          'Bob signals a nearby adult: “Call 995 now. My friend is seriously unwell.” The adult calls immediately on speaker. Bob stays with his friend, gives their location, and follows the operator’s instructions with the adult.',
        takeaway: 'Ask someone nearby to call 995 immediately. Stay with your friend and follow the operator; do not wait for symptoms to pass.',
        memory: 'You drew a signal. Bob got an adult to call 995 immediately, stayed with his friend, and followed the operator.',
      },
      {
        id: 'emergency-shout',
        object: 'speech',
        label: 'Call out for help',
        description: 'Call out to a nearby adult: “Call 995 now.” Stay with your friend.',
        outcomeTitle: 'An urgent call carries',
        outcome:
          'A nearby adult is facing away. Bob calls out clearly: “Call 995 now. My friend is seriously unwell.” The adult turns and immediately calls on speaker. Bob stays beside his friend, gives their location, and follows the operator’s instructions with the adult.',
        takeaway: 'Call out a specific request for emergency help: “Call 995 now.” Stay with the person and follow the operator’s instructions.',
        memory: 'You drew a speech bubble. Bob called out to an adult to call 995 now, stayed with his friend, and followed the operator.',
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
    instruction: 'Freely sketch one of three objects over the scene image: a bridge, phone, or speech bubble. You have 8 seconds; AI identifies your choice. Connect with someone trusted for help home.',
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
      {
        id: 'home-call',
        object: 'phone',
        label: 'Call for company home',
        description: 'Call a trusted adult from a lit, staffed place and ask them to accompany you home.',
        outcomeTitle: 'Somewhere to wait',
        outcome:
          'Bob steps into a lit, staffed shop and calls his dad: “I’m at the shop. Could you come and walk home with me?” He waits inside until his dad arrives. With someone beside him on the way home, he begins to explain why tonight felt difficult.',
        takeaway: 'Share your location with a trusted adult and ask for company home. A lit, staffed place gives you somewhere to wait for them.',
        memory: 'You drew a phone. Bob called his dad from a lit, staffed shop, waited inside, and walked home with him.',
      },
      {
        id: 'home-talk',
        object: 'speech',
        label: 'Ask for help in person',
        description: 'Speak directly to a trusted adult for help getting home and talking things through.',
        outcomeTitle: 'A conversation begins',
        outcome:
          'Bob spots a trusted adult he knows from the community centre by its entrance. He walks over and says, “Could you help me get home? I need someone to talk to.” They sit inside while arranging for his aunt to accompany him home, and Bob starts sharing what happened.',
        takeaway: 'You can ask a trusted adult directly for practical help and a listening ear. You do not need to explain everything at once.',
        memory: 'You drew a speech bubble. Bob spoke to a trusted adult in person, began talking, and arranged help getting home.',
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
