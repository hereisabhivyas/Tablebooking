const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const fullUrl = `${API_URL}${path}`;
  const method = init?.method || 'GET';
  console.log(`[API] ${method} ${fullUrl}`);
  if (init?.body) {
    console.log('[API Body]', JSON.stringify(JSON.parse(init.body as string), null, 2));
  }
  
  const res = await fetch(fullUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[API Error] ${res.status} ${res.statusText}`);
    console.error('[API Error Response]', errorBody);
    try {
      const json = JSON.parse(errorBody);
      console.error('[API Error Details]', JSON.stringify(json, null, 2));
    } catch (e) {
      // Not JSON
    }
    throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errorBody}`);
  }
  return res.json();
}

export const api = {
  restaurants: {
    list: () => request<unknown>("/restaurants"),
    get: (id: string) => request<unknown>(`/restaurants/${id}`),
  },
  tables: {
    list: () => request<unknown>("/tables"),
    listByRestaurant: (restaurantId: string) =>
      request<unknown>(`/tables?restaurantId=${restaurantId}`),
    get: (id: string) => request<unknown>(`/tables/${id}`),
  },
  categories: {
    listByRestaurant: (restaurantId: string) =>
      request<unknown>(`/categories?restaurantId=${restaurantId}`),
  },
  menuItems: {
    listByRestaurant: (restaurantId: string) =>
      request<unknown>(`/menu-items?restaurantId=${restaurantId}`),
  },
  orders: {
    list: (params?: { restaurantId?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.restaurantId) query.append('restaurantId', params.restaurantId);
      if (params?.status) query.append('status', params.status);
      const queryString = query.toString();
      return request<unknown>(`/orders${queryString ? '?' + queryString : ''}`);
    },
    get: (id: string) => request<unknown>(`/orders/${id}`),
    create: (order: unknown) => request<unknown>("/orders", { method: "POST", body: JSON.stringify(order) }),
    update: (id: string, order: unknown) => request<unknown>(`/orders/${id}`, { method: "PUT", body: JSON.stringify(order) }),
    delete: (id: string) => request<unknown>(`/orders/${id}`, { method: "DELETE" }),
  },
};

export type ApiRestaurant = {
  id: string;
  name: string;
  description?: string;
  cuisine: string[];
  rating?: number;
  image?: string;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  address?: string;
};

export type ApiTable = {
  id: string;
  number: number;
  capacity: number;
  isAvailable: boolean;
  restaurantId: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  icon?: string;
  restaurantId: string;
};

export type ApiMenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  restaurantId: string;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller?: boolean;
  spiceLevel?: "mild" | "medium" | "hot";
  preparationTime?: number;
};

export type ApiOrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
};

export type ApiOrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type ApiOrder = {
  id: string;
  restaurantId: string;
  tableNumber: number;
  items: ApiOrderItem[];
  status: ApiOrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  rejectionReason?: string;
};
