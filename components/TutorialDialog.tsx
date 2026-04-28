import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to StockQuest! 🎮',
      content: 'Learn how to invest in the stock market through an interactive, gamified experience. This is a simulation using in-game currency, so you can learn without any real financial risk.',
    },
    {
      title: 'Your Starting Capital 💰',
      content: 'You begin with $10,000 in virtual cash. Use this to buy stocks and build your portfolio. Your goal is to grow your wealth through smart investing decisions.',
    },
    {
      title: 'How to Invest 📈',
      content: 'Visit the Market tab to see available stocks. Each stock has information about the company, sector, and current price. Stock prices update every 5 seconds to simulate market movements.',
    },
    {
      title: 'Learn as You Go 🎓',
      content: 'Every trade earns you experience points to level up. Complete achievements to track your progress. I\'ll provide tips and feedback to help you become a better investor!',
    },
    {
      title: 'Ready to Start? 🚀',
      content: 'Remember: Diversification is key! Don\'t put all your money in one stock. Research each company before investing. Good luck, and have fun learning!',
    },
  ];

  const currentStep = tutorialSteps[step];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentStep.title}</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-black-700">{currentStep.content}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleNext} className="flex-1">
            {step < tutorialSteps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
          {step < tutorialSteps.length - 1 && (
            <Button variant="outline" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          )}
        </div>

        <div className="flex gap-1 justify-center">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === step ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
