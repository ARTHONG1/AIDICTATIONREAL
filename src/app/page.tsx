'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, RefreshCw, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateSentencesAction } from './actions';
import { DictationForm } from '@/components/dictation-form';
import { ManualInput } from '@/components/manual-input';
import { SentenceList } from '@/components/sentence-list';
import { WorksheetPreview } from '@/components/worksheet-preview';
import type { GenerateDictationSentencesInput } from '@/ai/flows/generate-dictation-sentences';
import { AdditionalFeatures } from '@/components/additional-features';

const PAGE_SIZE = 6;

export default function Home() {
  const [sentences, setSentences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const worksheetRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sentencePages = useMemo(() => {
    const pages: string[][] = [];
    if (sentences.length === 0) {
      return [];
    }
    for (let i = 0; i < sentences.length; i += PAGE_SIZE) {
      pages.push(sentences.slice(i, i + PAGE_SIZE));
    }
    return pages;
  }, [sentences]);

  const handleGenerateSentences = async (
    data: Omit<GenerateDictationSentencesInput, 'numberOfSentences'> & { numberOfSentences: string }
  ) => {
    setIsLoading(true);
    try {
      const parsedData = {
        ...data,
        numberOfSentences: parseInt(data.numberOfSentences, 10),
      };
      const result = await generateSentencesAction(parsedData);
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.sentences) {
        setSentences(prev => [...prev, ...result.sentences]);
        toast({
          title: '성공!',
          description: 'AI가 문장을 성공적으로 생성했습니다.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '오류 발생',
        description:
          error instanceof Error ? error.message : '문장 생성 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSentences([]);
    worksheetRefs.current = [];
    toast({
      title: '초기화 완료',
      description: '새로운 학습지 만들기를 시작합니다.',
    });
  };

  const handleDownload = useCallback((pageIndex: number) => {
    if (worksheetRefs.current[pageIndex] === null) {
      return;
    }

    htmlToImage.toPng(worksheetRefs.current[pageIndex]!, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `dictation-worksheet-page-${pageIndex + 1}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: '이미지 다운로드 오류',
          description: '이미지를 다운로드하는 중 오류가 발생했습니다.',
        });
      });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <Pencil className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-gray-800">
              귀여운 AI 받아쓰기 뚝딱!
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            AI로 받아쓰기 문장을 만들거나 직접 입력하여 학습지를 만들어 보세요.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-6">
              <DictationForm
                onSubmit={handleGenerateSentences}
                isLoading={isLoading}
              />
              <Separator />
              <ManualInput setSentences={setSentences} />
              <Separator />
              <AdditionalFeatures />
              <SentenceList sentences={sentences} setSentences={setSentences} />
            </CardContent>
          </Card>

          {/* Right Panel */}
          <div className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold text-center text-gray-700">
              최종 학습지 미리보기
            </h2>
            <div className="space-y-8">
              {sentencePages.length === 0 ? (
                <WorksheetPreview 
                  ref={el => (worksheetRefs.current[0] = el)} 
                  sentences={[]} 
                  pageNumber={1} 
                  totalPages={1} 
                  startingIndex={0}
                />
              ) : (
                sentencePages.map((pageSentences, index) => (
                  <div key={index} className="space-y-4">
                    <WorksheetPreview
                      ref={el => (worksheetRefs.current[index] = el)}
                      sentences={pageSentences}
                      pageNumber={index + 1}
                      totalPages={sentencePages.length}
                      startingIndex={index * PAGE_SIZE}
                    />
                    <Button 
                      onClick={() => handleDownload(index)} 
                      className="w-full text-lg py-6 px-8 shadow-md transition-transform hover:scale-105" 
                      variant="default" style={{backgroundColor: 'hsl(var(--accent))'}}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {sentencePages.length > 1 ? `페이지 ${index + 1} 다운로드` : '이미지 다운로드'}
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button onClick={handleReset} variant="outline" className="text-lg py-6 px-8 shadow-md transition-transform hover:scale-105">
                <RefreshCw className="mr-2 h-5 w-5" />
                새 학습지 만들기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
