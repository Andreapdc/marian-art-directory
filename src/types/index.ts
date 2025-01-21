export interface Location {
  id: string;
  name: string;
  description: string;
  photos: string[];
  tags: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  metadata: {
    source: string;
    id: number | string;
    url?: string;
    department?: string;
    date?: string;
    culture?: string;
    medium?: string;
    type?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'curator';
  preferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIContent {
  id: string;
  content: string;
  sourceType: 'location' | 'event' | 'user';
  sourceId: string;
  contentType: 'description' | 'summary' | 'recommendation';
  metadata: {
    [key: string]: string | number | boolean | null;
  };
  createdAt: Date;
  updatedAt: Date;
}
