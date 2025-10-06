const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    
    if (!this.accessToken) {
      throw new Error('WHATSAPP_ACCESS_TOKEN is required');
    }
    if (!this.phoneNumberId) {
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is required');
    }
  }

  /**
   * Send a text message to a WhatsApp number
   * @param {string} to - Phone number (with country code, no + sign)
   * @param {Object} message - Message object with text property
   * @returns {Promise<Object>} Response from WhatsApp API
   */
  async sendMessage(to, message) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: message.text
        }
      };

      console.log(`📤 Sending message to ${to}:`, message.text.substring(0, 100));

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Message sent successfully. ID: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
      throw new Error(`Failed to send WhatsApp message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Send an interactive message with buttons
   * @param {string} to - Phone number
   * @param {Object} interactive - Interactive message object
   * @returns {Promise<Object>} Response from WhatsApp API
   */
  async sendInteractiveMessage(to, interactive) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: interactive
      };

      console.log(`🔘 Sending interactive message to ${to}`);

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Interactive message sent successfully. ID: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending interactive message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get media URL from media ID
   * @param {string} mediaId - WhatsApp media ID
   * @returns {Promise<Object>} Media info including URL
   */
  async getMediaUrl(mediaId) {
    try {
      console.log(`🔗 Getting media URL for ID: ${mediaId}`);

      const response = await axios.get(
        `${this.baseUrl}/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const mediaInfo = response.data;
      console.log(`✅ Media URL retrieved. Size: ${mediaInfo.file_size} bytes, Type: ${mediaInfo.mime_type}`);
      
      return mediaInfo;
    } catch (error) {
      console.error('❌ Error getting media URL:', error.response?.data || error.message);
      throw new Error(`Failed to get media URL: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Download media from WhatsApp
   * @param {string} mediaUrl - Media URL from getMediaUrl
   * @param {string} fileName - Local filename to save
   * @returns {Promise<string>} Local file path
   */
  async downloadMedia(mediaUrl, fileName) {
    try {
      console.log(`⬇️ Downloading media: ${fileName}`);

      const response = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        responseType: 'stream'
      });

      // Ensure storage directory exists
      const storageDir = path.join(process.cwd(), 'storage', 'receipts');
      await fs.mkdir(storageDir, { recursive: true });

      const filePath = path.join(storageDir, fileName);
      const writer = require('fs').createWriteStream(filePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`✅ Media downloaded successfully: ${filePath}`);
          resolve(filePath);
        });
        writer.on('error', (error) => {
          console.error('❌ Error writing media file:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('❌ Error downloading media:', error.message);
      throw new Error(`Failed to download media: ${error.message}`);
    }
  }

  /**
   * Mark a message as read
   * @param {string} messageId - WhatsApp message ID
   * @returns {Promise<Object>} Response from WhatsApp API
   */
  async markMessageAsRead(messageId) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Message marked as read: ${messageId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error marking message as read:', error.response?.data || error.message);
      // Don't throw here as this is not critical
    }
  }

  /**
   * Send a reaction to a message
   * @param {string} to - Phone number
   * @param {string} messageId - Message ID to react to
   * @param {string} emoji - Emoji to react with
   * @returns {Promise<Object>} Response from WhatsApp API
   */
  async sendReaction(to, messageId, emoji) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'reaction',
        reaction: {
          message_id: messageId,
          emoji: emoji
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Reaction sent: ${emoji} to message ${messageId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending reaction:', error.response?.data || error.message);
      // Don't throw here as reactions are not critical
    }
  }

  /**
   * Send a template message (for notifications outside 24h window)
   * @param {string} to - Phone number
   * @param {string} templateName - Template name
   * @param {string} languageCode - Language code (e.g., 'en_US')
   * @param {Array} parameters - Template parameters
   * @returns {Promise<Object>} Response from WhatsApp API
   */
  async sendTemplate(to, templateName, languageCode = 'en_US', parameters = []) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: parameters.length > 0 ? [
            {
              type: 'body',
              parameters: parameters.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ] : []
        }
      };

      console.log(`📧 Sending template message to ${to}: ${templateName}`);

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Template message sent successfully. ID: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending template message:', error.response?.data || error.message);
      throw new Error(`Failed to send template message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Validate webhook signature (for production security)
   * @param {string} payload - Raw request payload
   * @param {string} signature - X-Hub-Signature-256 header
   * @returns {boolean} Whether signature is valid
   */
  validateWebhookSignature(payload, signature) {
    if (!process.env.WHATSAPP_WEBHOOK_SECRET) {
      console.warn('⚠️ WHATSAPP_WEBHOOK_SECRET not set, skipping signature validation');
      return true;
    }

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET)
      .update(payload, 'utf8')
      .digest('hex');

    const receivedSignature = signature?.replace('sha256=', '') || '';
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    );
  }
}

module.exports = new WhatsAppService();