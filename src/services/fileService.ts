import { API_BASE_URL } from '../config/api';
import { httpClient } from './httpClient';

export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  fileName: string;
  message: string;
}

export const fileService = {
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await httpClient.post<UploadImageResponse>(
        '/api/file/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error al subir la imagen');
      }
      throw new Error('Error de conexión al subir la imagen');
    }
  },

  async deleteImage(fileName: string): Promise<void> {
    try {
      await httpClient.delete(`/api/file/delete-image/${fileName}`);
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error al eliminar la imagen');
      }
      throw new Error('Error de conexión al eliminar la imagen');
    }
  },

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  },
};
