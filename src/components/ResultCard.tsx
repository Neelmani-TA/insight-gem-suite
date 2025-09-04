import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  title: string;
  content: string;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  content, 
  isOpen = false, 
  onToggle,
  className 
}) => {
  // Convert markdown-like content to JSX
  const renderContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentTable: string[] = [];
    let inTable = false;

    lines.forEach((line, index) => {
      line = line.trim();
      
      // Handle tables
      if (line.includes('|') && line.split('|').length > 2) {
        currentTable.push(line);
        inTable = true;
        return;
      } else if (inTable && currentTable.length > 0) {
        // End of table - render it
        elements.push(renderTable(currentTable, elements.length));
        currentTable = [];
        inTable = false;
      }

      // Skip empty lines
      if (!line) {
        elements.push(<div key={`br-${index}`} className="h-2" />);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl font-bold text-foreground mb-3 pb-2 border-b border-border">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg font-semibold text-foreground mb-3 mt-4">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-medium text-foreground mb-2 mt-3">
            {line.substring(4)}
          </h3>
        );
      }
      // Bold text
      else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={index} className="font-semibold text-foreground mb-2">
            {line.substring(2, line.length - 2)}
          </p>
        );
      }
      // List items
      else if (line.startsWith('- ')) {
        elements.push(
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-primary font-bold mt-1">•</span>
            <span className="text-muted-foreground">{line.substring(2)}</span>
          </div>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const number = line.match(/^(\d+)\./)?.[1];
        const text = line.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-primary font-semibold mt-0.5 min-w-[1.5rem]">{number}.</span>
            <span className="text-muted-foreground">{text}</span>
          </div>
        );
      }
      // Status indicators
      else if (line.includes('✅') || line.includes('❌')) {
        elements.push(
          <p key={index} className="text-sm text-muted-foreground mb-2 flex items-center space-x-2">
            <span>{line}</span>
          </p>
        );
      }
      // Regular paragraphs
      else {
        // Handle inline formatting
        let formattedLine = line;
        
        // Bold inline text
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
        
        elements.push(
          <p 
            key={index} 
            className="text-muted-foreground mb-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
    });

    // Handle any remaining table
    if (inTable && currentTable.length > 0) {
      elements.push(renderTable(currentTable, elements.length));
    }

    return elements;
  };

  const renderTable = (tableLines: string[], key: number) => {
    if (tableLines.length < 2) return null;

    const rows = tableLines.map(line => 
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );

    const headers = rows[0];
    const dataRows = rows.slice(2); // Skip header separator line

    return (
      <div key={key} className="my-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              {headers.map((header, i) => (
                <th key={i} className="text-left py-2 px-3 font-semibold text-foreground text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                {row.map((cell, j) => (
                  <td key={j} className="py-2 px-3 text-sm text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className={cn(
        "glass rounded-lg border border-border/50 overflow-hidden",
        "hover:border-primary/30 transition-all duration-300",
        className
      )}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-auto p-4 justify-between text-left hover:bg-card-glass/50"
          >
            <span className="font-semibold text-foreground">{title}</span>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          <div className="p-4 pt-0 border-t border-border/30">
            <div className="prose prose-sm max-w-none">
              {renderContent(content)}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ResultCard;