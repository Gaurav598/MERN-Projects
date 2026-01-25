'use server';

/**
 * @fileOverview A Genkit flow for suggesting task categories based on a task description.
 *
 * - suggestTaskCategories - A function that takes a task description and returns suggested categories.
 * - SuggestTaskCategoriesInput - The input type for the suggestTaskCategories function.
 * - SuggestTaskCategoriesOutput - The return type for the suggestTaskCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskCategoriesInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which to suggest categories.'),
});
export type SuggestTaskCategoriesInput = z.infer<typeof SuggestTaskCategoriesInputSchema>;

const SuggestTaskCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested categories for the task.'),
});
export type SuggestTaskCategoriesOutput = z.infer<typeof SuggestTaskCategoriesOutputSchema>;

export async function suggestTaskCategories(
  input: SuggestTaskCategoriesInput
): Promise<SuggestTaskCategoriesOutput> {
  return suggestTaskCategoriesFlow(input);
}

const suggestTaskCategoriesPrompt = ai.definePrompt({
  name: 'suggestTaskCategoriesPrompt',
  input: {schema: SuggestTaskCategoriesInputSchema},
  output: {schema: SuggestTaskCategoriesOutputSchema},
  prompt: `Suggest relevant categories or tags for the following task description.  Return a JSON array of strings. 

Description: {{{taskDescription}}}`,
});

const suggestTaskCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestTaskCategoriesFlow',
    inputSchema: SuggestTaskCategoriesInputSchema,
    outputSchema: SuggestTaskCategoriesOutputSchema,
  },
  async input => {
    const {output} = await suggestTaskCategoriesPrompt(input);
    return output!;
  }
);
