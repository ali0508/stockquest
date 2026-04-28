
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    target: null,
    title: 'Welcome to StockQuest! 🎮',
    content: 'Learn to invest through a gamified experience with $10,000 in virtual cash. No real money, no real risk!',
    position: 'center',
  },
  {
    target: 'header',
    title: 'Your Progress Bar 🏆',
    content: 'This shows your current level and XP. Every trade earns you experience points — level up by making smart investments!',
    position: 'bottom',
  },
  {
    target: 'nav',
    title: 'Navigation Tabs 🗂️',
    content: 'Switch between Home (dashboard), Market (buy/sell), Portfolio (your holdings), and Awards (achievements).',
    position: 'bottom',
  },
  {
    target: 'main',
    title: 'Dashboard 📊',
    content: 'Your home screen shows total portfolio value, cash available, gain/loss, and a live market overview.',
    position: 'top',
  },
  {
    target: null,
    title: 'AI Trade Suggestions 🤖',
    content: 'When you tap Buy or Sell on any stock, our AI analyzes the market and tells you if it\'s a good or risky trade!',
    position: 'center',
  },
  {
    target: null,
    title: 'ETFs vs Stocks 📦',
    content: 'In the Market tab, you\'ll find both individual stocks (like AAPL) and Index ETFs (like SPY). ETFs are safer — they track hundreds of companies at once!',
    position: 'center',
  },
  {
    target: null,
    title: 'Ready to invest? 🚀',
    content: 'Start by visiting the Market tab. Try buying an ETF first for safety, then explore individual stocks. Good luck!',
    position: 'center',
  },
];

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = steps[step];

  useEffect(() => {
    if (!open) return;
    if (currentStep.target) {
      const el = document.querySelector(`[data-tutorial="${currentStep.target}"]`);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      setTargetRect(null);
    }
  }, [step, open]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onOpenChange(false);
      setStep(0);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    setStep(0);
  };

  if (!open) return null;

  const PADDING = 8;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay with spotlight cutout */}
      {targetRect ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={handleSkip}>
          <defs>
            <mask id="spotlight">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - PADDING}
                y={targetRect.top - PADDING}
                width={targetRect.width + PADDING * 2}
                height={targetRect.height + PADDING * 2}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#spotlight)" />
          {/* Highlight border */}
          <rect
            x={targetRect.left - PADDING}
            y={targetRect.top - PADDING}
            width={targetRect.width + PADDING * 2}
            height={targetRect.height + PADDING * 2}
            rx="12"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />
        </svg>
      ) : (
        <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={handleSkip} />
      )}

      {/* Tooltip card */}
      <div
        className="absolute pointer-events-auto z-10"
        style={
          targetRect
            ? currentStep.position === 'bottom'
              ? { top: targetRect.bottom + PADDING + 8, left: Math.max(12, targetRect.left), maxWidth: 300 }
              : { bottom: window.innerHeight - targetRect.top + PADDING + 8, left: Math.max(12, targetRect.left), maxWidth: 300 }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: 320, width: '90%' }
        }
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-gray-900 pr-2">{currentStep.title}</h3>
            <span className="text-xs text-gray-400 whitespace-nowrap">{step + 1}/{steps.length}</span>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">{currentStep.content}</p>

          {/* Progress dots */}
          <div className="flex gap-1 justify-center mb-3">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-4 bg-indigo-600' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleNext} className="flex-1 text-xs h-8 bg-indigo-600 hover:bg-indigo-700">
              {step < steps.length - 1 ? 'Next →' : '🚀 Start Investing!'}
            </Button>
            {step < steps.length - 1 && (
              <Button variant="outline" onClick={handleSkip} className="text-xs h-8">
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
