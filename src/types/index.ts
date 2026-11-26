export interface DatasetFile {
  name: string;
  size: number;
  type: string;
  content: string;
  data?: any[];
}

export interface Documentation {
  title: string;
  description: string;
  schema: any[];
  examples: any[];
  usage: string;
  notes: string;
  generatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface GenerationStatus {
  status: 'idle' | 'analyzing' | 'generating' | 'completed' | 'error';
  progress: number;
  message: string;
}
