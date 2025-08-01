export class ContentAnalyzer {
            analyze(blocks) {
                const analysis = {
                    hasImages: false,
                    hasOnlyText: true,
                    textDensity: 0,
                    totalBlocks: blocks.length,
                    dominantType: 'text'
                };
                
                if (blocks.length === 0) {
                    return analysis;
                }
                
                const typeCounts = blocks.reduce((counts, block) => {
                    counts[block.type] = (counts[block.type] || 0) + 1;
                    return counts;
                }, {});
                
                analysis.hasImages = typeCounts.image > 0;
                analysis.hasOnlyText = typeCounts.text === blocks.length;
                analysis.textDensity = (typeCounts.text || 0) / blocks.length;
                
                let maxCount = 0;
                for (const [type, count] of Object.entries(typeCounts)) {
                    if (count > maxCount) {
                        maxCount = count;
                        analysis.dominantType = type;
                    }
                }
                
                return analysis;
            }
        }
        //
