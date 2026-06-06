export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'slowbar' | 'tea' | 'plates' | 'pastries';
  tags: string[];
  imageUrl: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: number;
  notes?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: 'drinks' | 'plates' | 'ambiance' | 'craft';
}

export interface Table {
  id: number;
  capacity: number;
  status: 'available' | 'reserved' | 'selected';
  x: number; // percentage coordinate X
  y: number; // percentage coordinate Y
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}
