
import axios from 'axios';

interface WhatsAppMessage {
    messaging_product: string;
    to: string;
    type: string;
    template?: any;
    text?: any;
    interactive?: any;
}

export class WhatsAppService {
    private readonly apiUrl: string;
    private readonly accessToken: string;
    private readonly phoneNumberId: string;

    constructor() {
        this.apiUrl = 'https://graph.facebook.com/v18.0';
        this.accessToken = process.env.WA_ACCESS_TOKEN || '';
        this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID || '';
    }

    private async sendMessage(payload: WhatsAppMessage) {
        if (!this.accessToken || !this.phoneNumberId) {
            console.error('WhatsApp credentials missing');
            return;
        }

        try {
            const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
            const response = await axios.post(url, payload, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('WhatsApp message sent:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Send "Order Confirmed" template to Customer
     * Template Name: order_confirmation
     */
    async sendOrderConfirmation(customerPhone: string, orderDetails: { orderId: string, total: string, currency: string }) {
        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: customerPhone,
            type: 'template',
            template: {
                name: 'order_confirmation',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: orderDetails.orderId },
                            { type: 'text', text: `${orderDetails.currency} ${orderDetails.total}` }
                        ]
                    }
                ]
            }
        };
        return this.sendMessage(payload);
    }

    /**
     * Send "Order Status Update" to Customer
     * Template Name: order_status_update
     */
    async sendOrderStatusUpdate(customerPhone: string, orderId: string, statusMessage: string) {
        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: customerPhone,
            type: 'template',
            template: {
                name: 'order_status_update',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: orderId },
                            { type: 'text', text: statusMessage }
                        ]
                    }
                ]
            }
        };
        return this.sendMessage(payload);
    }

    /**
     * Send "Order Delivered" to Customer
     * Template Name: order_delivered
     */
    async sendOrderDelivered(customerPhone: string, orderId: string, reviewLink: string = "https://vendly.com") {
        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: customerPhone,
            type: 'template',
            template: {
                name: 'order_delivered',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: orderId },
                            { type: 'text', text: reviewLink }
                        ]
                    }
                ]
            }
        };
        return this.sendMessage(payload);
    }

    /**
     * Send "New Order" template to Seller with Accept/Decline buttons
     * Template Name: merchant_new_order
     */
    async sendNewOrderAlert(sellerPhone: string, orderDetails: { orderId: string, items: string, total: string }) {
        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: sellerPhone,
            type: 'template',
            template: {
                name: 'merchant_new_order',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: orderDetails.orderId },
                            { type: 'text', text: orderDetails.items },
                            { type: 'text', text: orderDetails.total }
                        ]
                    },
                    {
                        type: 'button',
                        sub_type: 'quick_reply',
                        index: 0,
                        parameters: [
                            { type: 'payload', payload: `ACCEPT_ORDER:${orderDetails.orderId}` }
                        ]
                    },
                    {
                        type: 'button',
                        sub_type: 'quick_reply',
                        index: 1,
                        parameters: [
                            { type: 'payload', payload: `DECLINE_ORDER:${orderDetails.orderId}` }
                        ]
                    }
                ]
            }
        };
        return this.sendMessage(payload);
    }

    /**
     * Send "Order Cancelled" to Seller
     * Template Name: merchant_order_cancelled
     */
    async sendMerchantCancellation(sellerPhone: string, orderId: string) {
        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: sellerPhone,
            type: 'template',
            template: {
                name: 'merchant_order_cancelled',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: orderId }
                        ]
                    }
                ]
            }
        };
        return this.sendMessage(payload);
    }

    /**
     * Send "Start Preparing" interactive message to Seller
     * Sent immediately after they click "Accept"
     */
    async sendPreparationTimer(sellerPhone: string, orderId: string) {
        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: sellerPhone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `Order #${orderId} accepted! 🍳\nStart preparing now. We will check availability for a rider in 5 minutes.`
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: `RIDER_REQUEST:${orderId}`,
                                title: 'Call Rider Now'
                            }
                        }
                    ]
                }
            }
        };
        return this.sendMessage(payload);
    }

    /**
     * Update WhatsApp Business Profile
     * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/business-profiles
     */
    async updateBusinessProfile(payload: {
        about?: string;
        address?: string;
        description?: string;
        email?: string;
        profile_picture_url?: string;
        websites?: string[];
        vertical?: string;
    }) {
        if (!this.accessToken || !this.phoneNumberId) return;

        try {
            const url = `${this.apiUrl}/${this.phoneNumberId}/whatsapp_business_profile`;
            const response = await axios.post(url, {
                messaging_product: 'whatsapp',
                ...payload
            }, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error updating business profile:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Register Phone Number
     * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/registration
     */
    async registerPhoneNumber(pin: string) {
        if (!this.accessToken || !this.phoneNumberId) return;

        try {
            const url = `${this.apiUrl}/${this.phoneNumberId}/register`;
            const response = await axios.post(url, {
                messaging_product: 'whatsapp',
                pin: pin
            }, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error registering phone number:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Configure Conversational Automation (Welcome Message)
     * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/conversational-automation-business-welcome-messages
     */
    async setWelcomeMessage(enabled: boolean, prompts?: string[]) {
        if (!this.accessToken || !this.phoneNumberId) return;

        try {
            const url = `${this.apiUrl}/${this.phoneNumberId}/conversational_automation`;

            const payload: any = {
                messaging_product: 'whatsapp',
                enable_welcome_message: enabled
            };

            if (prompts && prompts.length > 0) {
                payload.prompts = prompts;
            }

            const response = await axios.post(url, payload, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error setting welcome message:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const whatsAppService = new WhatsAppService();
