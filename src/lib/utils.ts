// Helper function to strip HTML tags from a string
import { convert } from 'html-to-text';
export const stripHtmlTags = (html: string) => {
    return convert(html, {
        wordwrap: false, 
      });
  };

   // Function to generate all combinations of arrays with keys for variants
  export const getCombinationsWithKeys = (
    variationMap: Record<string, string[]>
  ): { [key: string]: string }[] => {
    const keys = Object.keys(variationMap);
    const combinations: { [key: string]: string }[] = [];

    const helper = (current: { [key: string]: string }, index: number) => {
      if (index === keys.length) {
        combinations.push({ ...current });
        return;
      }

      for (const value of variationMap[keys[index]]) {
        current[keys[index]] = value; // Add key-value pair to current combination
        helper(current, index + 1);
        delete current[keys[index]]; // Remove key after processing
      }
    };

    helper({}, 0);
    return combinations;
  };