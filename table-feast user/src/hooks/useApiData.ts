import { useQuery } from "@tanstack/react-query";
import { api, ApiRestaurant, ApiTable, ApiCategory, ApiMenuItem } from "@/lib/api";

export function useRestaurants() {
  return useQuery<ApiRestaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => (await api.restaurants.list()) as ApiRestaurant[],
  });
}

export function useRestaurant(id?: string) {
  return useQuery<ApiRestaurant | undefined>({
    queryKey: ["restaurant", id],
    enabled: Boolean(id),
    queryFn: async () => (await api.restaurants.get(id!)) as ApiRestaurant,
  });
}

export function useTables(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  return useQuery<ApiTable[]>({
    queryKey: ["tables"],
    enabled,
    queryFn: async () => (await api.tables.list()) as ApiTable[],
  });
}

export function useTablesByRestaurant(restaurantId?: string) {
  return useQuery<ApiTable[]>({
    queryKey: ["tables", restaurantId],
    enabled: Boolean(restaurantId),
    queryFn: async () => (await api.tables.listByRestaurant(restaurantId!)) as ApiTable[],
  });
}

export function useCategories(restaurantId?: string) {
  return useQuery<ApiCategory[]>({
    queryKey: ["categories", restaurantId],
    enabled: Boolean(restaurantId),
    queryFn: async () => (await api.categories.listByRestaurant(restaurantId!)) as ApiCategory[],
  });
}

export function useMenuItems(restaurantId?: string) {
  return useQuery<ApiMenuItem[]>({
    queryKey: ["menu-items", restaurantId],
    enabled: Boolean(restaurantId),
    queryFn: async () => (await api.menuItems.listByRestaurant(restaurantId!)) as ApiMenuItem[],
  });
}
