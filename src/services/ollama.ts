import axios from 'axios';

const OLLAMA_BASE_URL = 'http://localhost:11434/api';

export class OllamaService {
  private baseUrl: string;

  constructor(baseUrl: string = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl.replace('/api', '')}/api/tags`);
      return response.status === 200;
    } catch (error) {
      console.error('Ollama connection check failed:', error);
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tags`);
      return response.data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  async generateDocumentation(
    datasetInfo: string,
    model: string = 'llama3.2'
  ): Promise<string> {
    try {
      const prompt = `You are a technical documentation generator. Analyze the following dataset information and generate comprehensive documentation in Markdown format.

Dataset Information:
${datasetInfo}

Please generate documentation that includes:
1. A clear title and description
2. Dataset schema with field names, types, and descriptions
3. Example records
4. Usage instructions
5. Important notes and considerations

Format the output as Markdown with proper headers, tables, and code blocks.`;

      const response = await axios.post(`${this.baseUrl}/generate`, {
        model,
        prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      console.error('Failed to generate documentation:', error);
      throw new Error('Failed to generate documentation using Ollama');
    }
  }

  async chat(messages: Array<{ role: string; content: string }>, model: string = 'llama3.2'): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/chat`, {
        model,
        messages,
        stream: false,
      });

      return response.data.message.content;
    } catch (error) {
      console.error('Chat failed:', error);
      throw new Error('Chat request failed');
    }
  }
}

export const ollamaService = new OllamaService();
