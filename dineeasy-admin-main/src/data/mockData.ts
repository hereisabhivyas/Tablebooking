export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  image?: string; // Cloudinary image URL
  address: string;
  phone: string;
  email: string;
  isOpen: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  order: number;
  restaurantId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  prepTime: number;
  isAvailable: boolean;
  isBestseller: boolean;
  restaurantId: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'placed' | 'new' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  restaurantId: string;
  rejectionReason?: string;
  notes?: string;
  updatedAt?: Date;
}

export const restaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'The Spice Garden',
    logo: '🍛',
    address: '123 Curry Lane, Mumbai, MH 400001',
    phone: '+91 98765 43210',
    email: 'contact@spicegarden.com',
    isOpen: true,
  },
  {
    id: 'rest-2',
    name: 'Pasta Paradise',
    logo: '🍝',
    address: '456 Italian Street, Delhi, DL 110001',
    phone: '+91 98765 43211',
    email: 'hello@pastaparadise.com',
    isOpen: true,
  },
  {
    id: 'rest-3',
    name: 'Sushi Supreme',
    logo: '🍣',
    address: '789 Tokyo Road, Bangalore, KA 560001',
    phone: '+91 98765 43212',
    email: 'info@sushisupreme.com',
    isOpen: false,
  },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Starters', icon: '🥗', order: 1, restaurantId: 'rest-1' },
  { id: 'cat-2', name: 'Main Course', icon: '🍛', order: 2, restaurantId: 'rest-1' },
  { id: 'cat-3', name: 'Breads', icon: '🫓', order: 3, restaurantId: 'rest-1' },
  { id: 'cat-4', name: 'Rice & Biryani', icon: '🍚', order: 4, restaurantId: 'rest-1' },
  { id: 'cat-5', name: 'Desserts', icon: '🍮', order: 5, restaurantId: 'rest-1' },
  { id: 'cat-6', name: 'Beverages', icon: '🥤', order: 6, restaurantId: 'rest-1' },
];

export const menuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection in tandoor',
    price: 299,
    image: '/placeholder.svg',
    categoryId: 'cat-1',
    isVeg: true,
    spiceLevel: 'medium',
    prepTime: 15,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-2',
    name: 'Chicken Seekh Kebab',
    description: 'Minced chicken with aromatic spices, cooked on skewers',
    price: 349,
    image: '/placeholder.svg',
    categoryId: 'cat-1',
    isVeg: false,
    spiceLevel: 'hot',
    prepTime: 20,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-3',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato-based creamy gravy',
    price: 399,
    image: '/placeholder.svg',
    categoryId: 'cat-2',
    isVeg: false,
    spiceLevel: 'mild',
    prepTime: 25,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-4',
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese cubes in creamy spinach gravy',
    price: 299,
    image: '/placeholder.svg',
    categoryId: 'cat-2',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 20,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-5',
    name: 'Dal Makhani',
    description: 'Black lentils slow-cooked with butter and cream',
    price: 249,
    image: '/placeholder.svg',
    categoryId: 'cat-2',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 15,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-6',
    name: 'Garlic Naan',
    description: 'Soft leavened bread with garlic and butter',
    price: 69,
    image: '/placeholder.svg',
    categoryId: 'cat-3',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 8,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-7',
    name: 'Butter Roti',
    description: 'Whole wheat flatbread with butter',
    price: 35,
    image: '/placeholder.svg',
    categoryId: 'cat-3',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 5,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-8',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken',
    price: 349,
    image: '/placeholder.svg',
    categoryId: 'cat-4',
    isVeg: false,
    spiceLevel: 'medium',
    prepTime: 30,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-9',
    name: 'Veg Pulao',
    description: 'Basmati rice cooked with mixed vegetables and spices',
    price: 199,
    image: '/placeholder.svg',
    categoryId: 'cat-4',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 20,
    isAvailable: false,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-10',
    name: 'Gulab Jamun',
    description: 'Deep-fried milk solids soaked in sugar syrup',
    price: 99,
    image: '/placeholder.svg',
    categoryId: 'cat-5',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 5,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-11',
    name: 'Rasmalai',
    description: 'Soft paneer dumplings in sweetened, flavored milk',
    price: 129,
    image: '/placeholder.svg',
    categoryId: 'cat-5',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 5,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-12',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink with mango pulp',
    price: 89,
    image: '/placeholder.svg',
    categoryId: 'cat-6',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 5,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-13',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea',
    price: 49,
    image: '/placeholder.svg',
    categoryId: 'cat-6',
    isVeg: true,
    spiceLevel: 'mild',
    prepTime: 5,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-14',
    name: 'Lamb Rogan Josh',
    description: 'Kashmiri-style lamb curry with aromatic spices',
    price: 449,
    image: '/placeholder.svg',
    categoryId: 'cat-2',
    isVeg: false,
    spiceLevel: 'hot',
    prepTime: 35,
    isAvailable: true,
    isBestseller: false,
    restaurantId: 'rest-1',
  },
  {
    id: 'item-15',
    name: 'Tandoori Chicken',
    description: 'Whole chicken marinated in yogurt and spices, roasted in tandoor',
    price: 499,
    image: '/placeholder.svg',
    categoryId: 'cat-1',
    isVeg: false,
    spiceLevel: 'medium',
    prepTime: 30,
    isAvailable: true,
    isBestseller: true,
    restaurantId: 'rest-1',
  },
];

const now = new Date();
const getTime = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

export const orders: Order[] = [
  {
    id: 'ord-1',
    tableNumber: 5,
    items: [
      { menuItemId: 'item-3', name: 'Butter Chicken', quantity: 2, price: 399 },
      { menuItemId: 'item-6', name: 'Garlic Naan', quantity: 4, price: 69 },
    ],
    status: 'new',
    totalAmount: 1074,
    createdAt: getTime(0.1),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-2',
    tableNumber: 3,
    items: [
      { menuItemId: 'item-8', name: 'Chicken Biryani', quantity: 1, price: 349 },
      { menuItemId: 'item-12', name: 'Mango Lassi', quantity: 1, price: 89 },
    ],
    status: 'new',
    totalAmount: 438,
    createdAt: getTime(0.2),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-3',
    tableNumber: 8,
    items: [
      { menuItemId: 'item-1', name: 'Paneer Tikka', quantity: 1, price: 299 },
      { menuItemId: 'item-4', name: 'Palak Paneer', quantity: 1, price: 299 },
      { menuItemId: 'item-7', name: 'Butter Roti', quantity: 3, price: 35 },
    ],
    status: 'confirmed',
    totalAmount: 703,
    createdAt: getTime(0.5),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-4',
    tableNumber: 2,
    items: [
      { menuItemId: 'item-15', name: 'Tandoori Chicken', quantity: 1, price: 499 },
      { menuItemId: 'item-5', name: 'Dal Makhani', quantity: 1, price: 249 },
      { menuItemId: 'item-6', name: 'Garlic Naan', quantity: 2, price: 69 },
    ],
    status: 'preparing',
    totalAmount: 886,
    createdAt: getTime(0.8),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-5',
    tableNumber: 10,
    items: [
      { menuItemId: 'item-2', name: 'Chicken Seekh Kebab', quantity: 2, price: 349 },
      { menuItemId: 'item-14', name: 'Lamb Rogan Josh', quantity: 1, price: 449 },
      { menuItemId: 'item-6', name: 'Garlic Naan', quantity: 3, price: 69 },
    ],
    status: 'preparing',
    totalAmount: 1354,
    createdAt: getTime(1),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-6',
    tableNumber: 7,
    items: [
      { menuItemId: 'item-11', name: 'Rasmalai', quantity: 2, price: 129 },
      { menuItemId: 'item-13', name: 'Masala Chai', quantity: 2, price: 49 },
    ],
    status: 'ready',
    totalAmount: 356,
    createdAt: getTime(1.2),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-7',
    tableNumber: 4,
    items: [
      { menuItemId: 'item-3', name: 'Butter Chicken', quantity: 1, price: 399 },
      { menuItemId: 'item-8', name: 'Chicken Biryani', quantity: 1, price: 349 },
      { menuItemId: 'item-10', name: 'Gulab Jamun', quantity: 2, price: 99 },
    ],
    status: 'ready',
    totalAmount: 946,
    createdAt: getTime(1.5),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-8',
    tableNumber: 1,
    items: [
      { menuItemId: 'item-1', name: 'Paneer Tikka', quantity: 2, price: 299 },
      { menuItemId: 'item-5', name: 'Dal Makhani', quantity: 2, price: 249 },
      { menuItemId: 'item-7', name: 'Butter Roti', quantity: 6, price: 35 },
      { menuItemId: 'item-12', name: 'Mango Lassi', quantity: 2, price: 89 },
    ],
    status: 'served',
    totalAmount: 1484,
    createdAt: getTime(2),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-9',
    tableNumber: 6,
    items: [
      { menuItemId: 'item-15', name: 'Tandoori Chicken', quantity: 2, price: 499 },
      { menuItemId: 'item-3', name: 'Butter Chicken', quantity: 1, price: 399 },
      { menuItemId: 'item-6', name: 'Garlic Naan', quantity: 5, price: 69 },
    ],
    status: 'served',
    totalAmount: 1742,
    createdAt: getTime(2.5),
    restaurantId: 'rest-1',
  },
  {
    id: 'ord-10',
    tableNumber: 9,
    items: [
      { menuItemId: 'item-4', name: 'Palak Paneer', quantity: 1, price: 299 },
      { menuItemId: 'item-5', name: 'Dal Makhani', quantity: 1, price: 249 },
      { menuItemId: 'item-7', name: 'Butter Roti', quantity: 4, price: 35 },
      { menuItemId: 'item-11', name: 'Rasmalai', quantity: 2, price: 129 },
    ],
    status: 'served',
    totalAmount: 946,
    createdAt: getTime(3),
    restaurantId: 'rest-1',
  },
];

export const analyticsData = {
  dailyRevenue: [
    { date: 'Mon', revenue: 12500 },
    { date: 'Tue', revenue: 15800 },
    { date: 'Wed', revenue: 14200 },
    { date: 'Thu', revenue: 18900 },
    { date: 'Fri', revenue: 22500 },
    { date: 'Sat', revenue: 28000 },
    { date: 'Sun', revenue: 25500 },
  ],
  weeklyRevenue: [
    { week: 'Week 1', revenue: 98500 },
    { week: 'Week 2', revenue: 112000 },
    { week: 'Week 3', revenue: 105800 },
    { week: 'Week 4', revenue: 125000 },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 385000 },
    { month: 'Feb', revenue: 420000 },
    { month: 'Mar', revenue: 395000 },
    { month: 'Apr', revenue: 445000 },
    { month: 'May', revenue: 480000 },
    { month: 'Jun', revenue: 520000 },
  ],
  popularItems: [
    { name: 'Butter Chicken', orders: 245, revenue: 97755 },
    { name: 'Chicken Biryani', orders: 198, revenue: 69102 },
    { name: 'Paneer Tikka', orders: 175, revenue: 52325 },
    { name: 'Tandoori Chicken', orders: 156, revenue: 77844 },
    { name: 'Dal Makhani', orders: 142, revenue: 35358 },
  ],
  ordersByHour: [
    { hour: '11AM', orders: 8 },
    { hour: '12PM', orders: 25 },
    { hour: '1PM', orders: 42 },
    { hour: '2PM', orders: 35 },
    { hour: '3PM', orders: 15 },
    { hour: '4PM', orders: 10 },
    { hour: '5PM', orders: 12 },
    { hour: '6PM', orders: 18 },
    { hour: '7PM', orders: 45 },
    { hour: '8PM', orders: 58 },
    { hour: '9PM', orders: 52 },
    { hour: '10PM', orders: 35 },
  ],
  tableUtilization: [
    { table: 'T1', usage: 85 },
    { table: 'T2', usage: 72 },
    { table: 'T3', usage: 90 },
    { table: 'T4', usage: 65 },
    { table: 'T5', usage: 88 },
    { table: 'T6', usage: 78 },
    { table: 'T7', usage: 55 },
    { table: 'T8', usage: 82 },
    { table: 'T9', usage: 70 },
    { table: 'T10', usage: 95 },
  ],
};
