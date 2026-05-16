import type { firestore } from 'firebase-admin';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  pocName?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Hospital {
  id?: string;
  name: string;
  contactInfo: ContactInfo;
  location: Location;
  totalBeds: number;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}
