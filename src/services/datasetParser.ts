import Papa from 'papaparse';

export class DatasetParser {
  static parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  static parseJSON(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          const arrayData = Array.isArray(data) ? data : [data];
          resolve(arrayData);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static async parseFile(file: File): Promise<any[]> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'csv':
        return this.parseCSV(file);
      case 'json':
        return this.parseJSON(file);
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }

  static analyzeDataset(data: any[]): string {
    if (!data || data.length === 0) {
      return 'No data available';
    }

    const fields = Object.keys(data[0]);
    const sampleSize = Math.min(5, data.length);
    const sampleRecords = data.slice(0, sampleSize);

    let analysis = `Dataset Analysis Report
====================

Total Records: ${data.length}
Total Fields: ${fields.length}

Field Schema:
${fields.map(field => {
  const sampleValue = data[0][field];
  const type = typeof sampleValue;
  const uniqueValues = new Set(data.map(r => r[field])).size;
  return `- ${field} (${type}) - ${uniqueValues} unique values`;
}).join('\n')}

Sample Records:
${sampleRecords.map((record, i) => `
Record ${i + 1}:
${fields.map(field => `  ${field}: ${JSON.stringify(record[field])}`).join('\n')}
`).join('\n')}`;

    return analysis;
  }
}
