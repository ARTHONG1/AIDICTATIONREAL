'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { GenerateDictationSentencesInput } from '@/ai/flows/generate-dictation-sentences';

const formSchema = z.object({
  gradeLevel: z.string().nonempty({ message: '학년을 선택해주세요.' }),
  dictationGoal: z.string().nonempty({ message: '받아쓰기 목표를 입력해주세요.' }),
  proficiencyLevel: z.enum(['쉬움', '보통', '어려움'], {
    required_error: '성취 수준을 선택해주세요.',
  }),
  numberOfSentences: z.string().refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0 && parseInt(val, 10) <= 20, {
    message: '1에서 20 사이의 숫자를 입력해주세요.',
  }),
});

type DictationFormProps = {
  onSubmit: (data: Omit<GenerateDictationSentencesInput, 'numberOfSentences'> & { numberOfSentences: string }) => Promise<void>;
  isLoading: boolean;
};

export function DictationForm({ onSubmit, isLoading }: DictationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevel: '1',
      dictationGoal: '받침 있는 글자',
      proficiencyLevel: '보통',
      numberOfSentences: '5',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-headline text-xl font-semibold text-gray-700">AI 문장 자동 생성</h3>
        <FormField
          control={form.control}
          name="gradeLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>학년 선택</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="학년을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(grade => (
                    <SelectItem key={grade} value={String(grade)}>
                      {grade}학년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dictationGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>국어 받아쓰기 목표</FormLabel>
              <FormControl>
                <Input placeholder="예: 이중 모음, 띄어쓰기" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proficiencyLevel"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>성취 수준</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="쉬움" />
                    </FormControl>
                    <FormLabel className="font-normal">쉬움</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="보통" />
                    </FormControl>
                    <FormLabel className="font-normal">보통</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="어려움" />
                    </FormControl>
                    <FormLabel className="font-normal">어려움</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfSentences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>자동 생성 개수</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-md py-6 transition-transform hover:scale-105">
          {isLoading ? (
            '생성 중...'
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              AI 문장 자동 생성
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
