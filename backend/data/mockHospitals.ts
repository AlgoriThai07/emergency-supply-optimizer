import { Timestamp } from "firebase-admin/firestore";
import type { Hospital } from "../models/index.js";

const now = Timestamp.now();

export const mockHospitals: Hospital[] = [
  {
    id: "uic_medical",
    name: "UIC Medical Center",
    contactInfo: {
      phone: "+1-312-555-0101",
      email: "ops@uic.org",
      address: "1740 W Taylor St, Chicago, IL",
    },
    location: { latitude: 41.8703, longitude: -87.6726 },
    totalBeds: 495,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "rush_university",
    name: "Rush University Medical Center",
    contactInfo: {
      phone: "+1-312-555-0202",
      email: "ops@rush.edu",
      address: "1653 W Congress Pkwy, Chicago, IL",
    },
    location: { latitude: 41.8746, longitude: -87.6694 },
    totalBeds: 664,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "northwestern_memorial",
    name: "Northwestern Memorial Hospital",
    contactInfo: {
      phone: "+1-312-555-0303",
      email: "ops@nm.org",
      address: "251 E Huron St, Chicago, IL",
    },
    location: { latitude: 41.8944, longitude: -87.6204 },
    totalBeds: 894,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lurie_childrens",
    name: "Lurie Children's Hospital",
    contactInfo: {
      phone: "+1-312-555-0404",
      email: "ops@luriechildrens.org",
      address: "225 E Chicago Ave, Chicago, IL",
    },
    location: { latitude: 41.8951, longitude: -87.6224 },
    totalBeds: 364,
    createdAt: now,
    updatedAt: now,
  },
];
