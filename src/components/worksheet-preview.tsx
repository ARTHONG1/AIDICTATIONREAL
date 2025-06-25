'use client';

import React, { forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type WorksheetPreviewProps = {
  sentences: string[];
  pageNumber: number;
  totalPages: number;
  startingIndex: number;
};

const CutePencilIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 100 100"
    className="absolute bottom-4 right-4 opacity-70"
    aria-hidden="true"
  >
    <g transform="rotate(30 50 50)">
      <path
        d="M85,35 L65,15 L25,55 L15,85 L45,75 Z"
        fill="#FFDDC1"
        stroke="#E6BFB3"
        strokeWidth="2"
      />
      <path
        d="M65,15 L70,20 L30,60 L25,55 Z"
        fill="#F4C2C2"
        stroke="#E6BFB3"
        strokeWidth="2"
      />
      <path d="M65,15 L60,10 L55,15 L60,20 Z" fill="#333333" />
      <circle cx="30" cy="70" r="3" fill="#60A5FA" />
      <path
        d="M20,80 Q 25 70, 35 75"
        stroke="#60A5FA"
        strokeWidth="2"
        fill="none"
      />
    </g>
  </svg>
);


export const WorksheetPreview = forwardRef<HTMLDivElement, WorksheetPreviewProps>(
  ({ sentences, pageNumber, totalPages, startingIndex }, ref) => {
    return (
      <Card
        className="aspect-[210/297] w-full max-w-xl mx-auto shadow-xl overflow-hidden"
      >
        <ScrollArea className="h-full">
          <div
            ref={ref}
            className="p-8 bg-white h-full font-body text-gray-800 relative"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, transparent 98%, hsl(var(--border)) 98%)',
              backgroundSize: '100% 2.5rem',
            }}
          >
            <header className="mb-8 pb-4 border-b-2 border-dashed border-primary/50">
              <h1 className="font-headline text-3xl font-bold text-center text-primary/80 mb-4">
                받아쓰기 시험
              </h1>
              <div className="flex justify-around text-lg">
                <p>
                  학년: <span className="inline-block w-12 border-b border-gray-400"></span>
                </p>
                <p>
                  반: <span className="inline-block w-12 border-b border-gray-400"></span>
                </p>
                <p>
                  이름: <span className="inline-block w-24 border-b border-gray-400"></span>
                </p>
              </div>
              {totalPages > 1 && (
                <p className="text-center text-xs text-gray-500 mt-2">{`${pageNumber} / ${totalPages}`}</p>
              )}
            </header>
            <ol className="space-y-10 list-inside text-xl">
              {sentences.map((sentence, index) => (
                <li key={index} className="flex">
                  <span className="mr-3 font-bold">{startingIndex + index + 1}.</span>
                  <p className="flex-1">{sentence}</p>
                </li>
              ))}
               {sentences.length === 0 && (
                <div className="text-center text-muted-foreground py-20">
                    <p>왼쪽에서 문장을 추가하면</p>
                    <p>여기에 표시됩니다!</p>
                </div>
               )}
            </ol>

            <CutePencilIcon />
          </div>
        </ScrollArea>
      </Card>
    );
  }
);

WorksheetPreview.displayName = 'WorksheetPreview';
