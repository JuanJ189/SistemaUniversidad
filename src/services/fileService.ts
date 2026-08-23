import axios from 'axios';

// 1. Limpiamos la URL quitando la barra final si la tiene
const RAW_URL = import.meta.env.VITE_API_URL || 'https://practica-univerisidad-e2enhzfhcvaefaf9.centralus-01.azurewebsites.net';
const BASE_URL = RAW_URL.replace(/\/+$/, ''); // Elimina barras inclinadas al final
const API_BASE_URL = `${BASE_URL}/api`;

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
      const response = await axios.post<UploadImageResponse>(
        `${API_BASE_URL}/file/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
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
      await axios.delete(`${API_BASE_URL}/file/delete-image/${fileName}`, {
        withCredentials: true,
      });
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
    return `${BASE_URL}/${cleanPath}`;
  }
};