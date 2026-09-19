/**
 * Types and interfaces for the React Starter boilerplate.
 */

export interface StackTechnology {
  name: string;
  version: string;
  category: 'core' | 'style' | 'tooling';
  status: 'active' | 'ready';
}

export interface StarterTip {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
}
