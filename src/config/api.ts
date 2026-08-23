const DEFAULT_API_URL =
  'https://practica-univerisidad-e2enhzfhcvaefaf9.centralus-01.azurewebsites.net';

const envUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (envUrl && envUrl.trim() !== ''
  ? envUrl
  : DEFAULT_API_URL
).replace(/\/+$/, '');

export const apiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
