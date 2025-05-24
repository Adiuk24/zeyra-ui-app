import { ApiResponse } from '../types';

const API_BASE_URL = 'https://zeyra-cloud-mother.onrender.com';

export const sendMessage = async (message: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return { message: data.reply }; // 👈 Fixes chat response
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      message: "I'm sorry, I couldn't process your message. Please try again later.",
    };
  }
};
