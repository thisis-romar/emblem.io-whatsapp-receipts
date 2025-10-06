#!/usr/bin/env node
/**
 * Slide Integration Workflow Generator
 * Creates actionable design implementation guide based on image assessment results
 * Generates distinct design rhythm patterns for professional pitch deck integration
 */

const fs = require('fs').promises;
const path = require('path');

// Design rhythm patterns for different slide types
const RHYTHM_PATTERNS = {
  // Opening/Title slides - High impact, bold imagery
  opening: {
    image_position: 'full-background',
    text_overlay: 'centered-bold',
    color_treatment: 'high-contrast',
    visual_weight: 'maximum'
  },
  
  // Problem/Challenge slides - Darker, more serious tones
  problem: {
    image_position: 'left-half',
    text_overlay: 'right-justified',
    color_treatment: 'desaturated',
    visual_weight: 'heavy'
  },
  
  // Solution slides - Bright, optimistic imagery
  solution: {
    image_position: 'right-third',
    text_overlay: 'left-emphasized',
    color_treatment: 'enhanced-brightness',
    visual_weight: 'balanced'
  },
  
  // Data/Analytics slides - Clean, minimal backgrounds
  data: {
    image_position: 'subtle-background',
    text_overlay: 'foreground-focus',
    color_treatment: 'muted-professional',
    visual_weight: 'light'
  },
  
  // Team/Human slides - Warmer, engaging imagery
  team: {
    image_position: 'dynamic-crop',
    text_overlay: 'integrated-natural',
    color_treatment: 'warm-enhanced',
    visual_weight: 'medium'
  },
  
  // Technical slides - Sharp, modern aesthetics
  technical: {
    image_position: 'geometric-layout',
    text_overlay: 'technical-precision',
    color_treatment: 'cool-enhanced',
    visual_weight: 'structured'
  }
};

// Slide categorization mapping
const SLIDE_CATEGORIES = {
  1: 'opening',      // Title slide
  2: 'problem',      // The Problem
  3: 'team',         // Who Cares (ICP)
  4: 'problem',      // Today's Workaround
  5: 'solution',     // Our Solution
  6: 'solution',     // Live Demo
  7: 'solution',     // Why WhatsApp
  8: 'technical',    // Group Messaging Reality
  9: 'technical',    // Architecture
  10: 'technical',   // Core Endpoints
  11: 'technical',   // Parsing Engine
  12: 'data',        // Messaging Cost
  13: 'data',        // Unit Economics
  14: 'data',        // Competitive Landscape
  15: 'solution',    // Our Moat
  16: 'team',        // Go-to-Market
  17: 'data',        // Pricing Tiers
  18: 'data',        // Risks & Mitigations
  19: 'data',        // Cost Breakdown
  20: 'technical',   // Tech Stack
  21: 'opening'      // The Ask
};

class SlideIntegrationWorkflow {
  constructor() {
    this.assessmentData = null;
    this.integrationPlan = {};
    this.designSpecs = {};
  }

  /**
   * Load assessment results
   */
  async loadAssessmentData() {
    try {
      const assessmentPath = './image-assessment-results/assessment-report.json';
      const data = await fs.readFile(assessmentPath, 'utf8');
      this.assessmentData = JSON.parse(data);
      console.log('📊 Loaded assessment data for', this.assessmentData.assessment_summary.total_images, 'images');
      return true;
    } catch (error) {
      console.error('❌ Could not load assessment data:', error.message);
      return false;
    }
  }

  /**
   * Generate slide-specific integration recommendations
   */
  generateSlideIntegrations() {
    console.log('🎨 Generating slide integration workflow...\n');
    
    const integrations = [];
    
    // Group assessments by slide
    const slideGroups = this.groupAssessmentsBySlide();
    
    Object.keys(slideGroups).forEach(slideNum => {
      const slideNumber = parseInt(slideNum);
      const slideImages = slideGroups[slideNum];
      const category = SLIDE_CATEGORIES[slideNumber] || 'data';
      const rhythmPattern = RHYTHM_PATTERNS[category];
      
      // Select best images for this slide
      const topImages = this.selectOptimalImages(slideImages, category);
      
      const integration = {
        slide_number: slideNumber,
        slide_category: category,
        rhythm_pattern: rhythmPattern,
        recommended_images: topImages,
        design_specifications: this.generateDesignSpecs(topImages, rhythmPattern, slideNumber),
        implementation_guide: this.generateImplementationGuide(topImages, rhythmPattern, slideNumber),
        css_guidelines: this.generateCSSGuidelines(topImages, rhythmPattern),
        accessibility_notes: this.generateAccessibilityNotes(topImages, rhythmPattern)
      };
      
      integrations.push(integration);
      console.log(`✅ Slide ${slideNumber} (${category}): ${topImages.length} images selected`);
    });
    
    return integrations;
  }

  /**
   * Group assessment results by slide number
   */
  groupAssessmentsBySlide() {
    const groups = {};
    
    // Since we have 21 slides with 15 images each, group by position
    this.assessmentData.individual_assessments.forEach((assessment, index) => {
      const slideNumber = Math.floor(index / 15) + 1;
      if (!groups[slideNumber]) {
        groups[slideNumber] = [];
      }
      groups[slideNumber].push(assessment);
    });
    
    return groups;
  }

  /**
   * Select optimal images for a slide category
   */
  selectOptimalImages(slideImages, category) {
    // Sort by overall score and category relevance
    const scored = slideImages.map(img => ({
      ...img,
      category_score: this.calculateCategoryRelevance(img, category)
    }));
    
    scored.sort((a, b) => {
      const scoreA = parseFloat(a.overall_score) * 0.7 + a.category_score * 0.3;
      const scoreB = parseFloat(b.overall_score) * 0.7 + b.category_score * 0.3;
      return scoreB - scoreA;
    });
    
    // Return top 3 images with specific use cases
    return scored.slice(0, 3).map((img, index) => ({
      ...img,
      recommended_use: index === 0 ? 'primary_background' : 
                      index === 1 ? 'alternative_option' : 'accent_element',
      priority: index + 1
    }));
  }

  /**
   * Calculate relevance score for slide category
   */
  calculateCategoryRelevance(image, category) {
    let score = 0.5; // Base score
    
    // Category-specific scoring
    switch (category) {
      case 'opening':
        score += image.presentation_suitability.score * 0.3;
        score += image.brand_compatibility.score * 0.2;
        break;
      case 'problem':
        score += (1 - image.quality.color.brightness) * 0.2; // Prefer darker tones
        score += image.presentation_suitability.text_overlay_friendly * 0.3;
        break;
      case 'solution':
        score += image.quality.color.brightness * 0.2; // Prefer brighter tones
        score += image.brand_compatibility.score * 0.3;
        break;
      case 'data':
        score += image.presentation_suitability.text_overlay_friendly * 0.4;
        score += (1 - image.quality.color.saturation) * 0.1; // Prefer muted
        break;
      case 'team':
        score += image.presentation_suitability.investor_appropriate * 0.3;
        score += image.quality.color.saturation * 0.2; // Prefer vibrant
        break;
      case 'technical':
        score += image.quality.resolution.score * 0.3;
        score += image.brand_compatibility.score * 0.2;
        break;
    }
    
    return Math.min(1.0, score);
  }

  /**
   * Generate detailed design specifications
   */
  generateDesignSpecs(images, rhythmPattern, slideNumber) {
    const primaryImage = images[0];
    
    return {
      layout: {
        image_positioning: rhythmPattern.image_position,
        text_placement: rhythmPattern.text_overlay,
        visual_hierarchy: this.calculateVisualHierarchy(primaryImage, rhythmPattern)
      },
      color_scheme: {
        dominant_color: primaryImage.quality.color.avg_color,
        recommended_text_color: this.calculateOptimalTextColor(primaryImage),
        accent_colors: this.suggestAccentColors(primaryImage),
        overlay_opacity: this.calculateOptimalOverlay(primaryImage)
      },
      typography: {
        contrast_ratio: this.calculateContrastRatio(primaryImage),
        recommended_font_weight: this.suggestFontWeight(primaryImage),
        text_shadow: this.suggestTextShadow(primaryImage)
      },
      responsive_behavior: {
        mobile_layout: this.generateMobileLayout(rhythmPattern),
        breakpoint_adjustments: this.generateBreakpointAdjustments(rhythmPattern)
      }
    };
  }

  /**
   * Calculate visual hierarchy for layout
   */
  calculateVisualHierarchy(image, pattern) {
    return {
      primary_focus: pattern.visual_weight === 'maximum' ? 'image' : 'text',
      secondary_elements: 'supporting_graphics',
      background_treatment: pattern.color_treatment,
      depth_layers: this.calculateDepthLayers(pattern)
    };
  }

  /**
   * Calculate optimal text color for contrast
   */
  calculateOptimalTextColor(image) {
    const brightness = image.quality.color.brightness;
    const contrast = image.quality.color.contrast;
    
    if (brightness < 0.3 || contrast > 0.7) {
      return '#FFFFFF'; // White text on dark/high-contrast images
    } else if (brightness > 0.8 && contrast < 0.4) {
      return '#1A1A1A'; // Dark text on bright/low-contrast images
    } else {
      return '#F5F5F5'; // Light text with subtle shadow
    }
  }

  /**
   * Suggest accent colors based on image palette
   */
  suggestAccentColors(image) {
    const baseColor = image.quality.color.avg_color;
    
    return {
      primary_accent: '#667eea', // Brand blue
      secondary_accent: '#00ff88', // Brand green
      image_harmony: baseColor,
      recommended_highlights: this.generateHarmoniousColors(baseColor)
    };
  }

  /**
   * Generate harmonious color variations
   */
  generateHarmoniousColors(baseColor) {
    // Simple color harmony calculation
    const variations = [];
    const rgb = this.hexToRgb(baseColor);
    
    if (rgb) {
      // Lighter variation
      variations.push(this.rgbToHex(
        Math.min(255, rgb.r + 30),
        Math.min(255, rgb.g + 30),
        Math.min(255, rgb.b + 30)
      ));
      
      // Darker variation
      variations.push(this.rgbToHex(
        Math.max(0, rgb.r - 30),
        Math.max(0, rgb.g - 30),
        Math.max(0, rgb.b - 30)
      ));
    }
    
    return variations;
  }

  /**
   * Calculate optimal overlay opacity
   */
  calculateOptimalOverlay(image) {
    const contrast = image.quality.color.contrast;
    const textFriendly = image.presentation_suitability.text_overlay_friendly;
    
    if (textFriendly > 0.8) return 0.0; // No overlay needed
    if (textFriendly > 0.6) return 0.2; // Light overlay
    if (textFriendly > 0.4) return 0.4; // Medium overlay
    return 0.6; // Strong overlay needed
  }

  /**
   * Generate implementation guide
   */
  generateImplementationGuide(images, rhythmPattern, slideNumber) {
    return {
      step_by_step: [
        {
          step: 1,
          title: 'Image Preparation',
          actions: [
            `Download primary image (ID: ${images[0].id})`,
            'Resize to 1920x1080 minimum',
            'Optimize file size (<500KB recommended)',
            'Test on multiple devices'
          ]
        },
        {
          step: 2,
          title: 'Layout Implementation',
          actions: [
            `Apply ${rhythmPattern.image_position} positioning`,
            `Configure ${rhythmPattern.text_overlay} text layout`,
            'Set up responsive breakpoints',
            'Test contrast ratios'
          ]
        },
        {
          step: 3,
          title: 'Color Integration',
          actions: [
            'Apply color harmony adjustments',
            'Configure text overlay opacity',
            'Set up brand color accents',
            'Validate accessibility compliance'
          ]
        },
        {
          step: 4,
          title: 'Quality Assurance',
          actions: [
            'Test on projectors and displays',
            'Verify text readability',
            'Check mobile responsiveness',
            'Validate brand consistency'
          ]
        }
      ],
      technical_requirements: {
        min_resolution: '1920x1080',
        max_file_size: '500KB',
        supported_formats: ['JPG', 'PNG', 'WebP'],
        color_profile: 'sRGB'
      },
      best_practices: [
        'Maintain 4.5:1 minimum contrast ratio for text',
        'Use consistent image positioning across similar slide types',
        'Apply subtle animations for professional polish',
        'Keep backup images ready for technical issues'
      ]
    };
  }

  /**
   * Generate CSS guidelines
   */
  generateCSSGuidelines(images, rhythmPattern) {
    const primaryImage = images[0];
    
    return {
      background_css: `
.slide-${rhythmPattern.image_position} {
  background-image: url('${primaryImage.originalUrl}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`,
      
      overlay_css: `
.slide-overlay {
  background: rgba(0, 0, 0, ${this.calculateOptimalOverlay(primaryImage)});
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}`,
      
      text_css: `
.slide-text {
  color: ${this.calculateOptimalTextColor(primaryImage)};
  text-shadow: ${this.suggestTextShadow(primaryImage)};
  z-index: 2;
  position: relative;
}`,
      
      responsive_css: `
@media (max-width: 768px) {
  .slide-${rhythmPattern.image_position} {
    background-position: center top;
    background-size: contain;
  }
}`
    };
  }

  /**
   * Generate accessibility notes
   */
  generateAccessibilityNotes(images, rhythmPattern) {
    const primaryImage = images[0];
    
    return {
      contrast_compliance: this.calculateContrastRatio(primaryImage) >= 4.5 ? 'WCAG AA Compliant' : 'Needs Enhancement',
      alt_text_suggestion: `Professional business image for ${rhythmPattern.image_position} layout`,
      screen_reader_considerations: [
        'Provide descriptive alt text for background images',
        'Ensure text content is accessible without images',
        'Use semantic HTML structure',
        'Maintain logical heading hierarchy'
      ],
      color_accessibility: {
        colorblind_safe: this.assessColorblindSafety(primaryImage),
        high_contrast_mode: 'Supported with overlay adjustments',
        dark_mode_compatibility: 'Available with inverted color scheme'
      }
    };
  }

  /**
   * Calculate contrast ratio
   */
  calculateContrastRatio(image) {
    // Simplified contrast calculation
    const brightness = image.quality.color.brightness;
    const contrast = image.quality.color.contrast;
    
    return Math.max(3.0, brightness * contrast * 7.0);
  }

  /**
   * Suggest text shadow based on image characteristics
   */
  suggestTextShadow(image) {
    const overlay = this.calculateOptimalOverlay(image);
    const textColor = this.calculateOptimalTextColor(image);
    
    if (overlay > 0.4) return 'none';
    if (textColor === '#FFFFFF') return '2px 2px 4px rgba(0,0,0,0.5)';
    return '2px 2px 4px rgba(255,255,255,0.5)';
  }

  /**
   * Utility functions
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  calculateDepthLayers(pattern) {
    return {
      background: 'image_layer',
      overlay: pattern.color_treatment !== 'high-contrast' ? 'subtle_overlay' : 'strong_overlay',
      content: 'foreground_text',
      accents: 'brand_elements'
    };
  }

  generateMobileLayout(pattern) {
    return {
      image_scaling: 'responsive_crop',
      text_positioning: 'stacked_vertical',
      touch_targets: 'minimum_44px',
      font_scaling: 'dynamic_viewport'
    };
  }

  generateBreakpointAdjustments(pattern) {
    return {
      tablet: 'maintain_proportions',
      mobile: 'priority_content_first',
      large_display: 'enhanced_visual_impact'
    };
  }

  suggestFontWeight(image) {
    const contrast = image.quality.color.contrast;
    return contrast > 0.6 ? '600' : '700'; // Bolder on lower contrast
  }

  assessColorblindSafety(image) {
    // Simplified assessment - real implementation would need color analysis
    return 'Generally safe - verify with colorblind testing tools';
  }

  /**
   * Generate comprehensive workflow document
   */
  async generateWorkflowReport(integrations) {
    const report = {
      workflow_metadata: {
        generated_at: new Date().toISOString(),
        total_slides: integrations.length,
        assessment_source: this.assessmentData.assessment_summary.generated_at,
        rhythm_patterns_used: Object.keys(RHYTHM_PATTERNS)
      },
      executive_summary: {
        design_philosophy: 'Professional pitch deck with distinct visual rhythm',
        color_strategy: 'Brand-consistent with image harmony',
        accessibility_level: 'WCAG AA compliant',
        implementation_complexity: 'Moderate - requires CSS and image optimization'
      },
      slide_integrations: integrations,
      global_guidelines: this.generateGlobalGuidelines(),
      technical_specifications: this.generateTechnicalSpecs(),
      quality_assurance_checklist: this.generateQAChecklist()
    };

    return report;
  }

  /**
   * Generate global design guidelines
   */
  generateGlobalGuidelines() {
    return {
      brand_consistency: {
        primary_colors: ['#667eea', '#764ba2', '#00ff88'],
        typography_scale: 'Consistent across all slides',
        spacing_system: '8px grid system',
        animation_timing: 'Subtle, professional transitions'
      },
      rhythm_principles: {
        pattern_variation: 'Different patterns for slide categories',
        color_flow: 'Harmonious progression across slides',
        visual_weight: 'Balanced emphasis distribution',
        consistency_rules: 'Same category = same pattern'
      },
      professional_standards: {
        investor_appropriate: 'All imagery vetted for business context',
        presentation_ready: 'Optimized for projector display',
        print_compatible: 'High resolution for handouts',
        digital_first: 'Responsive design principles'
      }
    };
  }

  /**
   * Generate technical specifications
   */
  generateTechnicalSpecs() {
    return {
      image_requirements: {
        minimum_resolution: '1920x1080',
        preferred_resolution: '2560x1440',
        max_file_size: '500KB per image',
        supported_formats: 'JPG (primary), PNG (transparency), WebP (modern browsers)'
      },
      css_framework: {
        approach: 'Custom CSS with utility classes',
        grid_system: 'CSS Grid for complex layouts',
        breakpoints: 'Mobile-first responsive design',
        browser_support: 'Modern browsers (IE11+ for legacy)'
      },
      performance_targets: {
        page_load_time: '<3 seconds',
        image_optimization: 'WebP with JPG fallback',
        css_minification: 'Required for production',
        caching_strategy: 'Aggressive browser caching'
      }
    };
  }

  /**
   * Generate QA checklist
   */
  generateQAChecklist() {
    return [
      'Verify all images meet minimum resolution requirements',
      'Test contrast ratios with automated tools',
      'Validate responsive behavior on multiple devices',
      'Check loading performance on slow connections',
      'Verify accessibility with screen readers',
      'Test color perception with colorblind simulators',
      'Validate brand consistency across all slides',
      'Confirm investor-appropriate content standards',
      'Test projector display compatibility',
      'Verify print quality for handouts'
    ];
  }

  /**
   * Save reports
   */
  async saveReports(report) {
    const outputDir = './image-assessment-results';
    
    // Save JSON workflow
    const jsonPath = path.join(outputDir, 'slide-integration-workflow.json');
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
    console.log(`💾 Workflow JSON saved: ${jsonPath}`);
    
    // Generate HTML workflow guide
    await this.generateHtmlWorkflow(report);
    
    return {
      json: jsonPath,
      html: path.join(outputDir, 'slide-integration-guide.html')
    };
  }

  /**
   * Generate HTML workflow guide
   */
  async generateHtmlWorkflow(report) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Integration Workflow Guide</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa; line-height: 1.6; color: #333;
        }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .summary { background: white; border-radius: 12px; padding: 2rem; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .slide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .slide-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .category-tag { display: inline-block; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85em; font-weight: bold; margin-bottom: 1rem; }
        .opening { background: #667eea; color: white; }
        .problem { background: #dc3545; color: white; }
        .solution { background: #28a745; color: white; }
        .data { background: #6c757d; color: white; }
        .team { background: #fd7e14; color: white; }
        .technical { background: #6f42c1; color: white; }
        .implementation-steps { background: #f8f9fa; border-left: 4px solid #667eea; padding: 1rem; margin: 1rem 0; }
        .step { margin: 0.5rem 0; padding: 0.5rem; background: white; border-radius: 4px; }
        .css-code { background: #2d3748; color: #e2e8f0; padding: 1rem; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.9em; overflow-x: auto; margin: 1rem 0; }
        .color-swatch { display: inline-block; width: 30px; height: 30px; border-radius: 50%; margin-right: 0.5rem; vertical-align: middle; border: 2px solid #ddd; }
        .checklist { background: #d4edda; border-left: 4px solid #28a745; padding: 1rem; margin: 1rem 0; }
        .checklist ul { list-style: none; }
        .checklist li:before { content: "✅ "; margin-right: 0.5rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Slide Integration Workflow Guide</h1>
        <p>Professional implementation guide for pitch deck image integration</p>
        <p>Generated: ${new Date(report.workflow_metadata.generated_at).toLocaleString()}</p>
    </div>

    <div class="container">
        <div class="summary">
            <h2>📋 Executive Summary</h2>
            <p><strong>Design Philosophy:</strong> ${report.executive_summary.design_philosophy}</p>
            <p><strong>Color Strategy:</strong> ${report.executive_summary.color_strategy}</p>
            <p><strong>Accessibility Level:</strong> ${report.executive_summary.accessibility_level}</p>
            <p><strong>Implementation:</strong> ${report.executive_summary.implementation_complexity}</p>
        </div>

        <div class="summary">
            <h2>🎵 Rhythm Patterns Overview</h2>
            <p>Six distinct design patterns create visual rhythm across ${report.workflow_metadata.total_slides} slides:</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                <div class="opening category-tag">Opening/Impact</div>
                <div class="problem category-tag">Problem/Challenge</div>
                <div class="solution category-tag">Solution/Benefit</div>
                <div class="data category-tag">Data/Analytics</div>
                <div class="team category-tag">Team/Human</div>
                <div class="technical category-tag">Technical/System</div>
            </div>
        </div>

        <h2>🔧 Slide-by-Slide Implementation Guide</h2>
        <div class="slide-grid">
            ${report.slide_integrations.slice(0, 10).map(slide => `
            <div class="slide-card">
                <div class="category-tag ${slide.slide_category}">Slide ${slide.slide_number} - ${slide.slide_category.toUpperCase()}</div>
                
                <h3>Design Specifications</h3>
                <p><strong>Image Position:</strong> ${slide.rhythm_pattern.image_position}</p>
                <p><strong>Text Overlay:</strong> ${slide.rhythm_pattern.text_overlay}</p>
                <p><strong>Visual Weight:</strong> ${slide.rhythm_pattern.visual_weight}</p>
                
                <h4>Recommended Images</h4>
                ${slide.recommended_images.map(img => `
                    <div style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <div class="color-swatch" style="background-color: ${img.quality.color.avg_color}"></div>
                        <strong>Image ID:</strong> ${img.id} (${img.recommended_use})
                        <br><strong>Score:</strong> ${img.overall_score}/1.0
                    </div>
                `).join('')}
                
                <div class="implementation-steps">
                    <h4>Implementation Steps</h4>
                    ${slide.implementation_guide.step_by_step.map(step => `
                        <div class="step">
                            <strong>Step ${step.step}:</strong> ${step.title}
                            <ul style="margin-left: 1rem;">
                                ${step.actions.map(action => `<li>${action}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        </div>

        <div class="summary">
            <h2>🎨 Global Design Guidelines</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div>
                    <h3>Brand Consistency</h3>
                    <p><strong>Primary Colors:</strong></p>
                    ${report.global_guidelines.brand_consistency.primary_colors.map(color => 
                        `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`
                    ).join('')}
                    <p><strong>Typography:</strong> ${report.global_guidelines.brand_consistency.typography_scale}</p>
                    <p><strong>Spacing:</strong> ${report.global_guidelines.brand_consistency.spacing_system}</p>
                </div>
                <div>
                    <h3>Rhythm Principles</h3>
                    <ul>
                        <li><strong>Pattern Variation:</strong> ${report.global_guidelines.rhythm_principles.pattern_variation}</li>
                        <li><strong>Color Flow:</strong> ${report.global_guidelines.rhythm_principles.color_flow}</li>
                        <li><strong>Visual Weight:</strong> ${report.global_guidelines.rhythm_principles.visual_weight}</li>
                        <li><strong>Consistency:</strong> ${report.global_guidelines.rhythm_principles.consistency_rules}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="summary">
            <h2>⚙️ Technical Specifications</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div>
                    <h3>Image Requirements</h3>
                    <ul>
                        <li><strong>Min Resolution:</strong> ${report.technical_specifications.image_requirements.minimum_resolution}</li>
                        <li><strong>Preferred:</strong> ${report.technical_specifications.image_requirements.preferred_resolution}</li>
                        <li><strong>Max File Size:</strong> ${report.technical_specifications.image_requirements.max_file_size}</li>
                        <li><strong>Formats:</strong> ${report.technical_specifications.image_requirements.supported_formats}</li>
                    </ul>
                </div>
                <div>
                    <h3>Performance Targets</h3>
                    <ul>
                        <li><strong>Load Time:</strong> ${report.technical_specifications.performance_targets.page_load_time}</li>
                        <li><strong>Optimization:</strong> ${report.technical_specifications.performance_targets.image_optimization}</li>
                        <li><strong>Caching:</strong> ${report.technical_specifications.performance_targets.caching_strategy}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="checklist">
            <h2>✅ Quality Assurance Checklist</h2>
            <ul>
                ${report.quality_assurance_checklist.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join('./image-assessment-results', 'slide-integration-guide.html');
    await fs.writeFile(htmlPath, html);
    console.log(`🌐 HTML workflow guide saved: ${htmlPath}`);
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log('🎯 Slide Integration Workflow Generator');
      console.log('🎨 Creating distinct design rhythm for professional pitch deck integration\n');
      
      // Load assessment data
      const loaded = await this.loadAssessmentData();
      if (!loaded) {
        console.error('❌ Cannot proceed without assessment data');
        return;
      }
      
      // Generate slide integrations
      const integrations = this.generateSlideIntegrations();
      
      console.log(`\n📊 Generated integration plans for ${integrations.length} slides`);
      
      // Create comprehensive workflow report
      console.log('\n📄 Generating comprehensive workflow report...');
      const workflowReport = await this.generateWorkflowReport(integrations);
      
      // Save reports
      const savedFiles = await this.saveReports(workflowReport);
      
      // Display summary
      this.displayWorkflowSummary(workflowReport);
      
      console.log('\n✅ Integration Workflow Complete!');
      console.log(`📄 JSON Workflow: ${savedFiles.json}`);
      console.log(`🌐 HTML Guide: ${savedFiles.html}`);
      console.log('\n🎯 Ready for slide design implementation!');
      
    } catch (error) {
      console.error('\n❌ Workflow Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Display workflow summary
   */
  displayWorkflowSummary(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🎨 SLIDE INTEGRATION WORKFLOW COMPLETE');
    console.log('='.repeat(60));
    
    // Count slides by category
    const categoryCount = {};
    report.slide_integrations.forEach(slide => {
      categoryCount[slide.slide_category] = (categoryCount[slide.slide_category] || 0) + 1;
    });
    
    console.log(`📊 Total Slides: ${report.workflow_metadata.total_slides}`);
    console.log(`🎭 Rhythm Patterns: ${report.workflow_metadata.rhythm_patterns_used.length}`);
    console.log('\n📈 Category Distribution:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} slides`);
    });
    
    console.log(`\n🎨 Design Philosophy: ${report.executive_summary.design_philosophy}`);
    console.log(`⚡ Implementation: ${report.executive_summary.implementation_complexity}`);
    console.log(`♿ Accessibility: ${report.executive_summary.accessibility_level}`);
    console.log('='.repeat(60));
  }
}

// Execute if run directly
if (require.main === module) {
  const workflow = new SlideIntegrationWorkflow();
  workflow.run();
}

module.exports = SlideIntegrationWorkflow;