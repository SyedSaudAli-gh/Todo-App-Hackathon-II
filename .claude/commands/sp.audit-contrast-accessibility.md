# Skill: Audit Contrast Accessibility

## Purpose
Systematically audit and fix color contrast issues in light and dark themes to ensure WCAG 2.1 AA/AAA compliance, improve readability for users with visual impairments, and create an inclusive user experience.

## When to Use
- After completing `setup-theme-provider` skill
- Before deploying application to production
- When users report readability issues
- During design system implementation
- After adding new color combinations
- When implementing new UI components
- As part of regular accessibility audits
- When targeting WCAG compliance certification

## Inputs
- Existing theme CSS variables and color palette
- WCAG compliance level target (AA or AAA)
- List of text/background color combinations used in app
- Design system documentation
- Browser DevTools or accessibility testing tools
- Component library with all UI elements

## Step-by-Step Process

### 1. Create Contrast Checker Utility
Create `web/src/lib/theme/contrast-checker.ts`:
```typescript
/**
 * WCAG contrast ratio calculator and checker.
 */

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

/**
 * Convert hex color to RGB.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert HSL to RGB.
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Calculate relative luminance.
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors.
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Parse colors
  let rgb1 = hexToRgb(color1);
  let rgb2 = hexToRgb(color2);

  // If hex parsing failed, try HSL format
  if (!rgb1) {
    const hslMatch = color1.match(/hsl\((\d+),?\s*(\d+)%?,?\s*(\d+)%?\)/);
    if (hslMatch) {
      rgb1 = hslToRgb(
        parseInt(hslMatch[1]),
        parseInt(hslMatch[2]),
        parseInt(hslMatch[3])
      );
    }
  }

  if (!rgb2) {
    const hslMatch = color2.match(/hsl\((\d+),?\s*(\d+)%?,?\s*(\d+)%?\)/);
    if (hslMatch) {
      rgb2 = hslToRgb(
        parseInt(hslMatch[1]),
        parseInt(hslMatch[2]),
        parseInt(hslMatch[3])
      );
    }
  }

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }

  // Calculate luminance
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  // Calculate contrast ratio
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards.
 */
export function checkContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    passesAA: isLargeText ? ratio >= 3 : ratio >= 4.5,
    passesAAA: isLargeText ? ratio >= 4.5 : ratio >= 7,
    passesAALarge: ratio >= 3,
    passesAAALarge: ratio >= 4.5,
  };
}

/**
 * Get WCAG level for contrast ratio.
 */
export function getWCAGLevel(ratio: number, isLargeText: boolean = false): string {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  } else {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
}
```

### 2. Create Theme Audit Component
Create `web/src/components/theme/ThemeAudit.tsx`:
```typescript
'use client';

import { useTheme } from '@/lib/theme';
import { checkContrast } from '@/lib/theme/contrast-checker';
import { useEffect, useState } from 'react';

interface ColorPair {
  name: string;
  foreground: string;
  background: string;
  isLargeText?: boolean;
  usage: string;
}

/**
 * Theme audit component for testing contrast ratios.
 */
export function ThemeAudit() {
  const { resolvedTheme } = useTheme();
  const [colorPairs, setColorPairs] = useState<ColorPair[]>([]);
  const [results, setResults] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    // Get computed CSS variables
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    const getColor = (varName: string): string => {
      const value = styles.getPropertyValue(varName).trim();
      // Convert HSL to RGB for contrast calculation
      if (value.includes(' ')) {
        const [h, s, l] = value.split(' ').map((v) => parseFloat(v));
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
      return value;
    };

    // Define color pairs to test
    const pairs: ColorPair[] = [
      {
        name: 'Body Text',
        foreground: getColor('--foreground'),
        background: getColor('--background'),
        usage: 'Main body text on page background',
      },
      {
        name: 'Card Text',
        foreground: getColor('--card-foreground'),
        background: getColor('--card'),
        usage: 'Text on card backgrounds',
      },
      {
        name: 'Primary Button',
        foreground: getColor('--primary-foreground'),
        background: getColor('--primary'),
        usage: 'Primary button text',
      },
      {
        name: 'Secondary Button',
        foreground: getColor('--secondary-foreground'),
        background: getColor('--secondary'),
        usage: 'Secondary button text',
      },
      {
        name: 'Muted Text',
        foreground: getColor('--muted-foreground'),
        background: getColor('--background'),
        usage: 'Muted/secondary text',
      },
      {
        name: 'Destructive Button',
        foreground: getColor('--destructive-foreground'),
        background: getColor('--destructive'),
        usage: 'Delete/danger button text',
      },
      {
        name: 'Accent Text',
        foreground: getColor('--accent-foreground'),
        background: getColor('--accent'),
        usage: 'Accent/highlight text',
      },
    ];

    setColorPairs(pairs);

    // Calculate contrast for each pair
    const newResults = new Map();
    pairs.forEach((pair) => {
      try {
        const result = checkContrast(
          pair.foreground,
          pair.background,
          pair.isLargeText
        );
        newResults.set(pair.name, result);
      } catch (error) {
        console.error(`Error checking contrast for ${pair.name}:`, error);
      }
    });

    setResults(newResults);
  }, [resolvedTheme]);

  const getStatusColor = (passes: boolean): string => {
    return passes ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getStatusIcon = (passes: boolean): string => {
    return passes ? '✓' : '✗';
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Theme Accessibility Audit
        </h1>
        <p className="text-muted-foreground">
          Current theme: <strong>{resolvedTheme}</strong>
        </p>
      </div>

      <div className="space-y-6">
        {colorPairs.map((pair) => {
          const result = results.get(pair.name);
          if (!result) return null;

          return (
            <div
              key={pair.name}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {pair.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pair.usage}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {result.ratio.toFixed(2)}:1
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contrast Ratio
                  </div>
                </div>
              </div>

              {/* Color preview */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div
                    className="h-16 rounded border border-border flex items-center justify-center text-sm font-medium"
                    style={{
                      backgroundColor: pair.background,
                      color: pair.foreground,
                    }}
                  >
                    Sample Text
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    FG: {pair.foreground}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    BG: {pair.background}
                  </p>
                </div>
              </div>

              {/* WCAG compliance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">
                    Normal Text (16px)
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(result.passesAA)}>
                        {getStatusIcon(result.passesAA)}
                      </span>
                      <span className="text-sm">WCAG AA (4.5:1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(result.passesAAA)}>
                        {getStatusIcon(result.passesAAA)}
                      </span>
                      <span className="text-sm">WCAG AAA (7:1)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">
                    Large Text (18px+)
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(result.passesAALarge)}>
                        {getStatusIcon(result.passesAALarge)}
                      </span>
                      <span className="text-sm">WCAG AA (3:1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(result.passesAAALarge)}>
                        {getStatusIcon(result.passesAAALarge)}
                      </span>
                      <span className="text-sm">WCAG AAA (4.5:1)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Audit Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {Array.from(results.values()).filter((r) => r.passesAA).length}/
              {results.size}
            </div>
            <div className="text-sm text-muted-foreground">Pass WCAG AA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {Array.from(results.values()).filter((r) => r.passesAAA).length}/
              {results.size}
            </div>
            <div className="text-sm text-muted-foreground">Pass WCAG AAA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Create Automated Audit Script
Create `web/scripts/audit-theme-contrast.ts`:
```typescript
/**
 * Automated theme contrast audit script.
 * Run with: npx tsx scripts/audit-theme-contrast.ts
 */

import { getContrastRatio, getWCAGLevel } from '../src/lib/theme/contrast-checker';

interface ColorPair {
  name: string;
  foreground: string;
  background: string;
  isLargeText?: boolean;
}

// Define color pairs from CSS variables
const lightTheme: ColorPair[] = [
  { name: 'Body Text', foreground: 'hsl(222.2, 84%, 4.9%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Card Text', foreground: 'hsl(222.2, 84%, 4.9%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Primary Button', foreground: 'hsl(210, 40%, 98%)', background: 'hsl(221.2, 83.2%, 53.3%)' },
  { name: 'Secondary Button', foreground: 'hsl(222.2, 47.4%, 11.2%)', background: 'hsl(210, 40%, 96.1%)' },
  { name: 'Muted Text', foreground: 'hsl(215.4, 16.3%, 46.9%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Destructive Button', foreground: 'hsl(210, 40%, 98%)', background: 'hsl(0, 84.2%, 60.2%)' },
];

const darkTheme: ColorPair[] = [
  { name: 'Body Text', foreground: 'hsl(210, 40%, 98%)', background: 'hsl(222.2, 84%, 4.9%)' },
  { name: 'Card Text', foreground: 'hsl(210, 40%, 98%)', background: 'hsl(222.2, 84%, 4.9%)' },
  { name: 'Primary Button', foreground: 'hsl(222.2, 47.4%, 11.2%)', background: 'hsl(217.2, 91.2%, 59.8%)' },
  { name: 'Secondary Button', foreground: 'hsl(210, 40%, 98%)', background: 'hsl(217.2, 32.6%, 17.5%)' },
  { name: 'Muted Text', foreground: 'hsl(215, 20.2%, 65.1%)', background: 'hsl(222.2, 84%, 4.9%)' },
  { name: 'Destructive Button', foreground: 'hsl(210, 40%, 98%)', background: 'hsl(0, 62.8%, 30.6%)' },
];

function auditTheme(themeName: string, pairs: ColorPair[]) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${themeName.toUpperCase()} THEME AUDIT`);
  console.log('='.repeat(60));

  let passAA = 0;
  let passAAA = 0;

  pairs.forEach((pair) => {
    try {
      const ratio = getContrastRatio(pair.foreground, pair.background);
      const level = getWCAGLevel(ratio, pair.isLargeText);

      const passesAA = pair.isLargeText ? ratio >= 3 : ratio >= 4.5;
      const passesAAA = pair.isLargeText ? ratio >= 4.5 : ratio >= 7;

      if (passesAA) passAA++;
      if (passesAAA) passAAA++;

      const status = passesAA ? '✓' : '✗';
      const statusColor = passesAA ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';

      console.log(`\n${pair.name}:`);
      console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1`);
      console.log(`  WCAG Level: ${level}`);
      console.log(`  ${statusColor}${status} AA${reset} | ${passesAAA ? '✓' : '✗'} AAA`);
    } catch (error) {
      console.error(`  Error: ${error}`);
    }
  });

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Summary: ${passAA}/${pairs.length} pass AA, ${passAAA}/${pairs.length} pass AAA`);
  console.log('='.repeat(60));
}

// Run audits
auditTheme('Light', lightTheme);
auditTheme('Dark', darkTheme);

console.log('\n✨ Audit complete!\n');
```

### 4. Create Contrast Fixer Utility
Create `web/src/lib/theme/contrast-fixer.ts`:
```typescript
/**
 * Utility to suggest color adjustments for better contrast.
 */

import { getContrastRatio } from './contrast-checker';

/**
 * Adjust lightness of HSL color to meet target contrast ratio.
 */
export function adjustLightnessForContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5,
  maxIterations: number = 100
): string | null {
  // Parse HSL foreground color
  const hslMatch = foreground.match(/hsl\((\d+),?\s*(\d+)%?,?\s*(\d+)%?\)/);
  if (!hslMatch) return null;

  let h = parseInt(hslMatch[1]);
  let s = parseInt(hslMatch[2]);
  let l = parseInt(hslMatch[3]);

  // Try adjusting lightness
  for (let i = 0; i < maxIterations; i++) {
    const testColor = `hsl(${h}, ${s}%, ${l}%)`;
    const ratio = getContrastRatio(testColor, background);

    if (ratio >= targetRatio) {
      return testColor;
    }

    // Adjust lightness based on whether we need more or less contrast
    const currentRatio = getContrastRatio(foreground, background);
    if (currentRatio < targetRatio) {
      // Need more contrast - make lighter or darker
      if (l > 50) {
        l = Math.min(100, l + 1);
      } else {
        l = Math.max(0, l - 1);
      }
    }
  }

  return null;
}

/**
 * Suggest color adjustments for failing contrast pairs.
 */
export function suggestContrastFix(
  foreground: string,
  background: string,
  targetLevel: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): {
  original: string;
  suggested: string | null;
  originalRatio: number;
  suggestedRatio: number | null;
} {
  const targetRatio = isLargeText
    ? targetLevel === 'AAA' ? 4.5 : 3
    : targetLevel === 'AAA' ? 7 : 4.5;

  const originalRatio = getContrastRatio(foreground, background);
  const suggested = adjustLightnessForContrast(foreground, background, targetRatio);
  const suggestedRatio = suggested ? getContrastRatio(suggested, background) : null;

  return {
    original: foreground,
    suggested,
    originalRatio,
    suggestedRatio,
  };
}
```

### 5. Add Audit Route
Create `web/src/app/theme-audit/page.tsx`:
```typescript
import { ThemeAudit } from '@/components/theme/ThemeAudit';

export default function ThemeAuditPage() {
  return <ThemeAudit />;
}
```

### 6. Create Accessibility Documentation
Create `web/docs/accessibility.md`:
```markdown
# Theme Accessibility Guidelines

## WCAG Contrast Requirements

### Level AA (Minimum)
- **Normal text** (< 18px): 4.5:1 contrast ratio
- **Large text** (≥ 18px or ≥ 14px bold): 3:1 contrast ratio

### Level AAA (Enhanced)
- **Normal text**: 7:1 contrast ratio
- **Large text**: 4.5:1 contrast ratio

## Color Palette Audit Results

### Light Theme
- ✓ Body text: 16.5:1 (AAA)
- ✓ Primary button: 4.8:1 (AA)
- ✓ Muted text: 4.6:1 (AA)
- ✗ Secondary button: 3.2:1 (Fail) - **Needs adjustment**

### Dark Theme
- ✓ Body text: 15.2:1 (AAA)
- ✓ Primary button: 5.1:1 (AA)
- ✓ Muted text: 4.9:1 (AA)
- ✓ Secondary button: 4.5:1 (AA)

## Testing Tools

1. **Browser DevTools**: Chrome/Firefox Accessibility Inspector
2. **Automated**: `npm run audit:contrast`
3. **Manual**: `/theme-audit` page in development
4. **External**: WebAIM Contrast Checker, Stark plugin

## Best Practices

1. Test all text/background combinations
2. Check both light and dark themes
3. Test with actual content, not just samples
4. Consider users with color blindness
5. Don't rely on color alone for information
6. Provide sufficient contrast for focus indicators
7. Test with browser zoom at 200%
8. Verify contrast in different lighting conditions

## Common Issues and Fixes

### Issue: Muted text too light
**Fix**: Increase saturation or decrease lightness
```css
/* Before */
--muted-foreground: 215.4 16.3% 46.9%;

/* After */
--muted-foreground: 215.4 20% 40%;
```

### Issue: Button text on colored background
**Fix**: Use white or very dark text, avoid mid-tones
```css
/* Good */
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%; /* Very light */

/* Bad */
--primary-foreground: 210 40% 70%; /* Mid-tone */
```

## Continuous Monitoring

- Run `npm run audit:contrast` before each release
- Add contrast checks to CI/CD pipeline
- Review new color combinations in design phase
- Test with real users who have visual impairments
```

### 7. Add NPM Script for Audit
Update `web/package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "audit:contrast": "tsx scripts/audit-theme-contrast.ts"
  }
}
```

### 8. Test Contrast Audit
1. Navigate to `/theme-audit` in development
2. Review all color pair contrast ratios
3. Identify failing combinations
4. Run automated script: `npm run audit:contrast`
5. Fix failing colors in `theme-variables.css`
6. Re-test until all pairs pass AA (or AAA)
7. Document results in accessibility.md
8. Test with screen readers and browser accessibility tools

## Output
- ✅ Contrast checker utility with WCAG calculations
- ✅ Visual theme audit component
- ✅ Automated audit script for CI/CD
- ✅ Contrast fixer utility with suggestions
- ✅ Accessibility documentation
- ✅ NPM script for running audits
- ✅ All color pairs tested for WCAG compliance
- ✅ Failing combinations identified and fixed
- ✅ Both light and dark themes audited
- ✅ Continuous monitoring process established

## Failure Handling

### Error: "Contrast calculation returns NaN"
**Solution**:
1. Verify color format is valid (hex or HSL)
2. Check for missing color values
3. Add error handling for invalid colors
4. Test with known good color pairs first

### Error: "Can't fix contrast automatically"
**Solution**:
1. Manual adjustment may be needed
2. Try adjusting saturation instead of lightness
3. Consider using a different base color
4. Consult with designer for brand-compliant alternatives

### Error: "Audit shows different results than browser tools"
**Solution**:
1. Verify color values match exactly
2. Check for CSS variable inheritance issues
3. Test with computed styles, not declared values
4. Use browser DevTools as source of truth

### Error: "Theme passes audit but looks bad"
**Solution**:
1. WCAG is minimum, not optimal
2. Consider higher contrast for better readability
3. Test with real users and content
4. Balance accessibility with aesthetics

### Error: "Dark theme fails but light theme passes"
**Solution**:
1. Dark themes often need higher contrast
2. Adjust dark theme colors independently
3. Don't mirror light theme values exactly
4. Test dark theme in actual dark environment

## Validation Checklist
- [ ] Contrast checker utility created
- [ ] ThemeAudit component created
- [ ] Automated audit script created
- [ ] Contrast fixer utility created
- [ ] Audit route added to app
- [ ] Accessibility documentation created
- [ ] NPM script added for audits
- [ ] All color pairs tested
- [ ] Light theme passes WCAG AA
- [ ] Dark theme passes WCAG AA
- [ ] Failing combinations fixed
- [ ] Focus indicators have sufficient contrast
- [ ] Border colors have sufficient contrast
- [ ] Disabled states are distinguishable
- [ ] Error states are clearly visible
- [ ] Success states are clearly visible

## Best Practices
- Aim for WCAG AAA when possible, AA minimum
- Test with actual content, not lorem ipsum
- Consider users with color blindness (use tools like Color Oracle)
- Don't rely on color alone to convey information
- Provide text alternatives for color-coded information
- Test in different lighting conditions
- Use browser DevTools accessibility inspector
- Run automated audits in CI/CD pipeline
- Document all color decisions and rationale
- Involve users with disabilities in testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify focus indicators are visible
- Check contrast at different zoom levels (up to 200%)
- Test on different displays (laptop, mobile, high-contrast mode)
- Keep accessibility documentation up to date
