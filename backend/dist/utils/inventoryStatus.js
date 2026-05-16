/** Derive status from count vs shortage threshold */
export function computeInventoryStatus(count, threshold) {
    if (count < threshold)
        return "CRITICAL_SHORTAGE";
    if (count > threshold)
        return "SURPLUS";
    return "ADEQUATE";
}
export function isSurplus(count, threshold) {
    return count > threshold;
}
export function isCriticalShortage(count, threshold) {
    return count < threshold;
}
//# sourceMappingURL=inventoryStatus.js.map