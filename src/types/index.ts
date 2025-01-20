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
  createdAt: Date;
  updatedAt: Date;
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
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
