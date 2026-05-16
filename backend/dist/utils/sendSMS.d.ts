/**
 * Sends an emergency SMS via Twilio. Logs success/failure to the terminal.
 */
export declare function sendEmergencyAlert(toPhoneNumber: string, messageBody: string): Promise<{
    sid: string;
} | null>;
//# sourceMappingURL=sendSMS.d.ts.map