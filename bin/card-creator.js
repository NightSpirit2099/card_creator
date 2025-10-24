#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { NodeMeasurementProvider } from '../src/measurement/nodeMeasurementProvider.js';
import { CardLayoutEngine } from '../src/engine/cardLayoutEngine.js';

/**
 * Card Creator CLI
 *
 * Usage:
 *   card-creator <input.json> [options]
 *
 * Options:
 *   -o, --output <file>     Output file (default: layout.json)
 *   -c, --contrast <1-5>    Global contrast (default: 3)
 *   -r, --ratio <1.1-2.0>   Typography ratio (default: 1.25)
 *   -h, --help              Show help
 */

class CardCreatorCLI {
  constructor() {
    this.args = process.argv.slice(2);
    this.options = {
      input: null,
      output: 'layout.json',
      contrast: 3,
      ratio: 1.25
    };
  }

  parseArgs() {
    if (this.args.length === 0 || this.args.includes('-h') || this.args.includes('--help')) {
      this.showHelp();
      process.exit(0);
    }

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];

      if (arg === '-o' || arg === '--output') {
        this.options.output = this.args[++i];
      } else if (arg === '-c' || arg === '--contrast') {
        this.options.contrast = parseFloat(this.args[++i]);
      } else if (arg === '-r' || arg === '--ratio') {
        this.options.ratio = parseFloat(this.args[++i]);
      } else if (!arg.startsWith('-')) {
        this.options.input = arg;
      }
    }

    if (!this.options.input) {
      console.error('❌ Error: Input file required');
      this.showHelp();
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
Card Creator CLI - Adaptive Card Layout Engine

Usage:
  card-creator <input.json> [options]

Options:
  -o, --output <file>     Output file (default: layout.json)
  -c, --contrast <1-5>    Global contrast level (default: 3)
  -r, --ratio <1.1-2.0>   Typography scale ratio (default: 1.25)
  -h, --help              Show this help

Input Format (JSON):
  {
    "blocks": [
      {
        "id": "1",
        "type": "text",
        "order": 1,
        "content": {
          "type": "text",
          "data": { "text": "Your text here" }
        }
      }
    ]
  }

Example:
  card-creator input.json -o output.json -c 4 -r 1.5

For more information, visit: https://github.com/NightSpirit2099/card_creator
`);
  }

  async run() {
    try {
      this.parseArgs();

      console.log('🚀 Card Creator CLI');
      console.log('📂 Input:', this.options.input);
      console.log('📄 Output:', this.options.output);
      console.log('🎨 Contrast:', this.options.contrast);
      console.log('📏 Ratio:', this.options.ratio);
      console.log('');

      // Read input file
      const inputPath = resolve(this.options.input);
      const inputData = await readFile(inputPath, 'utf-8');
      const data = JSON.parse(inputData);

      if (!data.blocks || !Array.isArray(data.blocks)) {
        throw new Error('Input must contain a "blocks" array');
      }

      console.log('📦 Loaded', data.blocks.length, 'blocks');

      // Initialize layout engine
      const measurementProvider = new NodeMeasurementProvider();
      const engine = new CardLayoutEngine(measurementProvider);

      console.log('🔧 Engine:', engine.getProviderInfo().type);

      // Calculate layout
      const config = {
        globalContrast: this.options.contrast,
        typographicRatio: this.options.ratio
      };

      console.log('⚙️  Calculating layout...');
      const result = await engine.calculateLayout(data.blocks, config);

      if (result.isFailure) {
        console.error('❌ Layout calculation failed:', result.error.message);
        process.exit(1);
      }

      console.log('✅ Layout calculated successfully');
      console.log('');
      console.log('📊 Results:');
      console.log('   Base Font Size:', result.value.baseFontSize + 'px');
      console.log('   Line Height:', result.value.lineHeight);
      console.log('   Zoom:', result.value.zoom.toFixed(3));
      console.log('   Strategy:', result.value.strategy);
      console.log('');

      // Write output
      const outputPath = resolve(this.options.output);
      const outputData = JSON.stringify({
        config,
        layout: result.value
      }, null, 2);

      await writeFile(outputPath, outputData, 'utf-8');

      console.log('💾 Output saved to:', this.options.output);
      console.log('✨ Done!');

    } catch (error) {
      console.error('❌ Error:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// Run CLI
const cli = new CardCreatorCLI();
cli.run();
