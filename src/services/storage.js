const fs = require('fs').promises;
const path = require('path');

class StorageService {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'storage');
    this.receiptsDir = path.join(this.baseDir, 'receipts');
    this.dataDir = path.join(this.baseDir, 'data');
    this.errorsDir = path.join(this.baseDir, 'errors');
    
    // Initialize directories
    this.initializeDirectories();
  }

  /**
   * Initialize storage directories
   */
  async initializeDirectories() {
    try {
      await fs.mkdir(this.receiptsDir, { recursive: true });
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(this.errorsDir, { recursive: true });
      console.log('📁 Storage directories initialized');
    } catch (error) {
      console.error('❌ Error initializing storage directories:', error);
    }
  }

  /**
   * Save processed receipt data
   * @param {string} receiptId - Unique receipt ID
   * @param {Object} receiptData - Processed receipt data
   * @returns {Promise<string>} File path where data was saved
   */
  async saveReceipt(receiptId, receiptData) {
    try {
      const fileName = `receipt_${receiptId}.json`;
      const filePath = path.join(this.dataDir, fileName);
      
      const dataToSave = {
        ...receiptData,
        saved_at: new Date().toISOString(),
        version: '1.0'
      };

      await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));
      console.log(`💾 Receipt data saved: ${fileName}`);
      
      return filePath;
    } catch (error) {
      console.error('❌ Error saving receipt data:', error);
      throw new Error(`Failed to save receipt data: ${error.message}`);
    }
  }

  /**
   * Load receipt data by ID
   * @param {string} receiptId - Receipt ID
   * @returns {Promise<Object>} Receipt data
   */
  async loadReceipt(receiptId) {
    try {
      const fileName = `receipt_${receiptId}.json`;
      const filePath = path.join(this.dataDir, fileName);
      
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`❌ Error loading receipt ${receiptId}:`, error);
      throw new Error(`Receipt not found: ${receiptId}`);
    }
  }

  /**
   * Get all receipts for a phone number
   * @param {string} phoneNumber - Phone number
   * @returns {Promise<Array>} Array of receipt data
   */
  async getReceiptsByPhone(phoneNumber) {
    try {
      const files = await fs.readdir(this.dataDir);
      const receipts = [];

      for (const file of files) {
        if (file.endsWith('.json') && file.startsWith('receipt_')) {
          try {
            const data = await fs.readFile(path.join(this.dataDir, file), 'utf8');
            const receipt = JSON.parse(data);
            
            if (receipt.phone_number === phoneNumber) {
              receipts.push(receipt);
            }
          } catch (error) {
            console.warn(`⚠️ Error reading receipt file ${file}:`, error.message);
          }
        }
      }

      // Sort by timestamp (newest first)
      receipts.sort((a, b) => new Date(b.processing_timestamp) - new Date(a.processing_timestamp));
      
      return receipts;
    } catch (error) {
      console.error('❌ Error getting receipts by phone:', error);
      return [];
    }
  }

  /**
   * Get all receipts (for admin/export purposes)
   * @param {Object} options - Query options (limit, offset, status, etc.)
   * @returns {Promise<Array>} Array of receipt data
   */
  async getAllReceipts(options = {}) {
    try {
      const { limit = 100, offset = 0, status = null, startDate = null, endDate = null } = options;
      
      const files = await fs.readdir(this.dataDir);
      const receipts = [];

      for (const file of files) {
        if (file.endsWith('.json') && file.startsWith('receipt_')) {
          try {
            const data = await fs.readFile(path.join(this.dataDir, file), 'utf8');
            const receipt = JSON.parse(data);
            
            // Apply filters
            if (status && receipt.status !== status) continue;
            
            if (startDate) {
              const receiptDate = new Date(receipt.processing_timestamp);
              if (receiptDate < new Date(startDate)) continue;
            }
            
            if (endDate) {
              const receiptDate = new Date(receipt.processing_timestamp);
              if (receiptDate > new Date(endDate)) continue;
            }
            
            receipts.push(receipt);
          } catch (error) {
            console.warn(`⚠️ Error reading receipt file ${file}:`, error.message);
          }
        }
      }

      // Sort by timestamp (newest first)
      receipts.sort((a, b) => new Date(b.processing_timestamp) - new Date(a.processing_timestamp));
      
      // Apply pagination
      return receipts.slice(offset, offset + limit);
    } catch (error) {
      console.error('❌ Error getting all receipts:', error);
      return [];
    }
  }

  /**
   * Update receipt status
   * @param {string} receiptId - Receipt ID
   * @param {string} status - New status ('pending_approval', 'approved', 'rejected', 'corrected')
   * @param {Object} additionalData - Additional data to update
   * @returns {Promise<Object>} Updated receipt data
   */
  async updateReceiptStatus(receiptId, status, additionalData = {}) {
    try {
      const receipt = await this.loadReceipt(receiptId);
      
      const updatedReceipt = {
        ...receipt,
        status: status,
        ...additionalData,
        last_updated: new Date().toISOString(),
        status_history: [
          ...(receipt.status_history || []),
          {
            status: status,
            timestamp: new Date().toISOString(),
            ...additionalData
          }
        ]
      };

      await this.saveReceipt(receiptId, updatedReceipt);
      console.log(`✅ Receipt ${receiptId} status updated to: ${status}`);
      
      return updatedReceipt;
    } catch (error) {
      console.error(`❌ Error updating receipt status:`, error);
      throw error;
    }
  }

  /**
   * Save error information for debugging
   * @param {string} receiptId - Receipt ID (if available)
   * @param {Object} errorData - Error information
   * @returns {Promise<string>} Error file path
   */
  async saveError(receiptId, errorData) {
    try {
      const errorId = receiptId || `error_${Date.now()}`;
      const fileName = `error_${errorId}.json`;
      const filePath = path.join(this.errorsDir, fileName);
      
      const errorRecord = {
        error_id: errorId,
        receipt_id: receiptId,
        ...errorData,
        saved_at: new Date().toISOString()
      };

      await fs.writeFile(filePath, JSON.stringify(errorRecord, null, 2));
      console.log(`🐛 Error logged: ${fileName}`);
      
      return filePath;
    } catch (error) {
      console.error('❌ Error saving error log:', error);
      // Don't throw here as this would create an error loop
    }
  }

  /**
   * Export receipts to CSV format
   * @param {Array} receipts - Receipt data array
   * @returns {string} CSV content
   */
  async exportToCSV(receipts) {
    try {
      if (!receipts || receipts.length === 0) {
        return 'No receipts to export';
      }

      // Define CSV headers
      const headers = [
        'Receipt ID',
        'Phone Number',
        'Contact Name',
        'Merchant Name',
        'Total Amount',
        'Tax Amount',
        'Date',
        'Time',
        'Currency',
        'Payment Method',
        'Status',
        'Processing Timestamp',
        'Confidence Score'
      ];

      // Convert receipts to CSV rows
      const rows = receipts.map(receipt => [
        receipt.receipt_id || '',
        receipt.phone_number || '',
        receipt.contact_name || '',
        receipt.merchant_name || '',
        receipt.total_amount || '',
        receipt.tax_amount || '',
        receipt.date || '',
        receipt.time || '',
        receipt.currency || '',
        receipt.payment_method || '',
        receipt.status || '',
        receipt.processing_timestamp || '',
        receipt.confidence_score || ''
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return csvContent;
    } catch (error) {
      console.error('❌ Error exporting to CSV:', error);
      throw new Error(`Failed to export CSV: ${error.message}`);
    }
  }

  /**
   * Get storage statistics
   * @returns {Promise<Object>} Storage statistics
   */
  async getStats() {
    try {
      const receipts = await this.getAllReceipts({ limit: 10000 }); // Get all for stats
      
      const stats = {
        total_receipts: receipts.length,
        status_breakdown: {},
        total_amount: 0,
        average_amount: 0,
        currency_breakdown: {},
        merchant_breakdown: {},
        processing_times: [],
        confidence_scores: [],
        date_range: {
          earliest: null,
          latest: null
        }
      };

      for (const receipt of receipts) {
        // Status breakdown
        const status = receipt.status || 'unknown';
        stats.status_breakdown[status] = (stats.status_breakdown[status] || 0) + 1;

        // Currency and amounts
        if (receipt.total_amount) {
          const amount = parseFloat(receipt.total_amount);
          if (!isNaN(amount)) {
            stats.total_amount += amount;
            
            const currency = receipt.currency || 'USD';
            stats.currency_breakdown[currency] = (stats.currency_breakdown[currency] || 0) + amount;
          }
        }

        // Merchant breakdown
        if (receipt.merchant_name) {
          const merchant = receipt.merchant_name;
          stats.merchant_breakdown[merchant] = (stats.merchant_breakdown[merchant] || 0) + 1;
        }

        // Processing times and confidence
        if (receipt.processing?.duration) {
          stats.processing_times.push(receipt.processing.duration);
        }
        
        if (receipt.confidence_score) {
          stats.confidence_scores.push(receipt.confidence_score);
        }

        // Date range
        if (receipt.processing_timestamp) {
          const date = new Date(receipt.processing_timestamp);
          if (!stats.date_range.earliest || date < new Date(stats.date_range.earliest)) {
            stats.date_range.earliest = receipt.processing_timestamp;
          }
          if (!stats.date_range.latest || date > new Date(stats.date_range.latest)) {
            stats.date_range.latest = receipt.processing_timestamp;
          }
        }
      }

      // Calculate averages
      if (receipts.length > 0) {
        stats.average_amount = stats.total_amount / receipts.length;
        
        if (stats.processing_times.length > 0) {
          stats.average_processing_time = stats.processing_times.reduce((sum, time) => sum + time, 0) / stats.processing_times.length;
        }
        
        if (stats.confidence_scores.length > 0) {
          stats.average_confidence = stats.confidence_scores.reduce((sum, score) => sum + score, 0) / stats.confidence_scores.length;
        }
      }

      return stats;
    } catch (error) {
      console.error('❌ Error getting storage stats:', error);
      throw error;
    }
  }

  /**
   * Cleanup old files (for maintenance)
   * @param {number} maxAgeInDays - Maximum age in days
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanup(maxAgeInDays = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);

      const results = {
        receipts_deleted: 0,
        errors_deleted: 0,
        images_deleted: 0
      };

      // Clean up old receipt data files
      const dataFiles = await fs.readdir(this.dataDir);
      for (const file of dataFiles) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.dataDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime < cutoffDate) {
            await fs.unlink(filePath);
            results.receipts_deleted++;
          }
        }
      }

      // Clean up old error files
      const errorFiles = await fs.readdir(this.errorsDir);
      for (const file of errorFiles) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.errorsDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime < cutoffDate) {
            await fs.unlink(filePath);
            results.errors_deleted++;
          }
        }
      }

      // Clean up old images
      const imageFiles = await fs.readdir(this.receiptsDir);
      for (const file of imageFiles) {
        const filePath = path.join(this.receiptsDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          results.images_deleted++;
        }
      }

      console.log(`🧹 Cleanup completed:`, results);
      return results;
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      throw error;
    }
  }
}

module.exports = new StorageService();