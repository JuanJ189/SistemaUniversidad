import { ChatbotResponse, ProductRecommendation, ChatbotContext } from '../types/chatbot';
import { httpClient } from './httpClient';

const API_URL = '/api/Chatbot';

export const chatbotService = {
  async sendMessage(message: string, context?: string): Promise<ChatbotResponse> {
    try {
      const response = await httpClient.post(`${API_URL}/chat`, {
        message,
        context,
        sessionId: chatbotService.getSessionId(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error enviando mensaje al chatbot:', error);
      throw new Error(error.response?.data?.message || 'Error al comunicarse con el chatbot');
    }
  },

  async getRecommendations(query: string): Promise<ProductRecommendation[]> {
    try {
      const response = await httpClient.get(`${API_URL}/recommendations?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo recomendaciones:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener recomendaciones');
    }
  },

  async getContext(): Promise<ChatbotContext> {
    try {
      const response = await httpClient.get(`${API_URL}/context`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo contexto del chatbot:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener contexto');
    }
  },

  async generateDescription(productName: string, category: string): Promise<string> {
    try {
      const response = await httpClient.post(`${API_URL}/generate-description`, {
        productName,
        category,
      });
      return response.data.description;
    } catch (error: any) {
      console.error('Error generando descripción:', error);
      throw new Error(error.response?.data?.message || 'Error al generar descripción');
    }
  },

  async checkHealth(): Promise<{ status: string; service: string; features: string[] }> {
    try {
      const response = await httpClient.get(`${API_URL}/health`);
      return response.data;
    } catch (error: any) {
      console.error('Error verificando estado del chatbot:', error);
      throw new Error('Chatbot no disponible');
    }
  },

  getSessionId(): string {
    let sessionId = localStorage.getItem('chatbot-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot-session-id', sessionId);
    }
    return sessionId;
  },

  clearSession(): void {
    localStorage.removeItem('chatbot-session-id');
  },
};
