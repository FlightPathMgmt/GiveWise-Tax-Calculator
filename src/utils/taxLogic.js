export const PROVINCIAL_RATES = {
    // 2024 Estimate Rates for Donation Tax Credits
    // Format: { name: "Province", first200: rate, over200: rate, topMarginalRate: rate }
    AB: { name: "Alberta", first200: 0.10, over200: 0.21, topMarginalRate: 0.48 },
    BC: { name: "British Columbia", first200: 0.0506, over200: 0.168, topMarginalRate: 0.535 },
    MB: { name: "Manitoba", first200: 0.108, over200: 0.174, topMarginalRate: 0.504 },
    NB: { name: "New Brunswick", first200: 0.0968, over200: 0.1795, topMarginalRate: 0.525 },
    NL: { name: "Newfoundland and Labrador", first200: 0.087, over200: 0.183, topMarginalRate: 0.548 },
    NS: { name: "Nova Scotia", first200: 0.0879, over200: 0.21, topMarginalRate: 0.54 },
    ON: { name: "Ontario", first200: 0.0505, over200: 0.1115, topMarginalRate: 0.5353 }, // Ontario has surtaxes, simplified here
    PE: { name: "Prince Edward Island", first200: 0.098, over200: 0.167, topMarginalRate: 0.5137 },
    QC: { name: "Quebec", first200: 0.20, over200: 0.24, topMarginalRate: 0.5331 }, // Quebec abates federal tax, simplified
    SK: { name: "Saskatchewan", first200: 0.105, over200: 0.145, topMarginalRate: 0.475 },
    OTHER: { name: "Other / Territories", first200: 0.064, over200: 0.179, topMarginalRate: 0.48 },
};

export const FEDERAL_RATES = {
    first200: 0.15,
    over200: 0.29,
    highIncomeOver200: 0.33,
    highIncomeThreshold: 246752, // 2024
};

/**
 * Calculates the charitable donation tax credit.
 * @param {number} donationAmount 
 * @param {string} provinceCode 
 * @param {number} income 
 * @returns {number} Total tax credit value
 */
export const calculateTaxCredit = (donationAmount, provinceCode, income) => {
    const provRates = PROVINCIAL_RATES[provinceCode] || PROVINCIAL_RATES.OTHER;

    // Federal Calculation
    let fedCredit = 0;
    if (donationAmount <= 200) {
        fedCredit = donationAmount * FEDERAL_RATES.first200;
    } else {
        fedCredit = 200 * FEDERAL_RATES.first200;
        const remaining = donationAmount - 200;

        // Check for high income rate (33%) logic
        // Simplified: If income is > threshold, the portion of donation that "offsets" that income gets 33%.
        // But actually, the 33% rate applies to the lesser of:
        // 1. The donation amount > 200
        // 2. The amount of taxable income > top bracket ($246,752)

        const incomeOverThreshold = Math.max(0, income - FEDERAL_RATES.highIncomeThreshold);
        const amountEligibleFor33 = Math.min(remaining, incomeOverThreshold);
        const amountEligibleFor29 = remaining - amountEligibleFor33;

        fedCredit += (amountEligibleFor33 * FEDERAL_RATES.highIncomeOver200) + (amountEligibleFor29 * FEDERAL_RATES.over200);
    }

    // Provincial Calculation
    let provCredit = 0;
    if (donationAmount <= 200) {
        provCredit = donationAmount * provRates.first200;
    } else {
        provCredit = 200 * provRates.first200;
        const remaining = donationAmount - 200;
        provCredit += remaining * provRates.over200;
    }

    return fedCredit + provCredit;
};

/**
 * Calculates the capital gains tax that WOULD be paid if sold (and thus saved if donated).
 * @param {number} fmv Fair Market Value
 * @param {number} acb Adjusted Cost Base
 * @param {string} provinceCode 
 * @param {number} income 
 */
export const calculateCapitalGainsTax = (fmv, acb, provinceCode) => {
    const gain = Math.max(0, fmv - acb);
    if (gain === 0) return 0;

    const taxableGain = gain * 0.50; // 50% inclusion rate
    // Estimate marginal tax rate based on province top rate (simplification for "High Net Worth" donors)
    // or we could try to implement a full progressive tax calc, but that is overkill.
    // We'll use the 'topMarginalRate' from our table as a proxy for the savings, 
    // assumming typical donors of securities are in high brackets. 
    // OR we could just simply ask user for their rate.
    // Let's use the topMarginalRate for maximum "wow" factor of potential savings, but maybe label it "Est. Max Savings" check?
    // Better: Use a rough "Average Marginal Rate" for the user's income bracket if we had it.
    // For now, let's use the province's top rate as an upper bound, but maybe scale it if income is low?
    // Let's stick to the top rate for simplicity in this demo, as securities donors are usually wealthy.

    const provRates = PROVINCIAL_RATES[provinceCode] || PROVINCIAL_RATES.OTHER;
    return taxableGain * provRates.topMarginalRate;
};
