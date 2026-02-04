import { describe, it, expect } from 'vitest';
import { calculateTaxCredit, calculateCapitalGainsTax } from './taxLogic';

describe('Tax Logic', () => {
    it('calculates tax credit for $200 in Ontario correctly', () => {
        // Fed: 200 * 0.15 = 30
        // Ont: 200 * 0.0505 = 10.10
        // Total: 40.10
        const credit = calculateTaxCredit(200, 'ON', 50000);
        expect(credit).toBeCloseTo(40.10, 2);
    });

    it('calculates tax credit for $1000 in Ontario correctly', () => {
        // Fed: 30 + (800 * 0.29 = 232) = 262
        // Ont: 10.10 + (800 * 0.1115 = 89.20) = 99.30
        // Total: 361.30
        const credit = calculateTaxCredit(1000, 'ON', 80000); // Income < 200k
        expect(credit).toBeCloseTo(361.30, 2);
    });

    it('calculates capital gains tax saved correctly', () => {
        // FMV 1000, ACB 500. Gain 500.
        // Taxable Gain = 250.
        // ON Top Rate = 0.5353
        // Saved = 250 * 0.5353 = 133.825
        const saved = calculateCapitalGainsTax(1000, 500, 'ON');
        expect(saved).toBeCloseTo(133.825, 2);
    });

    it('calculates High Income Federal Credit correctly', () => {
        // Income 300,000 (Over 246,752 threshold by 53,248)
        // Donation 1,000 (Over 200 by 800)
        // The 800 is fully covered by the 53,248 excess income.
        // So 800 * 0.33 (instead of 0.29)
        // Fed: 30 (first 200) + 264 (800 * .33) = 294
        // Prov (ON): 99.30 (Unchanged)
        // Total: 393.30

        const credit = calculateTaxCredit(1000, 'ON', 300000);
        expect(credit).toBeCloseTo(393.30, 2);
    });
});
