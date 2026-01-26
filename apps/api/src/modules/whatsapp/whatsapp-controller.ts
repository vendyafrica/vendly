import { Request, Response } from 'express';
import { whatsAppService } from './whatsapp-service';

export class WhatsAppController {

    /**
     * Update Business Profile
     */
    async updateProfile(req: Request, res: Response) {
        try {
            const result = await whatsAppService.updateBusinessProfile(req.body);
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Register Phone Number
     */
    async registerPhone(req: Request, res: Response) {
        try {
            const { pin } = req.body;
            if (!pin) return res.status(400).json({ error: 'PIN is required' });

            const result = await whatsAppService.registerPhoneNumber(pin);
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Configure Welcome Message
     */
    async setWelcomeMessage(req: Request, res: Response) {
        try {
            const { enabled, prompts } = req.body;
            const result = await whatsAppService.setWelcomeMessage(enabled, prompts);
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const whatsAppController = new WhatsAppController();
