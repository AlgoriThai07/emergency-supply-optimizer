/** Single inventory line item at a hospital */
export interface InventoryItem {
    name: string;
    category: string;
    stock: number;
    threshold: number;
    unit: string;
}
/** Hospital record used by matching + transfer endpoints */
export interface Hospital {
    id: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    overall_status: string;
    inventory: Record<string, InventoryItem>;
}
/**
 * In-memory hospital network (Chicago metro).
 * Mutated by POST /api/logistics/transfer until Firestore is live.
 */
export declare let mockHospitals: Hospital[];
//# sourceMappingURL=mockHospitals.d.ts.map