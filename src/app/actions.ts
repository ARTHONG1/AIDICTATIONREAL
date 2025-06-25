'use server';

import {
  generateDictationSentences,
  GenerateDictationSentencesInput,
  GenerateDictationSentencesOutput,
} from '@/ai/flows/generate-dictation-sentences';
import { z } from 'zod';

const ActionInputSchema = z.object({
  gradeLevel: z.string().transform(Number),
  dictationGoal: z.string(),
  proficiencyLevel: z.string(),
  numberOfSentences: z.number().min(1).max(20),
});

export async function generateSentencesAction(
  input: GenerateDictationSentencesInput
): Promise<Partial<GenerateDictationSentencesOutput> & { error?: string }> {
  const parsed = ActionInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: '잘못된 입력입니다.' };
  }

  try {
    const result = await generateDictationSentences(parsed.data);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'AI 문장 생성에 실패했습니다. 다시 시도해 주세요.' };
  }
}
