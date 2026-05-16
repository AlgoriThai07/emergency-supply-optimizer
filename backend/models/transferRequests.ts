import type { firestore } from "firebase-admin";

export type TransferRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export interface TransferRequest {
  id?: string;

  itemKey: string;
  itemName: string;
  quantity: number;
  unit: string;

  fromHospitalId: string;
  fromHospitalName: string;

  toHospitalId: string;
  toHospitalName: string;

  status: TransferRequestStatus;

  distance?: number;
  estimatedTimeMinutes?: number;

  reason: string;

  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}
