const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');
const WhatsAppService = require('./whatsapp');
const StorageService = require('./storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class ReceiptProcessor {
  constructor() {
    // Initialize Document AI client
    this.docAIClient = new DocumentProcessorServiceClient();
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us';
    this.processorId = process.env.DOCUMENT_AI_PROCESSOR_ID;
    
    if (!this.projectId) {
      console.warn('⚠️ GOOGLE_CLOUD_PROJECT_ID not set, OCR will use fallback mode');
    }
    if (!this.processorId) {
      console.warn('⚠️ DOCUMENT_AI_PROCESSOR_ID not set, OCR will use fallback mode');
    }
  }

  /**
   * Main method to process a receipt from WhatsApp media ID
   * @param {string} mediaId - WhatsApp media ID
   * @param {string} phoneNumber - Sender's phone number
   * @param {Object} metadata - Additional metadata (caption, contactName, etc.)
   * @returns {Promise<Object>} Processing result
   */
  async processReceipt(mediaId, phoneNumber, metadata = {}) {
    const receiptId = uuidv4();
    const startTime = Date.now();
    
    try {
      console.log(`🧾 Processing receipt ${receiptId} from ${phoneNumber}`);

      // Step 1: Download media from WhatsApp
      const mediaInfo = await WhatsAppService.getMediaUrl(mediaId);
      const fileName = `receipt_${receiptId}_${Date.now()}.${this.getFileExtension(mediaInfo.mime_type)}`;
      const filePath = await WhatsAppService.downloadMedia(mediaInfo.url, fileName);

      // Step 2: Process with OCR
      let ocrResults;
      if (this.projectId && this.processorId) {
        ocrResults = await this.processWithDocumentAI(filePath);
      } else {
        ocrResults = await this.processWithFallbackOCR(filePath);
      }

      // Step 3: Parse and structure the data
      const parsedData = await this.parseReceiptData(ocrResults, {
        receiptId,
        phoneNumber,
        originalFileName: fileName,
        filePath,
        ...metadata
      });

      // Step 4: Store the results
      await StorageService.saveReceipt(receiptId, {
        ...parsedData,
        processing: {
          duration: Date.now() - startTime,
          ocrMethod: this.projectId && this.processorId ? 'document_ai' : 'fallback',
          timestamp: new Date().toISOString()
        }
      });

      console.log(`✅ Receipt ${receiptId} processed successfully in ${Date.now() - startTime}ms`);

      return {
        success: true,
        data: parsedData
      };
    } catch (error) {
      console.error(`❌ Error processing receipt ${receiptId}:`, error);
      
      // Store error for debugging
      await StorageService.saveError(receiptId, {
        error: error.message,
        stack: error.stack,
        phoneNumber,
        mediaId,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: error.message,
        receiptId
      };
    }
  }

  /**
   * Process receipt using Google Document AI
   * @param {string} filePath - Local file path
   * @returns {Promise<Object>} OCR results
   */
  async processWithDocumentAI(filePath) {
    try {
      console.log('🤖 Processing with Google Document AI...');

      const fs = require('fs').promises;
      const imageBuffer = await fs.readFile(filePath);

      // Configure the request
      const request = {
        name: `projects/${this.projectId}/locations/${this.location}/processors/${this.processorId}`,
        rawDocument: {
          content: imageBuffer.toString('base64'),
          mimeType: this.getMimeType(filePath)
        }
      };

      // Process the document
      const [result] = await this.docAIClient.processDocument(request);
      const document = result.document;

      console.log(`✅ Document AI processed ${document.pages.length} page(s)`);

      return {
        text: document.text,
        entities: document.entities || [],
        pages: document.pages || [],
        confidence: this.calculateAverageConfidence(document)
      };
    } catch (error) {
      console.error('❌ Document AI processing failed:', error);
      console.log('🔄 Falling back to alternative OCR...');
      return await this.processWithFallbackOCR(filePath);
    }
  }

  /**
   * Fallback OCR processing (for demo or when Document AI is not available)
   * @param {string} filePath - Local file path
   * @returns {Promise<Object>} OCR results
   */
  async processWithFallbackOCR(filePath) {
    console.log('🔄 Processing with fallback OCR (demo mode)...');

    // For demo purposes, return mock data based on common receipt patterns
    // In production, you could integrate with Tesseract.js or other OCR libraries
    const mockReceiptData = {
      text: `
MERCHANT RECEIPT
Store Name: Demo Restaurant
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Items:
Coffee               $4.50
Sandwich            $12.00
Tax                  $1.32
Total              $17.82

Thank you for your business!
      `.trim(),
      entities: [
        { type: 'total_amount', mentionText: '$17.82', confidence: 0.95 },
        { type: 'supplier_name', mentionText: 'Demo Restaurant', confidence: 0.90 },
        { type: 'receipt_date', mentionText: new Date().toLocaleDateString(), confidence: 0.85 },
        { type: 'tax_amount', mentionText: '$1.32', confidence: 0.80 }
      ],
      pages: [{ pageNumber: 1 }],
      confidence: 0.87
    };

    // Add some randomization for demo purposes
    const amounts = ['$17.82', '$23.45', '$8.90', '$156.78', '$42.10'];
    const merchants = ['Demo Restaurant', 'Coffee Shop', 'Gas Station', 'Office Supplies Co', 'Grocery Store'];
    const taxes = ['$1.32', '$2.45', '$0.89', '$15.67', '$4.21'];

    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
    const randomTax = taxes[Math.floor(Math.random() * taxes.length)];

    mockReceiptData.text = mockReceiptData.text
      .replace('$17.82', randomAmount)
      .replace('Demo Restaurant', randomMerchant)
      .replace('$1.32', randomTax);

    mockReceiptData.entities[0].mentionText = randomAmount;
    mockReceiptData.entities[1].mentionText = randomMerchant;
    mockReceiptData.entities[3].mentionText = randomTax;

    return mockReceiptData;
  }

  /**
   * Parse OCR results into structured receipt data
   * @param {Object} ocrResults - OCR processing results
   * @param {Object} metadata - Receipt metadata
   * @returns {Promise<Object>} Structured receipt data
   */
  async parseReceiptData(ocrResults, metadata) {
    try {
      console.log('📊 Parsing receipt data...');

      const entities = ocrResults.entities || [];
      const text = ocrResults.text || '';

      // Extract key fields using entity recognition and text parsing
      const receiptData = {
        receipt_id: metadata.receiptId,
        phone_number: metadata.phoneNumber,
        contact_name: metadata.contactName || 'Unknown',
        
        // Basic receipt info
        merchant_name: this.extractMerchantName(entities, text),
        total_amount: this.extractAmount(entities, text, 'total_amount'),
        tax_amount: this.extractAmount(entities, text, 'tax_amount'),
        subtotal_amount: this.extractAmount(entities, text, 'subtotal_amount'),
        
        // Date and time
        date: this.extractDate(entities, text),
        time: this.extractTime(entities, text),
        
        // Line items
        line_items: this.extractLineItems(entities, text),
        
        // Additional info
        currency: this.extractCurrency(text) || 'USD',
        payment_method: this.extractPaymentMethod(entities, text),
        
        // Metadata
        original_text: text,
        confidence_score: ocrResults.confidence || 0,
        file_path: metadata.filePath,
        processing_timestamp: new Date().toISOString(),
        
        // User context
        caption: metadata.caption || '',
        
        // Status
        status: 'pending_approval'
      };

      console.log(`✅ Parsed receipt data: ${receiptData.merchant_name} - ${receiptData.total_amount}`);
      return receiptData;
    } catch (error) {
      console.error('❌ Error parsing receipt data:', error);
      throw new Error(`Failed to parse receipt data: ${error.message}`);
    }
  }

  /**
   * Extract merchant/store name from OCR results
   */
  extractMerchantName(entities, text) {
    // Try entity recognition first
    const supplierEntity = entities.find(e => 
      e.type === 'supplier_name' || 
      e.type === 'merchant_name' ||
      e.type === 'supplier'
    );
    
    if (supplierEntity && supplierEntity.mentionText) {
      return this.cleanText(supplierEntity.mentionText);
    }

    // Fallback to text parsing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Usually the merchant name is in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      
      // Skip lines that look like addresses, phone numbers, or receipts headers
      if (line.match(/^\d+/) || // starts with number (likely address)
          line.match(/receipt|invoice|bill/i) || // header words
          line.match(/^\(\d{3}\)/) || // phone number
          line.length < 3 || // too short
          line.length > 50 // too long
      ) {
        continue;
      }
      
      return this.cleanText(line);
    }

    return 'Unknown Merchant';
  }

  /**
   * Extract monetary amounts
   */
  extractAmount(entities, text, type) {
    // Try entity recognition first
    const amountEntity = entities.find(e => e.type === type);
    if (amountEntity && amountEntity.mentionText) {
      return this.parseAmount(amountEntity.mentionText);
    }

    // Fallback to text parsing
    const amountPatterns = {
      total_amount: /(?:total|amount due|balance)[:\s]*\$?(\d+\.?\d*)/i,
      tax_amount: /(?:tax|hst|gst|vat)[:\s]*\$?(\d+\.?\d*)/i,
      subtotal_amount: /(?:subtotal|sub total|sub-total)[:\s]*\$?(\d+\.?\d*)/i
    };

    const pattern = amountPatterns[type];
    if (pattern) {
      const match = text.match(pattern);
      if (match) {
        return this.parseAmount(match[1]);
      }
    }

    // For total amount, try to find the last/largest amount
    if (type === 'total_amount') {
      const amounts = text.match(/\$?\d+\.?\d*/g) || [];
      const numericAmounts = amounts
        .map(a => parseFloat(a.replace(/[^0-9.]/g, '')))
        .filter(a => !isNaN(a) && a > 0)
        .sort((a, b) => b - a);
      
      if (numericAmounts.length > 0) {
        return numericAmounts[0].toFixed(2);
      }
    }

    return null;
  }

  /**
   * Extract date from receipt
   */
  extractDate(entities, text) {
    const dateEntity = entities.find(e => e.type === 'receipt_date' || e.type === 'date');
    if (dateEntity && dateEntity.mentionText) {
      return this.parseDate(dateEntity.mentionText);
    }

    // Try to find date patterns in text
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{2,4}/, // MM/DD/YYYY or MM/DD/YY
      /\d{1,2}-\d{1,2}-\d{2,4}/, // MM-DD-YYYY
      /\d{4}-\d{1,2}-\d{1,2}/, // YYYY-MM-DD
      /\w+\s+\d{1,2},?\s+\d{4}/ // Month DD, YYYY
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return this.parseDate(match[0]);
      }
    }

    return new Date().toLocaleDateString();
  }

  /**
   * Extract time from receipt
   */
  extractTime(entities, text) {
    const timePattern = /\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?/;
    const match = text.match(timePattern);
    return match ? match[0] : null;
  }

  /**
   * Extract line items from receipt
   */
  extractLineItems(entities, text) {
    const items = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Look for lines with item and price
      const itemMatch = line.match(/^(.+?)\s+\$?(\d+\.?\d*)$/);
      if (itemMatch) {
        const description = this.cleanText(itemMatch[1]);
        const amount = this.parseAmount(itemMatch[2]);
        
        // Skip lines that are likely totals or taxes
        if (!description.match(/total|tax|subtotal|balance/i) && description.length > 2) {
          items.push({
            description: description,
            amount: amount,
            quantity: 1 // Default quantity
          });
        }
      }
    }

    return items;
  }

  /**
   * Extract currency from text
   */
  extractCurrency(text) {
    if (text.includes('$')) return 'USD';
    if (text.includes('€')) return 'EUR';
    if (text.includes('£')) return 'GBP';
    if (text.includes('¥')) return 'JPY';
    return 'USD'; // Default
  }

  /**
   * Extract payment method
   */
  extractPaymentMethod(entities, text) {
    const paymentPatterns = [
      { pattern: /credit|visa|mastercard|amex/i, method: 'Credit Card' },
      { pattern: /debit/i, method: 'Debit Card' },
      { pattern: /cash/i, method: 'Cash' },
      { pattern: /paypal/i, method: 'PayPal' },
      { pattern: /apple pay|google pay/i, method: 'Mobile Payment' }
    ];

    for (const { pattern, method } of paymentPatterns) {
      if (text.match(pattern)) {
        return method;
      }
    }

    return null;
  }

  /**
   * Helper methods
   */
  parseAmount(amountStr) {
    if (!amountStr) return null;
    const cleaned = amountStr.toString().replace(/[^0-9.]/g, '');
    const amount = parseFloat(cleaned);
    return isNaN(amount) ? null : amount.toFixed(2);
  }

  parseDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date().toLocaleDateString() : date.toLocaleDateString();
    } catch {
      return new Date().toLocaleDateString();
    }
  }

  cleanText(text) {
    return text.toString().trim().replace(/\s+/g, ' ');
  }

  getFileExtension(mimeType) {
    const mimeMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/pdf': 'pdf'
    };
    return mimeMap[mimeType] || 'jpg';
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const extMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf'
    };
    return extMap[ext] || 'image/jpeg';
  }

  calculateAverageConfidence(document) {
    if (!document.entities || document.entities.length === 0) return 0.5;
    
    const confidences = document.entities
      .map(entity => entity.confidence || 0.5)
      .filter(conf => conf > 0);
    
    return confidences.length > 0 
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
      : 0.5;
  }
}

module.exports = new ReceiptProcessor();