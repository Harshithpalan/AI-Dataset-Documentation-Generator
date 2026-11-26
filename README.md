# AI Dataset Documentation Generator

A web application that automatically generates comprehensive documentation for datasets using local AI models (Ollama). Built with React, Vite, and TypeScript.

## Features

- **OAuth Authentication**: Sign in with Google for secure access
- **Dataset Upload**: Support for CSV and JSON file formats
- **AI-Powered Documentation**: Uses local LLM models via Ollama to generate comprehensive documentation
- **Real-time Preview**: View generated documentation with Markdown rendering
- **Export Functionality**: Download documentation as Markdown files
- **Modern UI**: Clean, responsive interface with dark mode support

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Ollama** installed and running locally - [Download here](https://ollama.ai/)
3. A Google Cloud project with OAuth credentials (for Google Sign-In)

## Setup Instructions

### 1. Install Ollama and Download a Model

```bash
# Install Ollama (Windows)
# Download from https://ollama.ai/download

# Pull a model (e.g., Llama 3.2)
ollama pull llama3.2

# Start Ollama server (it usually starts automatically)
ollama serve
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Google OAuth

To enable Google Sign-In, you need to set up OAuth credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the consent screen if prompted
6. Select **Web application** as the application type
7. Add authorized JavaScript origins and redirect URIs:
   - Origins: `http://localhost:5173`
   - Redirect URIs: `http://localhost:5173`
8. Copy the **Client ID**

8. Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Update the Google Login component in `src/components/Auth.tsx` to use the environment variable:

```tsx
<GoogleLogin
  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  onSuccess={handleLoginSuccess}
  onError={handleLoginError}
  // ...
/>
```

**Note**: For development without OAuth, you can temporarily comment out the authentication requirement in `src/App.tsx`.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Upload Dataset**: Drag and drop a CSV or JSON file, or click to browse
3. **Check Ollama Connection**: Click "Check Ollama Connection" to verify Ollama is running
4. **Select Model**: Choose an available Ollama model from the dropdown
5. **Generate Documentation**: Click "Generate Documentation" to create docs
6. **View & Export**: Review the generated documentation and download as Markdown

## Project Structure

```
src/
├── components/
│   ├── Auth.tsx              # Google OAuth authentication
│   ├── FileUpload.tsx        # Dataset file upload component
│   └── DocumentationGenerator.tsx  # Documentation generation UI
├── services/
│   ├── ollama.ts             # Ollama API integration
│   └── datasetParser.ts      # CSV/JSON parsing utilities
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main application component
├── App.css                   # Application styles
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## Customization

### Adding More File Formats

Extend the `DatasetParser` class in `src/services/datasetParser.ts` to support additional formats like Excel, XML, etc.

### Customizing Documentation Templates

Modify the prompt in `src/services/ollama.ts` to change how documentation is generated. You can customize the structure, tone, and content of the generated documentation.

### Changing UI Theme

Update CSS variables in `src/App.css` to customize colors, spacing, and other visual elements.

## Troubleshooting

### Ollama Connection Issues

- Ensure Ollama is running: `ollama serve`
- Check if the port 11434 is available
- Verify you have downloaded at least one model: `ollama list`

### Google OAuth Issues

- Verify the Client ID is correct in your `.env` file
- Ensure the authorized JavaScript origins and redirect URIs match your local development URL
- Check that the OAuth consent screen is configured

### File Upload Issues

- Ensure the file is a valid CSV or JSON
- Check file size (very large files may take time to process)
- Verify the file encoding is UTF-8

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
