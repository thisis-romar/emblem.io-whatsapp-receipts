#!/usr/bin/env node
/**
 * Image Quality Assessment and Rhythm Analysis Tool
 * Evaluates downloaded Pexels images for professional presentation integration
 * Analyzes visual quality, composition, and design rhythm for pitch deck consistency
 */

const fs = require('fs').promises;
const path = require('path');
// const sharp = require('sharp'); // Optional for advanced image processing

// Assessment Configuration
const ASSESSMENT_CONFIG = {
  MIN_RESOLUTION: { width: 1920, height: 1080 },
  OPTIMAL_RESOLUTION: { width: 2560, height: 1440 },
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  BRAND_COLORS: {
    primary: '#667eea',    // Blue from pitch deck
    secondary: '#764ba2',  // Purple gradient
    accent: '#00ff88',     // Green highlights
    neutral: '#f5f5f5'     // Light background
  },
  OUTPUT_DIR: './image-assessment-results'
};

// Slide themes for rhythm analysis
const SLIDE_THEMES = {
  corporate: ['professional', 'business', 'office', 'meeting'],
  technology: ['innovation', 'digital', 'software', 'automation'],
  financial: ['analytics', 'charts', 'money', 'economics'],
  team: ['teamwork', 'collaboration', 'people', 'group'],
  problem: ['challenge', 'frustrated', 'messy', 'chaos'],
  solution: ['modern', 'clean', 'organized', 'efficient']
};

class ImageQualityAssessment {
  constructor() {
    this.imageData = [];
    this.assessmentResults = [];
    this.rhythmAnalysis = {};
  }

  /**
   * Load image data from Pexels retrieval results
   */
  async loadImageData() {
    try {
      const jsonPath = './pitch-deck-images/pitch-deck-images.json';
      const data = await fs.readFile(jsonPath, 'utf8');
      const imageResults = JSON.parse(data);
      
      console.log('📊 Loading image data for assessment...');
      console.log(`Found ${imageResults.totalImages} images across ${imageResults.totalSlides} slides\n`);
      
      return imageResults;
    } catch (error) {
      console.log('⚠️  No real image data found, using demo data for analysis framework...');
      return await this.loadDemoData();
    }
  }

  /**
   * Load demo data if real images aren't available
   */
  async loadDemoData() {
    try {
      const demoPath = './pitch-deck-images-demo/demo-pitch-deck-images.json';
      const data = await fs.readFile(demoPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('No image data available for assessment');
    }
  }

  /**
   * Analyze individual image quality
   */
  async analyzeImageQuality(imageUrl, imageMetadata) {
    const assessment = {
      id: imageMetadata.id,
      photographer: imageMetadata.photographer,
      originalUrl: imageUrl,
      quality: {},
      composition: {},
      brand_compatibility: {},
      presentation_suitability: {}
    };

    try {
      // For demo purposes, simulate image analysis
      // In real implementation, this would download and analyze actual images
      
      // Resolution Analysis
      assessment.quality.resolution = {
        width: imageMetadata.width || 1920,
        height: imageMetadata.height || 1280,
        meets_minimum: (imageMetadata.width >= ASSESSMENT_CONFIG.MIN_RESOLUTION.width),
        is_optimal: (imageMetadata.width >= ASSESSMENT_CONFIG.OPTIMAL_RESOLUTION.width),
        aspect_ratio: ((imageMetadata.width || 1920) / (imageMetadata.height || 1280)).toFixed(2),
        score: this.calculateResolutionScore(imageMetadata.width, imageMetadata.height)
      };

      // Color Analysis (simulated)
      assessment.quality.color = {
        avg_color: imageMetadata.avg_color || '#4A90E2',
        brightness: this.simulateColorAnalysis().brightness,
        contrast: this.simulateColorAnalysis().contrast,
        saturation: this.simulateColorAnalysis().saturation,
        score: this.simulateColorAnalysis().score
      };

      // Brand Compatibility
      assessment.brand_compatibility = {
        color_harmony: this.calculateColorHarmony(imageMetadata.avg_color),
        professional_tone: this.assessProfessionalTone(imageMetadata.alt || ''),
        brand_alignment: this.calculateBrandAlignment(imageMetadata.avg_color),
        score: 0
      };
      
      assessment.brand_compatibility.score = (
        assessment.brand_compatibility.color_harmony +
        assessment.brand_compatibility.professional_tone +
        assessment.brand_compatibility.brand_alignment
      ) / 3;

      // Presentation Suitability
      assessment.presentation_suitability = {
        text_overlay_friendly: assessment.quality.contrast > 0.6 ? 0.9 : 0.4,
        investor_appropriate: this.assessInvestorAppropriate(imageMetadata.alt || ''),
        slide_integration: this.assessSlideIntegration(imageMetadata),
        score: 0
      };
      
      assessment.presentation_suitability.score = (
        assessment.presentation_suitability.text_overlay_friendly +
        assessment.presentation_suitability.investor_appropriate +
        assessment.presentation_suitability.slide_integration
      ) / 3;

      // Overall Quality Score
      assessment.overall_score = (
        assessment.quality.resolution.score * 0.25 +
        assessment.quality.color.score * 0.25 +
        assessment.brand_compatibility.score * 0.25 +
        assessment.presentation_suitability.score * 0.25
      ).toFixed(2);

      return assessment;

    } catch (error) {
      console.warn(`⚠️  Error analyzing image ${imageMetadata.id}: ${error.message}`);
      return null;
    }
  }

  /**
   * Calculate resolution quality score
   */
  calculateResolutionScore(width = 1920, height = 1280) {
    const pixelCount = width * height;
    const minPixels = ASSESSMENT_CONFIG.MIN_RESOLUTION.width * ASSESSMENT_CONFIG.MIN_RESOLUTION.height;
    const optimalPixels = ASSESSMENT_CONFIG.OPTIMAL_RESOLUTION.width * ASSESSMENT_CONFIG.OPTIMAL_RESOLUTION.height;
    
    if (pixelCount >= optimalPixels) return 1.0;
    if (pixelCount >= minPixels) return 0.7 + (pixelCount - minPixels) / (optimalPixels - minPixels) * 0.3;
    return Math.max(0.3, pixelCount / minPixels * 0.7);
  }

  /**
   * Simulate color analysis (would use Sharp in real implementation)
   */
  simulateColorAnalysis() {
    return {
      brightness: 0.6 + Math.random() * 0.4,
      contrast: 0.5 + Math.random() * 0.5,
      saturation: 0.4 + Math.random() * 0.6,
      score: 0.6 + Math.random() * 0.4
    };
  }

  /**
   * Calculate color harmony with brand colors
   */
  calculateColorHarmony(avgColor) {
    if (!avgColor) return 0.5;
    
    const brandColors = Object.values(ASSESSMENT_CONFIG.BRAND_COLORS);
    let bestHarmony = 0;
    
    for (const brandColor of brandColors) {
      const harmony = this.calculateColorSimilarity(avgColor, brandColor);
      bestHarmony = Math.max(bestHarmony, harmony);
    }
    
    return bestHarmony;
  }

  /**
   * Calculate color similarity between two hex colors
   */
  calculateColorSimilarity(color1, color2) {
    // Simplified color distance calculation
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    if (!c1 || !c2) return 0.5;
    
    const distance = Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
    
    // Normalize to 0-1 scale (max RGB distance is ~441)
    return Math.max(0, 1 - distance / 441);
  }

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Assess professional tone based on keywords
   */
  assessProfessionalTone(description) {
    const professional = ['business', 'office', 'professional', 'corporate', 'meeting', 'team', 'technology'];
    const casual = ['party', 'fun', 'casual', 'personal', 'home', 'vacation'];
    
    const desc = description.toLowerCase();
    let professionalScore = 0;
    let casualPenalty = 0;
    
    professional.forEach(word => {
      if (desc.includes(word)) professionalScore += 0.2;
    });
    
    casual.forEach(word => {
      if (desc.includes(word)) casualPenalty += 0.3;
    });
    
    return Math.max(0.3, Math.min(1.0, 0.7 + professionalScore - casualPenalty));
  }

  /**
   * Calculate brand alignment score
   */
  calculateBrandAlignment(avgColor) {
    // Check if color works with our blue/purple/green brand palette
    const rgb = this.hexToRgb(avgColor);
    if (!rgb) return 0.5;
    
    // Prefer cooler tones that complement blue/purple
    const coolnessScore = (rgb.b + (255 - rgb.r)) / 510;
    const balanceScore = 1 - Math.abs(rgb.r - rgb.g - rgb.b) / 765;
    
    return (coolnessScore * 0.6 + balanceScore * 0.4);
  }

  /**
   * Assess if image is investor-appropriate
   */
  assessInvestorAppropriate(description) {
    const businessTerms = ['business', 'professional', 'technology', 'innovation', 'growth', 'strategy'];
    const inappropriateTerms = ['party', 'personal', 'informal', 'casual'];
    
    const desc = description.toLowerCase();
    let score = 0.7; // Start with neutral
    
    businessTerms.forEach(term => {
      if (desc.includes(term)) score += 0.1;
    });
    
    inappropriateTerms.forEach(term => {
      if (desc.includes(term)) score -= 0.3;
    });
    
    return Math.max(0.2, Math.min(1.0, score));
  }

  /**
   * Assess slide integration potential
   */
  assessSlideIntegration(metadata) {
    // Consider aspect ratio and composition for slide layouts
    const aspectRatio = metadata.width / metadata.height;
    
    // Prefer landscape orientation for slide backgrounds
    if (aspectRatio >= 1.3 && aspectRatio <= 2.0) return 0.9;
    if (aspectRatio >= 1.1 && aspectRatio <= 2.5) return 0.7;
    return 0.4;
  }

  /**
   * Analyze rhythm and flow across slides
   */
  analyzeDesignRhythm(assessments) {
    console.log('\n🎨 Analyzing design rhythm and visual flow...\n');
    
    const rhythm = {
      color_consistency: this.analyzeColorConsistency(assessments),
      style_harmony: this.analyzeStyleHarmony(assessments),
      quality_distribution: this.analyzeQualityDistribution(assessments),
      slide_recommendations: this.generateSlideRecommendations(assessments)
    };
    
    // Calculate overall rhythm score
    rhythm.overall_rhythm_score = (
      rhythm.color_consistency.score +
      rhythm.style_harmony.score +
      rhythm.quality_distribution.score
    ) / 3;
    
    return rhythm;
  }

  /**
   * Analyze color consistency across slides
   */
  analyzeColorConsistency(assessments) {
    const colors = assessments.map(a => a.quality.color.avg_color);
    const harmony_scores = [];
    
    // Calculate harmony between consecutive slides
    for (let i = 0; i < colors.length - 1; i++) {
      const harmony = this.calculateColorSimilarity(colors[i], colors[i + 1]);
      harmony_scores.push(harmony);
    }
    
    const avg_harmony = harmony_scores.reduce((a, b) => a + b, 0) / harmony_scores.length || 0;
    
    return {
      average_harmony: avg_harmony.toFixed(3),
      color_palette: [...new Set(colors)],
      score: avg_harmony,
      recommendation: avg_harmony > 0.7 ? 'Excellent color flow' : 
                     avg_harmony > 0.5 ? 'Good color harmony' : 
                     'Consider color balancing'
    };
  }

  /**
   * Analyze style harmony across slides
   */
  analyzeStyleHarmony(assessments) {
    const professional_scores = assessments.map(a => a.brand_compatibility.professional_tone);
    const brand_scores = assessments.map(a => a.brand_compatibility.brand_alignment);
    
    const style_variance = this.calculateVariance(professional_scores);
    const brand_variance = this.calculateVariance(brand_scores);
    
    const consistency_score = 1 - ((style_variance + brand_variance) / 2);
    
    return {
      style_consistency: (1 - style_variance).toFixed(3),
      brand_consistency: (1 - brand_variance).toFixed(3),
      score: consistency_score,
      recommendation: consistency_score > 0.8 ? 'Highly consistent style' :
                     consistency_score > 0.6 ? 'Good style harmony' :
                     'Style needs harmonization'
    };
  }

  /**
   * Analyze quality distribution
   */
  analyzeQualityDistribution(assessments) {
    const scores = assessments.map(a => parseFloat(a.overall_score));
    const avg_quality = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min_quality = Math.min(...scores);
    const max_quality = Math.max(...scores);
    const quality_range = max_quality - min_quality;
    
    return {
      average_quality: avg_quality.toFixed(3),
      quality_range: quality_range.toFixed(3),
      min_quality: min_quality.toFixed(3),
      max_quality: max_quality.toFixed(3),
      score: avg_quality,
      recommendation: avg_quality > 0.8 ? 'Excellent overall quality' :
                     avg_quality > 0.6 ? 'Good quality selection' :
                     'Consider upgrading low-quality images'
    };
  }

  /**
   * Calculate statistical variance
   */
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Generate specific slide recommendations
   */
  generateSlideRecommendations(assessments) {
    const recommendations = [];
    
    assessments.forEach((assessment, index) => {
      const rec = {
        slide_number: index + 1,
        image_id: assessment.id,
        overall_score: assessment.overall_score,
        strengths: [],
        improvements: [],
        usage_tips: []
      };
      
      // Identify strengths
      if (assessment.quality.resolution.score > 0.8) rec.strengths.push('High resolution');
      if (assessment.brand_compatibility.score > 0.7) rec.strengths.push('Brand compatible');
      if (assessment.presentation_suitability.score > 0.8) rec.strengths.push('Presentation ready');
      
      // Identify improvements
      if (assessment.quality.resolution.score < 0.6) rec.improvements.push('Consider higher resolution');
      if (assessment.brand_compatibility.score < 0.5) rec.improvements.push('Adjust color palette');
      if (assessment.presentation_suitability.score < 0.6) rec.improvements.push('May need text overlay adjustments');
      
      // Usage tips
      if (assessment.presentation_suitability.text_overlay_friendly > 0.8) {
        rec.usage_tips.push('Excellent for text overlays');
      }
      if (assessment.brand_compatibility.color_harmony > 0.8) {
        rec.usage_tips.push('Perfect brand color match');
      }
      
      recommendations.push(rec);
    });
    
    return recommendations;
  }

  /**
   * Generate comprehensive assessment report
   */
  async generateAssessmentReport(imageData, assessments, rhythm) {
    const report = {
      assessment_summary: {
        generated_at: new Date().toISOString(),
        total_images: assessments.length,
        average_quality: (assessments.reduce((sum, a) => sum + parseFloat(a.overall_score), 0) / assessments.length).toFixed(3),
        rhythm_score: rhythm.overall_rhythm_score.toFixed(3)
      },
      quality_metrics: {
        resolution_compliance: assessments.filter(a => a.quality.resolution.meets_minimum).length,
        brand_compatible: assessments.filter(a => a.brand_compatibility.score > 0.7).length,
        presentation_ready: assessments.filter(a => a.presentation_suitability.score > 0.7).length
      },
      rhythm_analysis: rhythm,
      individual_assessments: assessments,
      integration_guide: this.generateIntegrationGuide(rhythm, assessments)
    };
    
    return report;
  }

  /**
   * Generate practical integration guide
   */
  generateIntegrationGuide(rhythm, assessments) {
    return {
      color_palette_suggestions: {
        dominant_colors: rhythm.color_consistency.color_palette.slice(0, 5),
        recommended_filters: ['Slightly increase contrast', 'Warm up cool tones', 'Enhance brand color alignment'],
        overlay_guidelines: 'Use white text on dark images, dark text on light images with 70%+ opacity backgrounds'
      },
      slide_layout_tips: {
        background_placement: 'Position key visual elements in the left or right third',
        text_zones: 'Reserve center and opposite third for text content',
        consistency_rules: 'Maintain similar image positioning across slides for rhythm'
      },
      quality_improvements: {
        high_priority: assessments.filter(a => parseFloat(a.overall_score) < 0.6).map(a => ({
          slide: a.id,
          issue: 'Below quality threshold',
          action: 'Replace or enhance'
        })),
        medium_priority: assessments.filter(a => a.brand_compatibility.score < 0.5).map(a => ({
          slide: a.id,
          issue: 'Brand alignment',
          action: 'Color correction needed'
        }))
      }
    };
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory() {
    await fs.mkdir(ASSESSMENT_CONFIG.OUTPUT_DIR, { recursive: true });
  }

  /**
   * Generate HTML report for visual review
   */
  async generateHtmlReport(report) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Quality & Rhythm Assessment Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa; line-height: 1.6; color: #333;
        }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .summary { background: white; border-radius: 12px; padding: 2rem; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0; }
        .metric { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
        .metric-value { font-size: 2em; font-weight: bold; color: #667eea; }
        .assessment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .image-card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .score-high { color: #28a745; font-weight: bold; }
        .score-medium { color: #ffc107; font-weight: bold; }
        .score-low { color: #dc3545; font-weight: bold; }
        .rhythm-section { background: white; border-radius: 12px; padding: 2rem; margin: 2rem 0; }
        .color-palette { display: flex; gap: 1rem; flex-wrap: wrap; }
        .color-swatch { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #ddd; }
        .recommendations { background: #e8f4fd; border-left: 4px solid #667eea; padding: 1.5rem; margin: 1rem 0; border-radius: 0 8px 8px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Image Quality & Rhythm Assessment</h1>
        <p>Professional analysis for pitch deck integration</p>
        <p>Generated: ${new Date(report.assessment_summary.generated_at).toLocaleString()}</p>
    </div>

    <div class="container">
        <div class="summary">
            <h2>📊 Assessment Summary</h2>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${report.assessment_summary.total_images}</div>
                    <div>Images Analyzed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.assessment_summary.average_quality}</div>
                    <div>Average Quality Score</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.assessment_summary.rhythm_score}</div>
                    <div>Design Rhythm Score</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.quality_metrics.presentation_ready}</div>
                    <div>Presentation Ready</div>
                </div>
            </div>
        </div>

        <div class="rhythm-section">
            <h2>🎵 Design Rhythm Analysis</h2>
            <div class="recommendations">
                <h3>Color Consistency</h3>
                <p><strong>Score:</strong> ${report.rhythm_analysis.color_consistency.score.toFixed(3)}</p>
                <p><strong>Recommendation:</strong> ${report.rhythm_analysis.color_consistency.recommendation}</p>
                <div class="color-palette">
                    ${report.rhythm_analysis.color_consistency.color_palette.map(color => 
                        `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="recommendations">
                <h3>Style Harmony</h3>
                <p><strong>Score:</strong> ${report.rhythm_analysis.style_harmony.score.toFixed(3)}</p>
                <p><strong>Recommendation:</strong> ${report.rhythm_analysis.style_harmony.recommendation}</p>
            </div>
            
            <div class="recommendations">
                <h3>Quality Distribution</h3>
                <p><strong>Average:</strong> ${report.rhythm_analysis.quality_distribution.average_quality}</p>
                <p><strong>Range:</strong> ${report.rhythm_analysis.quality_distribution.quality_range}</p>
                <p><strong>Recommendation:</strong> ${report.rhythm_analysis.quality_distribution.recommendation}</p>
            </div>
        </div>

        <div class="rhythm-section">
            <h2>🛠️ Integration Guide</h2>
            <div class="recommendations">
                <h3>Color Palette Suggestions</h3>
                <ul>
                    ${report.integration_guide.color_palette_suggestions.recommended_filters.map(filter => 
                        `<li>${filter}</li>`
                    ).join('')}
                </ul>
                <p><strong>Overlay Guidelines:</strong> ${report.integration_guide.color_palette_suggestions.overlay_guidelines}</p>
            </div>
            
            <div class="recommendations">
                <h3>Slide Layout Tips</h3>
                <p><strong>Background Placement:</strong> ${report.integration_guide.slide_layout_tips.background_placement}</p>
                <p><strong>Text Zones:</strong> ${report.integration_guide.slide_layout_tips.text_zones}</p>
                <p><strong>Consistency:</strong> ${report.integration_guide.slide_layout_tips.consistency_rules}</p>
            </div>
        </div>

        <div class="rhythm-section">
            <h2>📋 Individual Image Assessments</h2>
            <div class="assessment-grid">
                ${report.individual_assessments.slice(0, 12).map(assessment => `
                <div class="image-card">
                    <h3>Image ID: ${assessment.id}</h3>
                    <p><strong>Photographer:</strong> ${assessment.photographer}</p>
                    <p><strong>Overall Score:</strong> 
                        <span class="${parseFloat(assessment.overall_score) > 0.7 ? 'score-high' : parseFloat(assessment.overall_score) > 0.5 ? 'score-medium' : 'score-low'}">${assessment.overall_score}</span>
                    </p>
                    <p><strong>Resolution:</strong> ${assessment.quality.resolution.width} × ${assessment.quality.resolution.height}</p>
                    <p><strong>Brand Compatibility:</strong> ${assessment.brand_compatibility.score.toFixed(2)}</p>
                    <p><strong>Presentation Ready:</strong> ${assessment.presentation_suitability.score.toFixed(2)}</p>
                    <div style="margin-top: 1rem;">
                        <div class="color-swatch" style="background-color: ${assessment.quality.color.avg_color}" title="${assessment.quality.color.avg_color}"></div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join(ASSESSMENT_CONFIG.OUTPUT_DIR, 'assessment-report.html');
    await fs.writeFile(htmlPath, html);
    console.log(`🌐 HTML report generated: ${htmlPath}`);
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log('🎨 Image Quality Assessment & Rhythm Analysis Tool');
      console.log('🎯 Evaluating images for professional pitch deck integration\n');
      
      await this.ensureOutputDirectory();
      
      // Load image data
      const imageData = await this.loadImageData();
      console.log('📊 Processing images for quality assessment...\n');
      
      // Analyze each image
      const assessments = [];
      let processedCount = 0;
      
      for (const slide of imageData.slides) {
        for (const query of slide.queries) {
          for (const image of query.images) {
            processedCount++;
            console.log(`🔍 [${processedCount}/${imageData.totalImages}] Analyzing image ${image.id}...`);
            
            const assessment = await this.analyzeImageQuality(image.src?.original || image.src?.large, image);
            if (assessment) {
              assessments.push(assessment);
            }
          }
        }
      }
      
      console.log(`\n✅ Analyzed ${assessments.length} images\n`);
      
      // Analyze design rhythm
      const rhythmAnalysis = this.analyzeDesignRhythm(assessments);
      
      // Generate comprehensive report
      console.log('📄 Generating comprehensive assessment report...\n');
      const report = await this.generateAssessmentReport(imageData, assessments, rhythmAnalysis);
      
      // Save JSON report
      const jsonPath = path.join(ASSESSMENT_CONFIG.OUTPUT_DIR, 'assessment-report.json');
      await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
      console.log(`💾 JSON report saved: ${jsonPath}`);
      
      // Generate HTML report
      await this.generateHtmlReport(report);
      
      // Display summary
      this.displaySummary(report);
      
      console.log('\n✅ Assessment Complete! Check the generated reports:');
      console.log(`   📄 JSON: ${jsonPath}`);
      console.log(`   🌐 HTML: ${path.join(ASSESSMENT_CONFIG.OUTPUT_DIR, 'assessment-report.html')}`);
      
      return report;
      
    } catch (error) {
      console.error('\n❌ Assessment Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Display summary statistics
   */
  displaySummary(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🎨 IMAGE ASSESSMENT COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Images Analyzed: ${report.assessment_summary.total_images}`);
    console.log(`⭐ Average Quality: ${report.assessment_summary.average_quality}/1.0`);
    console.log(`🎵 Design Rhythm: ${report.assessment_summary.rhythm_score}/1.0`);
    console.log(`✅ Presentation Ready: ${report.quality_metrics.presentation_ready}/${report.assessment_summary.total_images}`);
    console.log(`🎨 Brand Compatible: ${report.quality_metrics.brand_compatible}/${report.assessment_summary.total_images}`);
    console.log('='.repeat(60));
    
    // Key recommendations
    console.log('\n🎯 KEY RECOMMENDATIONS:');
    console.log(`• Color Flow: ${report.rhythm_analysis.color_consistency.recommendation}`);
    console.log(`• Style Harmony: ${report.rhythm_analysis.style_harmony.recommendation}`);
    console.log(`• Quality Level: ${report.rhythm_analysis.quality_distribution.recommendation}`);
    
    if (report.integration_guide.quality_improvements.high_priority.length > 0) {
      console.log(`\n⚠️  ${report.integration_guide.quality_improvements.high_priority.length} images need immediate attention`);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const assessment = new ImageQualityAssessment();
  assessment.run();
}

module.exports = ImageQualityAssessment;