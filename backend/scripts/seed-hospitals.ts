/**
 * Seed Firestore with 5 Chicago-area hospitals and their inventory.
 *
 * Usage:  npx tsx scripts/seed-hospitals.ts
 *
 * Requires FIREBASE_* env vars in backend/.env (see .env.example).
 */

import "dotenv/config";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase-config.js";
import type { Hospital, InventoryItem, InventoryStatus } from "../models/index.js";

// ── Seed data ───────────────────────────────────────────────────────────

interface SeedHospital extends Omit<Hospital, "id" | "createdAt" | "updatedAt"> {
  inventory: Omit<InventoryItem, "id" | "hospitalId" | "lastUpdated">[];
}

function status(count: number): InventoryStatus {
  if (count <= 2) return "CRITICAL_SHORTAGE";
  if (count <= 10) return "LOW";
  if (count <= 50) return "ADEQUATE";
  return "SURPLUS";
}

const hospitals: SeedHospital[] = [
  {
    name: "Northwestern Memorial Hospital",
    location: { latitude: 41.8962, longitude: -87.6214 },
    contactInfo: {
      phone: "312-926-2000",
      email: "ops@northwestern.example.com",
      address: "251 E Huron St, Chicago, IL 60611",
      pocName: "Dr. Sarah Chen",
    },
    totalBeds: 894,
    inventory: [
      { itemName: "N95 Respirators",           count: 1200, inUseCount: 300, status: "SURPLUS" },
      { itemName: "Isolation Gowns",           count: 800,  inUseCount: 200, status: "SURPLUS" },
      { itemName: "Negative-Pressure Pods",    count: 2,    inUseCount: 2,   status: "CRITICAL_SHORTAGE" },
      { itemName: "Ventilators",               count: 45,   inUseCount: 40,  status: "LOW" },
      { itemName: "Oseltamivir (Tamiflu) Doses", count: 500, inUseCount: 80, status: "ADEQUATE" },
    ],
  },
  {
    name: "Rush University Medical Center",
    location: { latitude: 41.8748, longitude: -87.6699 },
    contactInfo: {
      phone: "312-942-5000",
      email: "ops@rush.example.com",
      address: "1653 W Congress Pkwy, Chicago, IL 60612",
      pocName: "Dr. Marcus Webb",
    },
    totalBeds: 664,
    inventory: [
      { itemName: "N95 Respirators",           count: 60,   inUseCount: 50,  status: "LOW" },
      { itemName: "Isolation Gowns",           count: 2000, inUseCount: 150, status: "SURPLUS" },
      { itemName: "Negative-Pressure Pods",    count: 8,    inUseCount: 3,   status: "ADEQUATE" },
      { itemName: "Ventilators",               count: 30,   inUseCount: 10,  status: "ADEQUATE" },
      { itemName: "Oseltamivir (Tamiflu) Doses", count: 5,  inUseCount: 3,   status: "LOW" },
    ],
  },
  {
    name: "UChicago Medical Center",
    location: { latitude: 41.7892, longitude: -87.6048 },
    contactInfo: {
      phone: "773-702-1000",
      email: "ops@uchicago-med.example.com",
      address: "5841 S Maryland Ave, Chicago, IL 60637",
      pocName: "Dr. Priya Patel",
    },
    totalBeds: 811,
    inventory: [
      { itemName: "N95 Respirators",           count: 400,  inUseCount: 100, status: "ADEQUATE" },
      { itemName: "Isolation Gowns",           count: 1,    inUseCount: 1,   status: "CRITICAL_SHORTAGE" },
      { itemName: "Negative-Pressure Pods",    count: 12,   inUseCount: 4,   status: "ADEQUATE" },
      { itemName: "Ventilators",               count: 55,   inUseCount: 20,  status: "SURPLUS" },
      { itemName: "Oseltamivir (Tamiflu) Doses", count: 250, inUseCount: 60, status: "ADEQUATE" },
    ],
  },
  {
    name: "Advocate Christ Medical Center",
    location: { latitude: 41.7215, longitude: -87.7369 },
    contactInfo: {
      phone: "708-684-8000",
      email: "ops@advocatechrist.example.com",
      address: "4440 W 95th St, Oak Lawn, IL 60453",
      pocName: "Dr. James Okafor",
    },
    totalBeds: 749,
    inventory: [
      { itemName: "N95 Respirators",           count: 2,    inUseCount: 2,   status: "CRITICAL_SHORTAGE" },
      { itemName: "Isolation Gowns",           count: 350,  inUseCount: 100, status: "ADEQUATE" },
      { itemName: "Negative-Pressure Pods",    count: 5,    inUseCount: 5,   status: "LOW" },
      { itemName: "Ventilators",               count: 1,    inUseCount: 1,   status: "CRITICAL_SHORTAGE" },
      { itemName: "Oseltamivir (Tamiflu) Doses", count: 800, inUseCount: 50, status: "SURPLUS" },
    ],
  },
  {
    name: "Loyola University Medical Center",
    location: { latitude: 41.8583, longitude: -87.8361 },
    contactInfo: {
      phone: "708-216-9000",
      email: "ops@loyola-med.example.com",
      address: "2160 S 1st Ave, Maywood, IL 60153",
      pocName: "Dr. Ana Reyes",
    },
    totalBeds: 547,
    inventory: [
      { itemName: "N95 Respirators",           count: 900,  inUseCount: 100, status: "SURPLUS" },
      { itemName: "Isolation Gowns",           count: 600,  inUseCount: 50,  status: "SURPLUS" },
      { itemName: "Negative-Pressure Pods",    count: 3,    inUseCount: 1,   status: "ADEQUATE" },
      { itemName: "Ventilators",               count: 80,   inUseCount: 15,  status: "SURPLUS" },
      { itemName: "Oseltamivir (Tamiflu) Doses", count: 2,  inUseCount: 2,   status: "CRITICAL_SHORTAGE" },
    ],
  },
];

// ── Write to Firestore ──────────────────────────────────────────────────

async function seed() {
  const batch = db.batch();
  const now = FieldValue.serverTimestamp();

  for (const h of hospitals) {
    const hospRef = db.collection("hospitals").doc();
    const { inventory, ...hospData } = h;

    batch.set(hospRef, {
      ...hospData,
      createdAt: now,
      updatedAt: now,
    });

    for (const item of inventory) {
      const invRef = db.collection("inventory").doc();
      batch.set(invRef, {
        ...item,
        hospitalId: hospRef.id,
        lastUpdated: now,
      });
    }
  }

  await batch.commit();
  console.log(`✅  Seeded ${hospitals.length} hospitals and ${hospitals.reduce((n, h) => n + h.inventory.length, 0)} inventory items`);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
