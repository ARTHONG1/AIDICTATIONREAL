// src/ai/flows/generate-dictation-sentences.ts
'use server';

/**
 * @fileOverview AI-powered dictation sentence generator for teachers.
 *
 * - generateDictationSentences - A function that generates dictation sentences based on the given criteria.
 * - GenerateDictationSentencesInput - The input type for the generateDictationSentences function.
 * - GenerateDictationSentencesOutput - The return type for the generateDictationSentences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDictationSentencesInputSchema = z.object({
  gradeLevel: z
    .number()
    .min(1)
    .max(6)
    .describe('The grade level of the dictation sentences (1-6).'),
  dictationGoal: z
    .string()
    .describe('The dictation goal (e.g., 받침 있는 글자, 이중 모음).'),
  proficiencyLevel: z
    .string()
    .describe('The proficiency level (쉬움, 보통, 어려움).'),
  numberOfSentences: z
    .number()
    .min(1)
    .max(20)
    .describe('The number of dictation sentences to generate.'),
});
export type GenerateDictationSentencesInput = z.infer<
  typeof GenerateDictationSentencesInputSchema
>;

const GenerateDictationSentencesOutputSchema = z.object({
  sentences: z.array(z.string()).describe('The generated dictation sentences.'),
});
export type GenerateDictationSentencesOutput = z.infer<
  typeof GenerateDictationSentencesOutputSchema
>;

export async function generateDictationSentences(
  input: GenerateDictationSentencesInput
): Promise<GenerateDictationSentencesOutput> {
  return generateDictationSentencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDictationSentencesPrompt',
  input: {schema: GenerateDictationSentencesInputSchema},
  output: {schema: GenerateDictationSentencesOutputSchema},
  prompt: `You are an AI assistant helping elementary school teachers create dictation exercises.

  Generate {{numberOfSentences}} dictation sentences for grade level {{gradeLevel}} students.
  The dictation goal is: {{dictationGoal}}.
  The proficiency level is: {{proficiencyLevel}}.

  Sentences must be grammatically correct and make sense.
  Each sentence must be 11 characters or less.
  Sentences should be interesting and engaging for young students.
  Sentences should not include any harmful or inappropriate content.

  Return a JSON array of strings representing the sentences. For example:
  [\"Sentence 1.\", \"Sentence 2.\", \"Sentence 3.\"]
  `,
});

const generateDictationSentencesFlow = ai.defineFlow(
  {
    name: 'generateDictationSentencesFlow',
    inputSchema: GenerateDictationSentencesInputSchema,
    outputSchema: GenerateDictationSentencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
