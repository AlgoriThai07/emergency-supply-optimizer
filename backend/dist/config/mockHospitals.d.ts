import type { Hospital, InventoryItem } from "../models/index.js";
export declare let mockHospitals: Hospital[];
export declare let mockInventory: InventoryItem[];
export declare function findHospital(id: string): Hospital | undefined;
export declare function findInventoryItem(hospitalId: string, itemId: string): InventoryItem | undefined;
export declare function getHospitalInventory(hospitalId: string): InventoryItem[];
export declare function touchInventoryItem(item: InventoryItem): void;
export declare function touchHospital(hospital: Hospital): void;
//# sourceMappingURL=mockHospitals.d.ts.map