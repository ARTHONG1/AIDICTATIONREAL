'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type SentenceListProps = {
  sentences: string[];
  setSentences: React.Dispatch<React.SetStateAction<string[]>>;
};

export function SentenceList({ sentences, setSentences }: SentenceListProps) {
  const handleSentenceChange = (index: number, value: string) => {
    const newSentences = [...sentences];
    newSentences[index] = value;
    setSentences(newSentences);
  };

  const handleDeleteSentence = (index: number) => {
    const newSentences = sentences.filter((_, i) => i !== index);
    setSentences(newSentences);
  };

  if (sentences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-xl font-semibold text-gray-700">문장 목록</h3>
      <ScrollArea className="h-64 rounded-md border p-4">
        <div className="space-y-3">
          {sentences.map((sentence, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
              <Input
                value={sentence}
                onChange={e => handleSentenceChange(index, e.target.value)}
                className="flex-grow"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSentence(index)}
                aria-label="Delete sentence"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
