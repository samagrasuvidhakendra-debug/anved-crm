import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  CreditCard,
  PhoneCall,
  Sun
} from 'lucide-react';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstLaunch?: boolean;
}

const TOUR_STEPS = [
  {
    title: 'Welcome to ACS SOLAR',
    subtitle: 'Enterprise Digital Operating System for Solar Franchises',
    icon: Sun,
    description:
      'ACS SOLAR empowers franchise owners, sales managers, site surveyors, and installation teams to manage the complete solar lifecycle from inquiry to net-meter commissioning.',
    highlights: [
      'Multi-tenant architecture: Each franchise has strictly isolated business data',
      'Real-time CRM with follow-up tracking and 1-click WhatsApp/Call',
      'Site survey photo capture and solar capacity sizing',
      'Branded quotation generator in Indian Rupees (₹) with GST calculations',
      'ACS SOLAR AI Assistant with authorized database access'
    ]
  },
  {
    title: 'Franchise Dashboard & KPIs',
    subtitle: 'Real-time performance at a glance',
    icon: Layers,
    description:
      'Track your key metrics including Total Leads, Today’s Follow-ups, Pending Payments, and Active Solar Projects.',
    highlights: [
      'Quick action buttons for 1-tap Lead, Customer, and Quotation creation',
      'Overdue and today follow-up alerts',
      'Monthly sales tally with conversion rate'
    ]
  },
  {
    title: 'Solar CRM & Pipeline',
    subtitle: 'From inquiry to won customer',
    icon: PhoneCall,
    description:
      'Manage prospective customers across stages: New → Contacted → Site Visit → Quotation → Negotiation → Won.',
    highlights: [
      'Detailed solar property profiling (Residential, Commercial, Industrial)',
      'Electricity bill and monthly kWh power consumption tracking',
      'Scheduled follow-ups with automatic notifications'
    ]
  },
  {
    title: 'Quotations & Payments',
    subtitle: 'Professional estimates & payment receipts in ₹',
    icon: FileText,
    description:
      'Create customized quotations specifying Tier-1 panels (Waaree, Adani), inverters (Growatt, Havells), and elevated GI structures.',
    highlights: [
      'Automatic composite solar GST calculation (13.8%) and discounts',
      'Generate shareable PDF quotation templates with your franchise details',
      'Record advance, milestone, and final payments with UPI / UTR reference'
    ]
  },
  {
    title: 'ACS SOLAR AI Assistant',
    subtitle: 'Your authorized 24/7 solar business intelligence partner',
    icon: Sparkles,
    description:
      'Query your authorized franchise data conversational style. Ask about pending payments, active installations, or have AI draft quotations with built-in confirmation safety.',
    highlights: [
      'Strict multi-tenant security: Never exposes other franchise records',
      'Ask "Show today’s follow-ups" or "What were my sales this month?"',
      'Action confirmation dialogs before executing quotations or updates'
    ]
  }
];

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose, isFirstLaunch = false }) => {
  const { guides } = useApp();
  const [activeTab, setActiveTab] = useState<'tour' | 'articles'>('tour');
  const [tourIndex, setTourIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[tourIndex];
  const StepIcon = currentStep.icon;

  const filteredGuides = guides.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        id="app-guide-modal"
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                ACS SOLAR App Guide
                <span className="text-[10px] uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                  Interactive Help
                </span>
              </h2>
              <p className="text-xs text-slate-400">Master every feature of your solar franchise management system</p>
            </div>
          </div>
          <button
            id="close-app-guide-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2">
          <button
            onClick={() => setActiveTab('tour')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'tour'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Guided Walkthrough ({tourIndex + 1}/{TOUR_STEPS.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'articles'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Knowledge Base & How-To Guides ({guides.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'tour' ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-sky-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <StepIcon className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                  <p className="text-xs text-amber-400/90 font-medium mb-2">{currentStep.subtitle}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{currentStep.description}</p>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Key Capabilities</h4>
                <div className="space-y-2.5">
                  {currentStep.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {TOUR_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTourIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === tourIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search how-to topics (e.g. lead, quotation, project, payment, AI)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Guides List */}
              <div className="space-y-3">
                {filteredGuides.map(guide => {
                  const isExpanded = selectedGuideId === guide.id;
                  return (
                    <div
                      key={guide.id}
                      className="border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setSelectedGuideId(isExpanded ? null : guide.id)}
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                              {guide.category}
                            </span>
                            <span className="text-sm font-bold text-white">{guide.title}</span>
                          </div>
                          <p className="text-xs text-slate-400">{guide.description}</p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-90 text-amber-400' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-slate-800/80 bg-slate-900/40">
                          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 pt-3">
                            Step-by-Step Instructions
                          </h5>
                          <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                            {guide.steps.map((step, idx) => (
                              <li key={idx} className="pl-1 text-slate-300">
                                <span className="text-slate-200 font-medium">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {activeTab === 'tour' ? (
            <>
              <button
                id="guide-skip-btn"
                onClick={onClose}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 transition-colors"
              >
                Skip Tour
              </button>
              <div className="flex items-center gap-2">
                <button
                  id="guide-prev-btn"
                  onClick={() => setTourIndex(Math.max(0, tourIndex - 1))}
                  disabled={tourIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                {tourIndex < TOUR_STEPS.length - 1 ? (
                  <button
                    id="guide-next-btn"
                    onClick={() => setTourIndex(tourIndex + 1)}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all shadow shadow-amber-500/20"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    id="guide-finish-btn"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold flex items-center gap-1 transition-all shadow"
                  >
                    Finish Guide
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span>Super Admin can edit or add new guides from the Admin Panel.</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
