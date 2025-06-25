'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type ManualInputProps = {
  setSentences: React.Dispatch<React.SetStateAction<string[]>>;
};

export function ManualInput({ setSentences }: ManualInputProps) {
  const [manualText, setManualText] = useState('');

  const handleAddSentences = () => {
    if (manualText.trim() === '') return;
    const newSentences = manualText.split('\n').filter(s => s.trim() !== '');
    setSentences(prev => [...prev, ...newSentences]);
    setManualText('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-xl font-semibold text-gray-700">직접 문장 입력</h3>
      <div className="space-y-2">
        <Label htmlFor="manual-sentences">
          각 줄에 하나의 문장을 입력하고 '문장 추가' 버튼을 누르세요.
        </Label>
        <Textarea
          id="manual-sentences"
          value={manualText}
          onChange={e => setManualText(e.target.value)}
          placeholder="예시) 하늘이 참 파랗다."
          rows={4}
        />
      </div>
      <Button onClick={handleAddSentences} variant="secondary" className="w-full text-md py-5">
        문장 추가
      </Button>
    </div>
  );
}
