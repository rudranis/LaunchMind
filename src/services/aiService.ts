
import { connectToDatabase } from '@/lib/mongodb';

// AI Validation Service
export async function validateStartupIdea(idea: {
  title: string;
  description: string;
  industry: string[];
}) {
  try {
    // This would integrate with Gemini AI in a real implementation
    // For now we'll return mock data
    const mockValidation = {
      score: Math.floor(Math.random() * 30) + 70,
      strengths: [
        'Innovative solution to a real problem',
        'Large addressable market',
        'Clear value proposition'
      ],
      weaknesses: [
        'Competitive market landscape',
        'High initial development costs',
        'Potential regulatory challenges'
      ],
      marketPotential: Math.floor(Math.random() * 20) + 80,
      innovation: Math.floor(Math.random() * 30) + 70,
      feasibility: Math.floor(Math.random() * 25) + 65,
      financialViability: Math.floor(Math.random() * 30) + 60,
      teamCompetence: Math.floor(Math.random() * 20) + 75,
      recommendation: "Your idea shows strong potential in an emerging market.",
      timestamp: new Date()
    };
    
    return { success: true, data: mockValidation };
  } catch (error) {
    console.error('Failed to validate startup idea:', error);
    return { success: false, error: 'Failed to validate startup idea' };
  }
}

// Save chat conversation history for a user (session-based or user-based)
export async function saveChatHistory(session: string, messages: any[]) {
  try {
    const { db } = await connectToDatabase();
    
    // Check if chat history exists for this session
    const existingChat = await db.collection('chatHistory').findOne({ sessionId: session });
    
    if (existingChat) {
      // Update existing chat history
      await db.collection('chatHistory').updateOne(
        { sessionId: session },
        { 
          $set: { 
            messages: messages,
            updatedAt: new Date()
          } 
        }
      );
    } else {
      // Create new chat history
      await db.collection('chatHistory').insertOne({
        sessionId: session,
        messages: messages,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save chat history:', error);
    return { success: false, error: 'Failed to save chat history' };
  }
}

// Get chat history for a user (session-based or user-based)
export async function getChatHistory(session: string) {
  try {
    const { db } = await connectToDatabase();
    
    const chatHistory = await db.collection('chatHistory').findOne({ sessionId: session });
    
    return { 
      success: true, 
      data: chatHistory ? chatHistory.messages : [] 
    };
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return { success: false, error: 'Failed to get chat history' };
  }
}
