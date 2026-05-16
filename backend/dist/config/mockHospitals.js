import { Timestamp } from "firebase-admin/firestore";
import { computeInventoryStatus } from "../utils/inventoryStatus.js";
const now = Timestamp.now();
export let mockHospitals = [
    {
        id: "mercy_hospital",
        name: "Mercy Hospital & Medical Center",
        contactInfo: {
            phone: "+1-312-555-0100",
            email: "dispatch@mercy.org",
            address: "2525 S Michigan Ave, Chicago, IL",
            pocName: "Dr. Rivera",
        },
        location: { latitude: 41.8494, longitude: -87.6244 },
        totalBeds: 292,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: "northwestern_memorial",
        name: "Northwestern Memorial Hospital",
        contactInfo: {
            phone: "+1-312-555-0200",
            email: "logistics@nm.org",
            address: "251 E Huron St, Chicago, IL",
            pocName: "Dr. Chen",
        },
        location: { latitude: 41.8944, longitude: -87.6204 },
        totalBeds: 894,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: "rush_university",
        name: "Rush University Medical Center",
        contactInfo: {
            phone: "+1-312-555-0300",
            email: "supply@rush.edu",
            address: "1653 W Congress Pkwy, Chicago, IL",
        },
        location: { latitude: 41.8746, longitude: -87.6694 },
        totalBeds: 664,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: "uchicago_medicine",
        name: "UChicago Medicine",
        contactInfo: {
            phone: "+1-773-555-0400",
            email: "beacon@uchospitals.edu",
            address: "5841 S Maryland Ave, Chicago, IL",
        },
        location: { latitude: 41.7891, longitude: -87.6048 },
        totalBeds: 811,
        createdAt: now,
        updatedAt: now,
    },
];
function item(data) {
    return {
        ...data,
        status: computeInventoryStatus(data.count, data.threshold),
        createdAt: now,
        lastUpdated: now,
    };
}
export let mockInventory = [
    item({
        id: "blood_o_neg",
        hospitalId: "mercy_hospital",
        itemName: "O-Neg Blood",
        count: 2,
        inUseCount: 1,
        threshold: 10,
        unit: "pints",
        category: "blood",
    }),
    item({
        id: "antidote_cyanide",
        hospitalId: "mercy_hospital",
        itemName: "Cyanide Kit",
        count: 4,
        inUseCount: 0,
        threshold: 2,
        unit: "kits",
        category: "pharmaceutical",
    }),
    item({
        id: "blood_o_neg",
        hospitalId: "northwestern_memorial",
        itemName: "O-Neg Blood",
        count: 28,
        inUseCount: 3,
        threshold: 10,
        unit: "pints",
        category: "blood",
    }),
    item({
        id: "antidote_cyanide",
        hospitalId: "northwestern_memorial",
        itemName: "Cyanide Kit",
        count: 12,
        inUseCount: 1,
        threshold: 2,
        unit: "kits",
        category: "pharmaceutical",
    }),
    item({
        id: "blood_o_neg",
        hospitalId: "rush_university",
        itemName: "O-Neg Blood",
        count: 14,
        inUseCount: 2,
        threshold: 10,
        unit: "pints",
        category: "blood",
    }),
    item({
        id: "antidote_cyanide",
        hospitalId: "rush_university",
        itemName: "Cyanide Kit",
        count: 6,
        inUseCount: 0,
        threshold: 2,
        unit: "kits",
        category: "pharmaceutical",
    }),
    item({
        id: "blood_o_neg",
        hospitalId: "uchicago_medicine",
        itemName: "O-Neg Blood",
        count: 11,
        inUseCount: 1,
        threshold: 10,
        unit: "pints",
        category: "blood",
    }),
    item({
        id: "antidote_cyanide",
        hospitalId: "uchicago_medicine",
        itemName: "Cyanide Kit",
        count: 3,
        inUseCount: 0,
        threshold: 2,
        unit: "kits",
        category: "pharmaceutical",
    }),
];
export function findHospital(id) {
    return mockHospitals.find((h) => h.id === id);
}
export function findInventoryItem(hospitalId, itemId) {
    return mockInventory.find((i) => i.hospitalId === hospitalId && i.id === itemId);
}
export function getHospitalInventory(hospitalId) {
    return mockInventory.filter((i) => i.hospitalId === hospitalId);
}
export function touchInventoryItem(item) {
    item.status = computeInventoryStatus(item.count, item.threshold);
    item.lastUpdated = Timestamp.now();
}
export function touchHospital(hospital) {
    hospital.updatedAt = Timestamp.now();
}
//# sourceMappingURL=mockHospitals.js.map