import axios from 'axios';

// Ensure this matches your backend's exact base URL or uses an env variable for dynamic routing.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Sends an OTP to the user's WhatsApp number.
 * @param phoneNumber The phone number (with country code)
 */
export async function sendWhatsAppOtp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${API_BASE_URL}/v1/auth/whatsapp/send`, {
        phoneNumber,
    });
    return response.data;
}

/**
 * Verifies the OTP and returns the Clerk Sign-In Ticket.
 * @param phoneNumber The phone number (with country code)
 * @param code The 6-digit OTP code
 */
export async function verifyWhatsAppOtp(phoneNumber: string, code: string): Promise<{ ticket: string }> {
    const response = await axios.post(`${API_BASE_URL}/v1/auth/whatsapp/verify`, {
        phoneNumber,
        code,
    });
    return response.data;
}
