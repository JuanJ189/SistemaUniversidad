import { Product, ProductList, ProductFilter, PaginatedResponse, CreateProduct, UpdateProduct } from '../types/product';
import { httpClient } from './httpClient';

const API_URL = '/api/Product';

export const productService = {
  async getProducts(filter: ProductFilter = {}): Promise<PaginatedResponse<ProductList>> {
    const params = new URLSearchParams();

    if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
    if (filter.categoryId) params.append('categoryId', filter.categoryId.toString());
    if (filter.brand) params.append('brand', filter.brand);
    if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.inStockOnly) params.append('inStockOnly', filter.inStockOnly.toString());
    if (filter.featuredOnly) params.append('featuredOnly', filter.featuredOnly.toString());
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await httpClient.get(`${API_URL}?${params.toString()}`);
    return response.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await httpClient.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createProduct(product: CreateProduct): Promise<Product> {
    const response = await httpClient.post(API_URL, product);
    return response.data;
  },

  async updateProduct(id: number, product: UpdateProduct): Promise<Product> {
    const response = await httpClient.put(`${API_URL}/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await httpClient.delete(`${API_URL}/${id}`);
  },

  async getFeaturedProducts(): Promise<ProductList[]> {
    const response = await httpClient.get(`${API_URL}/featured`);
    return response.data;
  },

  async clearDemoProducts(): Promise<{ message: string; deletedCount: number }> {
    const response = await httpClient.delete(`${API_URL}/demo/clear`);
    return response.data;
  },
};
