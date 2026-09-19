import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Phone,
  Shield,
  Heart,
  DoorOpen,
  PhoneCall,
  MessageSquare,
  Octagon,
  Search,
  Headphones,
  HeartHandshake,
  ShieldAlert,
  Flame,
  Key,
} from 'lucide-react';
import { PlayerJournalEntry } from '../types';

interface EndingJournalProps {
  journalEntries: PlayerJournalEntry[];
  onReplay: () => void;
}

export const EndingJournal: React.FC<EndingJournalProps> = ({
  journalEntries,
  onReplay,
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen':
        return <DoorOpen className="w-5 h-5 text-[#254b38]" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-[#855d21]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#2f4d6d]" />;
      case 'Octagon':
        return <Octagon className="w-5 h-5 text-[#9b2c2c]" />;
      case 'Search':
        return <Search className="w-5 h-5 text-[#2b4c6f]" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-[#285744]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#963750]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-[#b91c1c]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#c26d1d]" />;
      case 'Key':
        return <Key className="w-5 h-5 text-[#966b24]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#8c6727]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10"
    >
      {/* Bob Reaches Safety Hero Card */}
      <div className="bg-[#ffffff] rounded-3xl border-2 border-[#dfd8cb] p-6 sm:p-10 shadow-lg text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#eff7f2] border border-[#cbe4d4] text-[#245239]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold tracking-widest uppercase text-[#8c6727]">
            ✦ JOURNEY COMPLETE
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-display text-[#1c2923]">
            Bob is safely home.
          </h1>
          <p className="text-base sm:text-lg text-[#4a5851] max-w-xl mx-auto font-sans-ui">
            With your sketches, Bob made courage tangible. Five decisions, five moments of clarity, and a safe step at every turn.
          </p>
        </div>

        {/* Replay CTA */}
        <div className="pt-2 flex justify-center">
          <button
            id="replay-story-button"
            onClick={onReplay}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#274c38] hover:bg-[#1d3829] text-[#fbf8f2] font-semibold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4 text-[#eeddb7]" />
            <span>Open a Fresh Sketchbook (Replay)</span>
          </button>
        </div>
      </div>

      {/* The Player's Sketchbook Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-serif-display text-[#1d2c24] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8c6727]" />
            <span>Bob’s Illustrated Sketchbook</span>
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eee5d3] text-[#6d5122]">
            {journalEntries.length} Inked Memories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journalEntries.map((entry) => (
            <div
              key={entry.chapterId}
              className="bg-[#ffffff] rounded-2xl border border-[#ded5c5] p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#806126]">
                  <span>Chapter {entry.chapterId}</span>
                  {entry.recognizedConcept ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#eef7f2] text-[#1c4932] text-[11px] font-semibold border border-[#cbe3d3]">
                      AI: {entry.recognizedConcept}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#f6efe1] text-[#715420]">
                      Safe Choice
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3eb] border border-[#ded5c5] flex items-center justify-center shrink-0">
                    {renderIcon(entry.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1c2923]">
                      {entry.optionName}
                    </h3>
                    <p className="text-xs text-[#5a6b61] font-serif-display italic">
                      {entry.caption}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ede7d8] text-xs text-[#3d5145] leading-relaxed bg-[#fbf9f4] p-3 rounded-lg">
                <strong className="text-[#244c37]">Lesson learned: </strong>
                {entry.takeaway}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounded Real-World Help Resources (Singapore Context & Global Guidance) */}
      <div className="bg-[#fcfaf4] rounded-3xl border-2 border-[#dfd8cb] p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2d523e]">
            <Shield className="w-4 h-4 text-[#2d523e]" />
            <span>Community & Emergency Support Resources</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif-display text-[#1c2822]">
            Help is always reachable.
          </h3>
          <p className="text-xs sm:text-sm text-[#54645b] leading-relaxed">
            If you or someone you care about is facing peer pressure, experiencing substance distress, or in need of guidance, real trusted people are ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {/* Emergency 995 */}
          <div className="p-4 rounded-xl bg-[#ffffff] border border-[#ded6c5] space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b91c1c]">
              <Phone className="w-3.5 h-3.5" />
              <span>SCDF Emergency (Singapore)</span>
            </div>
            <div className="text-lg font-bold text-[#1a2620]">Dial 995</div>
            <p className="text-[11px] text-[#55645c] leading-tight">
              Immediate medical assistance for collapse, unresponsiveness, or severe distress.
            </p>
          </div>

          {/* NCADA Support */}
          <a
            href="https://www.ncada.org.sg/seeking-help/"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#ffffff] border border-[#ded6c5] hover:border-[#2d523e] space-y-1.5 shadow-xs transition-colors group block"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#2d523e]">
              <span>NCADA Seeking Help</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-sm font-bold text-[#1a2620]">Preventive Resources</div>
            <p className="text-[11px] text-[#55645c] leading-tight">
              Educational guides, counselling avenues, and youth empowerment networks.
            </p>
          </a>

          {/* Samaritans / Youthline */}
          <div className="p-4 rounded-xl bg-[#ffffff] border border-[#ded6c5] space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#204a6e]">
              <Heart className="w-3.5 h-3.5" />
              <span>Emotional & Crisis Support</span>
            </div>
            <div className="text-sm font-bold text-[#1a2620]">SOS: 1767 / Youthline</div>
            <p className="text-[11px] text-[#55645c] leading-tight">
              Free, confidential listening support available 24/7 whenever you feel overwhelmed.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
