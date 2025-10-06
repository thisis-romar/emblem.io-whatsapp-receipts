const express = require('express');
const router = express.Router();
const WhatsAppService = require('../services/whatsapp');
const ReceiptProcessor = require('../services/receiptProcessor');
const { validateWhatsAppWebhook } = require('../middleware/validation');

/**
 * GET /webhook/whatsapp - Webhook verification endpoint
 * WhatsApp sends a GET request with verification parameters
 */
router.get('/whatsapp', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verify the webhook
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ WhatsApp webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('❌ WhatsApp webhook verification failed');
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('❌ Webhook verification error:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * POST /webhook/whatsapp - Receive WhatsApp messages
 * Handles incoming messages, particularly image messages for receipt processing
 */
router.post('/whatsapp', validateWhatsAppWebhook, async (req, res) => {
  try {
    const body = req.body;
    
    // Quick response to WhatsApp to prevent timeout
    res.status(200).send('OK');

    // Process the webhook data asynchronously
    console.log('📨 Received WhatsApp webhook:', JSON.stringify(body, null, 2));

    // Check if this is a message webhook
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      
      if (changes?.field === 'messages') {
        const messages = changes.value?.messages;
        const contacts = changes.value?.contacts;
        
        if (messages && messages.length > 0) {
          for (const message of messages) {
            await processIncomingMessage(message, contacts);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing WhatsApp webhook:', error);
    // Don't return error to WhatsApp to prevent webhook disabling
    res.status(200).send('OK');
  }
});

/**
 * Process incoming WhatsApp message
 * @param {Object} message - WhatsApp message object
 * @param {Array} contacts - Contact information
 */
async function processIncomingMessage(message, contacts) {
  try {
    const messageType = message.type;
    const phoneNumber = message.from;
    const contact = contacts?.find(c => c.wa_id === phoneNumber);
    const contactName = contact?.profile?.name || 'Unknown';

    console.log(`📱 Processing ${messageType} message from ${contactName} (${phoneNumber})`);

    // Handle different message types
    switch (messageType) {
      case 'image':
        await handleImageMessage(message, phoneNumber, contactName);
        break;
      
      case 'text':
        await handleTextMessage(message, phoneNumber, contactName);
        break;
        
      case 'interactive':
        await handleInteractiveMessage(message, phoneNumber, contactName);
        break;
        
      default:
        console.log(`ℹ️ Unsupported message type: ${messageType}`);
        await WhatsAppService.sendMessage(phoneNumber, {
          text: "Sorry, I can only process receipt images. Please send a photo of your receipt! 📸"
        });
    }
  } catch (error) {
    console.error('❌ Error processing incoming message:', error);
  }
}

/**
 * Handle image messages (receipts)
 */
async function handleImageMessage(message, phoneNumber, contactName) {
  try {
    const mediaId = message.image.id;
    const caption = message.image.caption || '';

    console.log(`🖼️ Processing receipt image from ${contactName}`);

    // Send immediate acknowledgment
    await WhatsAppService.sendMessage(phoneNumber, {
      text: "📸 Got your receipt! Processing now... This may take a moment. ⏳"
    });

    // Process the receipt
    const result = await ReceiptProcessor.processReceipt(mediaId, phoneNumber, {
      caption,
      contactName,
      timestamp: new Date().toISOString()
    });

    if (result.success) {
      await sendReceiptResults(phoneNumber, result.data, contactName);
    } else {
      await WhatsAppService.sendMessage(phoneNumber, {
        text: `❌ Sorry, I couldn't process that receipt. ${result.error || 'Please try again with a clearer image.'}`
      });
    }
  } catch (error) {
    console.error('❌ Error handling image message:', error);
    await WhatsAppService.sendMessage(phoneNumber, {
      text: "❌ Oops! Something went wrong processing your receipt. Please try again."
    });
  }
}

/**
 * Handle text messages
 */
async function handleTextMessage(message, phoneNumber, contactName) {
  const text = message.text.body.toLowerCase().trim();
  
  console.log(`💬 Text message from ${contactName}: "${text}"`);

  if (text.includes('help') || text === '/help') {
    await WhatsAppService.sendMessage(phoneNumber, {
      text: `👋 Hi ${contactName}! I'm your receipt processing assistant.\n\n📸 Send me a photo of your receipt and I'll extract:\n• Total amount\n• Date & time\n• Merchant name\n• Tax information\n• Line items\n\nJust snap a photo and send it over! 🚀`
    });
  } else {
    await WhatsAppService.sendMessage(phoneNumber, {
      text: "📸 Please send me a photo of your receipt to get started!\n\nType 'help' if you need assistance."
    });
  }
}

/**
 * Handle interactive message responses (buttons, etc.)
 */
async function handleInteractiveMessage(message, phoneNumber, contactName) {
  try {
    const interactiveType = message.interactive.type;
    
    if (interactiveType === 'button_reply') {
      const buttonId = message.interactive.button_reply.id;
      const buttonTitle = message.interactive.button_reply.title;
      
      console.log(`🔘 Button pressed by ${contactName}: ${buttonTitle} (${buttonId})`);
      
      // Handle approval/correction buttons
      if (buttonId.startsWith('approve_')) {
        await handleApproval(buttonId, phoneNumber, contactName);
      } else if (buttonId.startsWith('correct_')) {
        await handleCorrection(buttonId, phoneNumber, contactName);
      }
    }
  } catch (error) {
    console.error('❌ Error handling interactive message:', error);
  }
}

/**
 * Send formatted receipt results to user
 */
async function sendReceiptResults(phoneNumber, receiptData, contactName) {
  try {
    const {
      merchant_name,
      total_amount,
      tax_amount,
      date,
      time,
      line_items,
      receipt_id
    } = receiptData;

    // Format the receipt data
    let message = `✅ Receipt processed successfully!\n\n`;
    message += `🏪 **${merchant_name || 'Unknown Merchant'}**\n`;
    message += `💰 Total: $${total_amount || '0.00'}\n`;
    if (tax_amount) message += `📊 Tax: $${tax_amount}\n`;
    message += `📅 Date: ${date || 'Unknown'}\n`;
    if (time) message += `🕒 Time: ${time}\n`;
    
    if (line_items && line_items.length > 0) {
      message += `\n📝 **Items:**\n`;
      line_items.slice(0, 5).forEach((item, index) => {
        message += `${index + 1}. ${item.description || 'Item'} - $${item.amount || '0.00'}\n`;
      });
      if (line_items.length > 5) {
        message += `... and ${line_items.length - 5} more items\n`;
      }
    }

    await WhatsAppService.sendMessage(phoneNumber, { text: message });

    // Send approval buttons
    await WhatsAppService.sendInteractiveMessage(phoneNumber, {
      type: 'button',
      body: { text: 'Does this look correct?' },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `approve_${receipt_id}`,
              title: '✅ Approve'
            }
          },
          {
            type: 'reply',
            reply: {
              id: `correct_${receipt_id}`,
              title: '✏️ Make Changes'
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error('❌ Error sending receipt results:', error);
  }
}

/**
 * Handle receipt approval
 */
async function handleApproval(buttonId, phoneNumber, contactName) {
  const receiptId = buttonId.replace('approve_', '');
  console.log(`✅ Receipt ${receiptId} approved by ${contactName}`);
  
  await WhatsAppService.sendMessage(phoneNumber, {
    text: `✅ Great! Your receipt has been approved and saved.\n\n📊 You can now export it to your accounting system or send another receipt! 🚀`
  });
}

/**
 * Handle correction request
 */
async function handleCorrection(buttonId, phoneNumber, contactName) {
  const receiptId = buttonId.replace('correct_', '');
  console.log(`✏️ Correction requested for receipt ${receiptId} by ${contactName}`);
  
  await WhatsAppService.sendMessage(phoneNumber, {
    text: `✏️ I'd love to help you make corrections! This feature is coming soon.\n\nFor now, please send a new photo if the receipt wasn't captured correctly. 📸`
  });
}

module.exports = router;