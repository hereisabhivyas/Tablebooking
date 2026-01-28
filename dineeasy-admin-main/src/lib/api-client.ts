// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || response.statusText);
  }

  return response.json() as Promise<T>;
}

// Restaurants API
export const restaurantsAPI = {
  list: () => apiCall('/restaurants'),
  get: (id: string) => apiCall(`/restaurants/${id}`),
  create: (data: any) => apiCall('/restaurants', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/restaurants/${id}`, {
    method: 'DELETE',
  }),
};

// Categories API
export const categoriesAPI = {
  list: (restaurantId?: string) => {
    const query = restaurantId ? `?restaurantId=${restaurantId}` : '';
    return apiCall(`/categories${query}`);
  },
  get: (id: string) => apiCall(`/categories/${id}`),
  create: (data: any) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Menu Items API
export const menuItemsAPI = {
  list: (filters?: { restaurantId?: string; categoryId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.restaurantId) params.append('restaurantId', filters.restaurantId);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/menu-items${query}`);
  },
  get: (id: string) => apiCall(`/menu-items/${id}`),
  create: (data: any) => apiCall('/menu-items', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/menu-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/menu-items/${id}`, {
    method: 'DELETE',
  }),
};

// Auth API
export const authAPI = {
  // Backend returns a restaurant object (no token), so types reflect that
  register: (data: { name: string; contactEmail: string; password: string; contactPhone?: string; address?: string; image?: string }) =>
    apiCall<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { contactEmail: string; password: string }) =>
    apiCall<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Higher-level auth functions
export async function loginRestaurant(email: string, password: string) {
  const restaurant = await authAPI.login({ contactEmail: email, password });
  return {
    restaurant,
    // Backend has no token; use restaurant id as a pseudo token for client-side gating
    token: restaurant?.token || restaurant?._id || restaurant?.id || '',
  };
}

export async function registerRestaurant(data: {
  name: string;
  email: string;
  password: string;
  cuisineType: string;
  isOpen: boolean;
  address: string;
  phone: string;
  rating: number;
}) {
  const restaurant = await authAPI.register({
    name: data.name,
    contactEmail: data.email,
    password: data.password,
    address: data.address,
    contactPhone: data.phone,
  });
  return {
    restaurant,
    token: restaurant?.token || restaurant?._id || restaurant?.id || '',
  };
}

// Tables API
export const tablesAPI = {
  list: (restaurantId?: string) => {
    const query = restaurantId ? `?restaurantId=${restaurantId}` : '';
    return apiCall(`/tables${query}`);
  },
  get: (id: string) => apiCall(`/tables/${id}`),
  create: (data: any) => apiCall('/tables', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/tables/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  list: (filters?: { restaurantId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.restaurantId) params.append('restaurantId', filters.restaurantId);
    if (filters?.status) params.append('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/orders${query}`);
  },
  get: (id: string) => apiCall(`/orders/${id}`),
  create: (data: any) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthCheck = () => apiCall('/health');
