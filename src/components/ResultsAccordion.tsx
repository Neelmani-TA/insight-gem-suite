import React from 'react';
import ResultCard from '@/components/ResultCard';

interface ResultsAccordionProps {
  results: Record<string, string>;
  openCards: Record<string, boolean>;
  onToggleCard: (key: string) => void;
}

const ResultsAccordion: React.FC<ResultsAccordionProps> = ({
  results,
  openCards,
  onToggleCard
}) => {
  return (
    <div className="space-y-3">
      {Object.entries(results).map(([key, content]) => (
        <ResultCard
          key={key}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
          content={content}
          isOpen={openCards[key]}
          onToggle={() => onToggleCard(key)}
        />
      ))}
    </div>
  );
};

export default ResultsAccordion;