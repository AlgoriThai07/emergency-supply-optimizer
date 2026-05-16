/**
 * In-memory hospital network (Chicago metro).
 * Mutated by POST /api/logistics/transfer until Firestore is live.
 */
export let mockHospitals = [
    {
        id: "mercy_hospital",
        name: "Mercy Hospital & Medical Center",
        location: { latitude: 41.8494, longitude: -87.6244 },
        overall_status: "critical",
        inventory: {
            blood_o_neg: {
                name: "O-Neg Blood",
                category: "blood",
                stock: 2,
                threshold: 10,
                unit: "pints",
            },
            antidote_cyanide: {
                name: "Cyanide Kit",
                category: "pharmaceutical",
                stock: 4,
                threshold: 2,
                unit: "kits",
            },
        },
    },
    {
        id: "northwestern_memorial",
        name: "Northwestern Memorial Hospital",
        location: { latitude: 41.8944, longitude: -87.6204 },
        overall_status: "operational",
        inventory: {
            blood_o_neg: {
                name: "O-Neg Blood",
                category: "blood",
                stock: 28,
                threshold: 10,
                unit: "pints",
            },
            antidote_cyanide: {
                name: "Cyanide Kit",
                category: "pharmaceutical",
                stock: 12,
                threshold: 2,
                unit: "kits",
            },
        },
    },
    {
        id: "rush_university",
        name: "Rush University Medical Center",
        location: { latitude: 41.8746, longitude: -87.6694 },
        overall_status: "operational",
        inventory: {
            blood_o_neg: {
                name: "O-Neg Blood",
                category: "blood",
                stock: 14,
                threshold: 10,
                unit: "pints",
            },
            antidote_cyanide: {
                name: "Cyanide Kit",
                category: "pharmaceutical",
                stock: 6,
                threshold: 2,
                unit: "kits",
            },
        },
    },
    {
        id: "uchicago_medicine",
        name: "UChicago Medicine",
        location: { latitude: 41.7891, longitude: -87.6048 },
        overall_status: "operational",
        inventory: {
            blood_o_neg: {
                name: "O-Neg Blood",
                category: "blood",
                stock: 11,
                threshold: 10,
                unit: "pints",
            },
            antidote_cyanide: {
                name: "Cyanide Kit",
                category: "pharmaceutical",
                stock: 3,
                threshold: 2,
                unit: "kits",
            },
        },
    },
];
//# sourceMappingURL=mockHospitals.js.map