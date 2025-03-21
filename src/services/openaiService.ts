
import { useToast } from '@/hooks/use-toast';

// OpenAI API URL
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Types for OpenAI responses
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  created: number;
  model: string;
  choices: {
    message: OpenAIMessage;
    finish_reason: string;
    index: number;
  }[];
}

// Function to call OpenAI API
export const generateAIResponse = async (
  messages: OpenAIMessage[],
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<{ success: boolean; data?: string; error?: string }> => {
  try {
    // Validate API key
    if (!apiKey) {
      return { success: false, error: 'API key is required' };
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.error?.message || `Error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    return { success: true, data: aiResponse };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Function to generate text-to-speech using OpenAI Whisper API
export const generateTextToSpeech = async (
  text: string,
  apiKey: string,
  voice: string = 'alloy'
): Promise<{ success: boolean; audioUrl?: string; error?: string }> => {
  try {
    if (!apiKey) {
      return { success: false, error: 'API key is required' };
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.error?.message || `Error: ${response.status} ${response.statusText}` 
      };
    }

    // Convert the response to a blob and create a URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return { success: true, audioUrl };
  } catch (error) {
    console.error('Error generating text-to-speech:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Add a typing effect helper
export const createTypingEffect = (
  text: string,
  onUpdate: (text: string) => void,
  speed: number = 15
): { start: () => void; stop: () => void } => {
  let index = 0;
  let intervalId: number | null = null;

  const start = () => {
    if (intervalId) return;

    intervalId = window.setInterval(() => {
      if (index < text.length) {
        onUpdate(text.substring(0, index + 1));
        index++;
      } else {
        stop();
      }
    }, speed);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      // Ensure the full text is displayed
      onUpdate(text);
    }
  };

  return { start, stop };
};
