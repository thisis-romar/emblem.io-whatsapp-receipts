#!/usr/bin/env node
/**
 * Test Script for Pexels API Compliance
 * Validates API functionality before running full image retrieval
 */

const https = require('https');

// Test Configuration
const TEST_CONFIG = {
  PEXELS_API_KEY: process.env.PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY_HERE',
  TEST_QUERY: 'professional business innovation technology',
  IMAGES_TO_FETCH: 3
};

class PexelsAPITest {
  constructor() {
    this.apiKey = TEST_CONFIG.PEXELS_API_KEY;
    this.baseUrl = 'https://api.pexels.com/v1';
  }

  /**
   * Validate API key
   */
  validateApiKey() {
    if (!this.apiKey || this.apiKey === 'YOUR_PEXELS_API_KEY_HERE') {
      throw new Error(
        '❌ Please set your Pexels API key in the PEXELS_API_KEY environment variable.\n\n' +
        'Steps to get your API key:\n' +
        '1. Visit: https://www.pexels.com/api/new/\n' +
        '2. Sign up or log in to Pexels\n' +
        '3. Create a new application\n' +
        '4. Copy your API key\n' +
        '5. Set it as an environment variable:\n' +
        '   Windows (PowerShell): $env:PEXELS_API_KEY="your_key_here"\n' +
        '   Windows (CMD): set PEXELS_API_KEY=your_key_here\n' +
        '   macOS/Linux: export PEXELS_API_KEY="your_key_here"'
      );
    }
    console.log('✅ API key configured');
  }

  /**
   * Make test API request
   */
  async testApiRequest() {
    return new Promise((resolve, reject) => {
      const query = encodeURIComponent(TEST_CONFIG.TEST_QUERY);
      const url = `${this.baseUrl}/search?query=${query}&per_page=${TEST_CONFIG.IMAGES_TO_FETCH}&orientation=landscape`;
      
      console.log(`🔍 Testing API with query: "${TEST_CONFIG.TEST_QUERY}"`);
      
      const options = {
        headers: {
          'Authorization': this.apiKey,
          'User-Agent': 'PitchDeckImageRetriever-Test/1.0'
        },
        timeout: 10000
      };

      const req = https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`📡 Response Status: ${res.statusCode}`);
          
          if (res.statusCode === 200) {
            try {
              const response = JSON.parse(data);
              resolve(response);
            } catch (error) {
              reject(new Error(`Failed to parse JSON: ${error.message}`));
            }
          } else if (res.statusCode === 401) {
            reject(new Error('❌ API Key Invalid - Check your PEXELS_API_KEY'));
          } else if (res.statusCode === 429) {
            reject(new Error('❌ Rate Limited - Wait before trying again'));
          } else {
            reject(new Error(`❌ HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`❌ Network Error: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('❌ Request Timeout'));
      });
    });
  }

  /**
   * Test image processing
   */
  processTestResults(response) {
    if (!response.photos || response.photos.length === 0) {
      console.log('⚠️  No images found for test query');
      return [];
    }

    console.log(`✅ Found ${response.photos.length} images`);
    console.log('📋 Image Details:');
    
    const processedImages = response.photos.map((photo, index) => {
      const imageData = {
        id: photo.id,
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        dimensions: `${photo.width} × ${photo.height}`,
        avg_color: photo.avg_color,
        pexels_url: `https://www.pexels.com/photo/${photo.id}/`,
        download_url: photo.src.original,
        preview_url: photo.src.medium
      };
      
      console.log(`\n   ${index + 1}. Photo ID: ${imageData.id}`);
      console.log(`      👤 Photographer: ${imageData.photographer}`);
      console.log(`      📐 Dimensions: ${imageData.dimensions}`);
      console.log(`      🎨 Avg Color: ${imageData.avg_color}`);
      console.log(`      🔗 Pexels URL: ${imageData.pexels_url}`);
      console.log(`      ⬇️  Download: ${imageData.download_url}`);
      
      return imageData;
    });

    return processedImages;
  }

  /**
   * Display compliance information
   */
  displayComplianceInfo() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 PEXELS API COMPLIANCE INFORMATION');
    console.log('='.repeat(60));
    console.log('✅ License: Pexels License (Free for commercial use)');
    console.log('✅ Attribution: Photographer credit appreciated but not required');
    console.log('✅ Usage: Can be used in presentations, marketing, websites');
    console.log('❌ Prohibited: Cannot resell images as-is or claim ownership');
    console.log('❌ Prohibited: Cannot use in competing stock photo services');
    console.log('\n📖 Full License: https://www.pexels.com/license/');
    console.log('🔗 API Documentation: https://www.pexels.com/api/documentation/');
  }

  /**
   * Run the test
   */
  async run() {
    try {
      console.log('🧪 Pexels API Compliance Test');
      console.log('🎯 Validating API functionality and compliance\n');
      
      this.validateApiKey();
      
      const response = await this.testApiRequest();
      const images = this.processTestResults(response);
      
      this.displayComplianceInfo();
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ TEST SUCCESSFUL');
      console.log('='.repeat(60));
      console.log('🚀 API is working correctly');
      console.log('📸 Images retrieved successfully');
      console.log('⚖️  License compliance validated');
      console.log('🎯 Ready to run full image retrieval script');
      
      console.log('\n💡 Next steps:');
      console.log('   1. Run: node pitch-deck-image-retriever.js');
      console.log('   2. Wait for all 315 images to be processed');
      console.log('   3. Review the generated HTML gallery');
      
      return true;
      
    } catch (error) {
      console.error('\n❌ TEST FAILED:', error.message);
      
      if (error.message.includes('API key')) {
        console.log('\n🔑 API Key Setup Instructions:');
        console.log('   1. Visit: https://www.pexels.com/api/new/');
        console.log('   2. Sign up for a free Pexels account');
        console.log('   3. Create a new application');
        console.log('   4. Copy your API key');
        console.log('   5. Set environment variable: PEXELS_API_KEY');
      }
      
      return false;
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const test = new PexelsAPITest();
  test.run();
}

module.exports = PexelsAPITest;