#!/usr/bin/env node
/**
 * Professional Pitch Deck Image Retriever
 * Automatically sources high-quality stock images for all pitch deck slides
 * Compliant with Pexels API terms and attribution requirements
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  PEXELS_API_KEY: process.env.PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY_HERE',
  RATE_LIMIT_MS: 1500, // 1.5 seconds between requests (conservative)
  IMAGES_PER_QUERY: 5,  // Number of images to fetch per search query
  OUTPUT_DIR: './pitch-deck-images',
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Slide-specific search queries (3 queries per slide = 63 total)
const SLIDE_QUERIES = [
  // Slide 1: Title - Receipt Capture, Reimagined
  [
    'professional business innovation technology',
    'modern fintech startup office',
    'digital transformation business'
  ],
  
  // Slide 2: Problem - Messy receipt chats
  [
    'business problem solution meeting',
    'frustrated office workers paperwork',
    'messy desk receipts chaos'
  ],
  
  // Slide 3: ICP - Who Cares
  [
    'small business team meeting',
    'construction workers field team',
    'nonprofit organization teamwork'
  ],
  
  // Slide 4: Today's Workaround
  [
    'manual paperwork process office',
    'frustrated businessman spreadsheet',
    'traditional office filing system'
  ],
  
  // Slide 5: Solution
  [
    'modern mobile app solution',
    'automation technology workflow',
    'smartphone business productivity'
  ],
  
  // Slide 6: Live Demo
  [
    'mobile app demonstration',
    'software interface demo',
    'technology presentation screen'
  ],
  
  // Slide 7: Why WhatsApp
  [
    'global communication network',
    'mobile messaging worldwide',
    'whatsapp business professional'
  ],
  
  // Slide 8: Group Messaging Reality
  [
    'official business communication',
    'professional messaging platform',
    'secure business chat'
  ],
  
  // Slide 9: Architecture
  [
    'cloud computing architecture',
    'technology infrastructure diagram',
    'modern server data center'
  ],
  
  // Slide 10: Core Endpoints
  [
    'API development coding',
    'software architecture planning',
    'technical documentation'
  ],
  
  // Slide 11: Parsing Engine
  [
    'artificial intelligence OCR',
    'document processing technology',
    'machine learning automation'
  ],
  
  // Slide 12: Messaging Cost
  [
    'business cost analysis chart',
    'financial planning calculator',
    'pricing strategy meeting'
  ],
  
  // Slide 13: Unit Economics
  [
    'financial charts economics',
    'business analytics dashboard',
    'profit margin calculation'
  ],
  
  // Slide 14: Competitive Landscape
  [
    'business competition analysis',
    'market research strategy',
    'competitive advantage meeting'
  ],
  
  // Slide 15: Moat
  [
    'business competitive advantage',
    'strategic defense protection',
    'market leadership position'
  ],
  
  // Slide 16: Go-to-Market
  [
    'marketing strategy planning',
    'business growth trajectory',
    'target market segmentation'
  ],
  
  // Slide 17: Pricing Tiers
  [
    'pricing strategy business',
    'subscription tiers pricing',
    'business model revenue'
  ],
  
  // Slide 18: Risks & Mitigations
  [
    'risk management business',
    'strategic planning mitigation',
    'business continuity planning'
  ],
  
  // Slide 19: Cost Breakdown Detail
  [
    'detailed financial analysis',
    'cost breakdown spreadsheet',
    'business expense tracking'
  ],
  
  // Slide 20: Tech Stack
  [
    'technology stack development',
    'software engineering tools',
    'modern programming languages'
  ],
  
  // Slide 21: The Ask
  [
    'business investment pitch',
    'startup funding presentation',
    'investor meeting handshake'
  ]
];

// Slide titles for reference
const SLIDE_TITLES = [
  'Receipt Capture, Reimagined',
  'The Problem',
  'Who Cares',
  'Today\'s Broken Workaround',
  'Our Solution',
  'Live Demo Flow',
  'Why WhatsApp?',
  'Group Messaging Reality',
  'Architecture Overview',
  'Core API Endpoints',
  'Parsing Engine Options',
  'WhatsApp Messaging Costs',
  'Unit Economics',
  'Competitive Landscape',
  'Our Moat',
  'Go-to-Market Strategy',
  'Pricing Tiers',
  'Risks & Mitigations',
  'Cost Breakdown Detail',
  'Tech Stack',
  'The Ask'
];

class PexelsImageRetriever {
  constructor() {
    this.apiKey = CONFIG.PEXELS_API_KEY;
    this.baseUrl = 'https://api.pexels.com/v1';
    this.results = [];
    this.requestCount = 0;
  }

  /**
   * Validate API key and configuration
   */
  validateConfig() {
    if (!this.apiKey || this.apiKey === 'YOUR_PEXELS_API_KEY_HERE') {
      throw new Error(
        'Please set your Pexels API key in the PEXELS_API_KEY environment variable.\n' +
        'Get your free API key at: https://www.pexels.com/api/new/'
      );
    }
    
    if (SLIDE_QUERIES.length !== SLIDE_TITLES.length) {
      throw new Error('Mismatch between slide queries and titles');
    }
    
    console.log('✅ Configuration validated');
    console.log(`📊 Will search ${SLIDE_QUERIES.length} slides × 3 queries × ${CONFIG.IMAGES_PER_QUERY} images = ${SLIDE_QUERIES.length * 3 * CONFIG.IMAGES_PER_QUERY} total images`);
  }

  /**
   * Make HTTP request to Pexels API
   */
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Authorization': this.apiKey,
          'User-Agent': 'PitchDeckImageRetriever/1.0'
        },
        timeout: CONFIG.REQUEST_TIMEOUT
      };

      const req = https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error(`Failed to parse JSON: ${error.message}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  /**
   * Search Pexels for images with retry logic
   */
  async searchImages(query, retryCount = 0) {
    try {
      this.requestCount++;
      console.log(`🔍 [${this.requestCount}/63] Searching: "${query}"`);
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/search?query=${encodedQuery}&per_page=${CONFIG.IMAGES_PER_QUERY}&orientation=landscape`;
      
      const response = await this.makeRequest(url);
      
      if (!response.photos || response.photos.length === 0) {
        console.warn(`⚠️  No images found for query: "${query}"`);
        return [];
      }
      
      // Process and format results
      const processedImages = response.photos.map(photo => ({
        id: photo.id,
        url: photo.url,
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        src: {
          original: photo.src.original,
          large2x: photo.src.large2x,
          large: photo.src.large,
          medium: photo.src.medium,
          small: photo.src.small,
          portrait: photo.src.portrait,
          landscape: photo.src.landscape,
          tiny: photo.src.tiny
        },
        alt: photo.alt || query,
        width: photo.width,
        height: photo.height,
        avg_color: photo.avg_color,
        pexels_url: `https://www.pexels.com/photo/${photo.id}/`
      }));
      
      console.log(`✅ Found ${processedImages.length} images for "${query}"`);
      return processedImages;
      
    } catch (error) {
      if (retryCount < CONFIG.MAX_RETRIES) {
        console.warn(`⚠️  Retrying "${query}" (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES}): ${error.message}`);
        await this.sleep(CONFIG.RATE_LIMIT_MS * 2); // Longer delay on retry
        return this.searchImages(query, retryCount + 1);
      } else {
        console.error(`❌ Failed to fetch "${query}" after ${CONFIG.MAX_RETRIES} retries: ${error.message}`);
        return [];
      }
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Process all slides and queries
   */
  async processAllSlides() {
    console.log('🚀 Starting comprehensive image retrieval...\n');
    
    for (let slideIndex = 0; slideIndex < SLIDE_QUERIES.length; slideIndex++) {
      const slideTitle = SLIDE_TITLES[slideIndex];
      const queries = SLIDE_QUERIES[slideIndex];
      
      console.log(`\n📝 Slide ${slideIndex + 1}: ${slideTitle}`);
      console.log('─'.repeat(50));
      
      const slideResults = {
        slideNumber: slideIndex + 1,
        slideTitle: slideTitle,
        queries: [],
        totalImages: 0
      };
      
      for (let queryIndex = 0; queryIndex < queries.length; queryIndex++) {
        const query = queries[queryIndex];
        const images = await this.searchImages(query);
        
        slideResults.queries.push({
          queryText: query,
          images: images,
          imageCount: images.length
        });
        
        slideResults.totalImages += images.length;
        
        // Rate limiting - pause between requests
        if (queryIndex < queries.length - 1 || slideIndex < SLIDE_QUERIES.length - 1) {
          await this.sleep(CONFIG.RATE_LIMIT_MS);
        }
      }
      
      this.results.push(slideResults);
      console.log(`📊 Slide ${slideIndex + 1} complete: ${slideResults.totalImages} images collected`);
    }
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory() {
    try {
      await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
      console.log(`📁 Output directory ready: ${CONFIG.OUTPUT_DIR}`);
    } catch (error) {
      throw new Error(`Failed to create output directory: ${error.message}`);
    }
  }

  /**
   * Generate JSON output file
   */
  async generateJsonOutput() {
    const outputData = {
      generatedAt: new Date().toISOString(),
      totalSlides: this.results.length,
      totalQueries: this.results.reduce((sum, slide) => sum + slide.queries.length, 0),
      totalImages: this.results.reduce((sum, slide) => sum + slide.totalImages, 0),
      pexelsAttribution: 'Photos provided by Pexels (https://www.pexels.com/)',
      licenseInfo: 'All images are free to use under Pexels License (https://www.pexels.com/license/)',
      slides: this.results
    };
    
    const jsonPath = path.join(CONFIG.OUTPUT_DIR, 'pitch-deck-images.json');
    await fs.writeFile(jsonPath, JSON.stringify(outputData, null, 2));
    console.log(`💾 JSON data saved: ${jsonPath}`);
    
    return outputData;
  }

  /**
   * Generate HTML gallery output
   */
  async generateHtmlOutput(data) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pitch Deck Image Gallery</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            line-height: 1.6;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .stats {
            background: white;
            padding: 1.5rem;
            margin: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        .stat { text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
        .container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
        .slide-section {
            background: white;
            margin: 2rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .slide-header {
            background: #667eea;
            color: white;
            padding: 1.5rem;
            font-size: 1.2em;
            font-weight: bold;
        }
        .query-group {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
        }
        .query-group:last-child { border-bottom: none; }
        .query-title {
            color: #333;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        .image-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.2s;
        }
        .image-card:hover { transform: translateY(-4px); }
        .image-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }
        .image-info {
            padding: 0.75rem;
            font-size: 0.9em;
        }
        .photographer {
            color: #666;
            margin-bottom: 0.5rem;
        }
        .attribution {
            background: #f8f9fa;
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .download-btn {
            background: #28a745;
            color: white;
            padding: 0.25rem 0.5rem;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.8em;
            display: inline-block;
        }
        .download-btn:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📸 Pitch Deck Image Gallery</h1>
        <p>Professional stock images for WhatsApp Receipt Capture presentation</p>
        <p>Generated: ${new Date(data.generatedAt).toLocaleString()}</p>
    </div>

    <div class="container">
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${data.totalSlides}</div>
                <div>Slides Covered</div>
            </div>
            <div class="stat">
                <div class="stat-number">${data.totalQueries}</div>
                <div>Search Queries</div>
            </div>
            <div class="stat">
                <div class="stat-number">${data.totalImages}</div>
                <div>Images Found</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Math.round(data.totalImages / data.totalSlides)}</div>
                <div>Avg per Slide</div>
            </div>
        </div>

        <div class="attribution">
            <h3>📋 Attribution & License</h3>
            <p><strong>Photo Source:</strong> ${data.pexelsAttribution}</p>
            <p><strong>License:</strong> ${data.licenseInfo}</p>
            <p><strong>Usage:</strong> All images are free for commercial use. Attribution to photographers is appreciated but not required.</p>
        </div>

        ${data.slides.map(slide => `
        <div class="slide-section">
            <div class="slide-header">
                Slide ${slide.slideNumber}: ${slide.slideTitle} (${slide.totalImages} images)
            </div>
            
            ${slide.queries.map(query => `
            <div class="query-group">
                <div class="query-title">🔍 "${query.queryText}" (${query.imageCount} images)</div>
                <div class="image-grid">
                    ${query.images.map(image => `
                    <div class="image-card">
                        <img src="${image.src.medium}" alt="${image.alt}" loading="lazy">
                        <div class="image-info">
                            <div class="photographer">
                                📷 <a href="${image.photographer_url}" target="_blank">${image.photographer}</a>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <small>${image.width} × ${image.height}</small>
                                <a href="${image.src.original}" class="download-btn" target="_blank">Download</a>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    const htmlPath = path.join(CONFIG.OUTPUT_DIR, 'pitch-deck-gallery.html');
    await fs.writeFile(htmlPath, html);
    console.log(`🌐 HTML gallery saved: ${htmlPath}`);
  }

  /**
   * Display summary statistics
   */
  displaySummary() {
    const totalImages = this.results.reduce((sum, slide) => sum + slide.totalImages, 0);
    const totalQueries = this.results.reduce((sum, slide) => sum + slide.queries.length, 0);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RETRIEVAL COMPLETE - SUMMARY STATISTICS');
    console.log('='.repeat(60));
    console.log(`📝 Slides processed: ${this.results.length}`);
    console.log(`🔍 Queries executed: ${totalQueries}`);
    console.log(`📸 Images retrieved: ${totalImages}`);
    console.log(`📱 API requests made: ${this.requestCount}`);
    console.log(`⚡ Avg images per slide: ${Math.round(totalImages / this.results.length)}`);
    console.log(`💰 Estimated manual cost saved: $${(totalImages * 3).toLocaleString()} - $${(totalImages * 10).toLocaleString()}`);
    console.log(`⏱️  Estimated time saved: ${Math.round(totalImages / 10)} - ${Math.round(totalImages / 5)} hours`);
    console.log('='.repeat(60));
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log('🚀 Professional Pitch Deck Image Retriever');
      console.log('🎯 Sourcing high-quality stock images for investor presentation\n');
      
      this.validateConfig();
      await this.ensureOutputDirectory();
      await this.processAllSlides();
      
      console.log('\n📄 Generating output files...');
      const data = await this.generateJsonOutput();
      await this.generateHtmlOutput(data);
      
      this.displaySummary();
      
      console.log('\n✅ Success! Check the output files:');
      console.log(`   📄 JSON: ${path.join(CONFIG.OUTPUT_DIR, 'pitch-deck-images.json')}`);
      console.log(`   🌐 HTML: ${path.join(CONFIG.OUTPUT_DIR, 'pitch-deck-gallery.html')}`);
      console.log('\n💡 Next steps:');
      console.log('   1. Review the HTML gallery in your browser');
      console.log('   2. Download preferred images for each slide');
      console.log('   3. Integrate images into your pitch deck');
      console.log('   4. Include photographer attribution where visible');
      
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const retriever = new PexelsImageRetriever();
  retriever.run();
}

module.exports = PexelsImageRetriever;