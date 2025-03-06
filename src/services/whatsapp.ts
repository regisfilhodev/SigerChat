import axios from 'axios';
import { WHATSAPP_ACCESS_TOKEN, WHATSAPP_BASE_URL } from '../config/whatsapp';

class WhatsAppService {
    private baseURL: string;
    private headers: { Authorization: string };

    constructor() {
        this.baseURL = WHATSAPP_BASE_URL;
        this.headers = {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        };
    }

    async sendTemplateMessage(to: string, templateName: string, languageCode: string = 'pt_BR', components?: any[]) {
        try {
            const response = await axios.post(
                `${this.baseURL}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: {
                            code: languageCode
                        },
                        components
                    }
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao enviar mensagem de template:', error);
            throw error;
        }
    }

    async sendTextMessage(to: string, text: string) {
        try {
            const response = await axios.post(
                `${this.baseURL}/messages`,
                {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to,
                    type: 'text',
                    text: {
                        preview_url: false,
                        body: text
                    }
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao enviar mensagem de texto:', error);
            throw error;
        }
    }

    async handleWebhook(data: any) {
        console.log('Webhook recebido:', data);
        // Implementar lógica de tratamento do webhook
        return data;
    }
}

export default new WhatsAppService(); 