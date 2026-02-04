import React, { useState, useEffect } from 'react';
import { calculateTaxCredit, calculateCapitalGainsTax, PROVINCIAL_RATES } from '../utils/taxLogic';
import { Info, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

const Calculator = () => {
    const [donationAmount, setDonationAmount] = useState(1000);
    const [province, setProvince] = useState('ON');
    const [income, setIncome] = useState(100000); // Default $100k
    const [shareType, setShareType] = useState('cash'); // 'cash' or 'securities'
    const [acb, setAcb] = useState(500); // Adjusted Cost Base

    const [results, setResults] = useState({
        taxCredit: 0,
        capitalGainsTax: 0,
        netCost: 0,
    });

    useEffect(() => {
        const credit = calculateTaxCredit(donationAmount, province, income);
        let capGainsSaved = 0;

        if (shareType === 'securities') {
            capGainsSaved = calculateCapitalGainsTax(donationAmount, acb, province);
        }

        const net = donationAmount - credit - capGainsSaved;

        setResults({
            taxCredit: credit,
            capitalGainsTax: capGainsSaved,
            netCost: net,
        });
    }, [donationAmount, province, income, shareType, acb]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
            <div className="md:grid md:grid-cols-2">
                {/* Input Section */}
                <div className="p-8 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <DollarSign className="text-givewise-gold fill-givewise-gold" />
                        Your Donation
                    </h2>

                    <div className="space-y-6">
                        {/* Donation Type Toggle */}
                        <div className="bg-white p-1 rounded-full shadow-sm inline-flex border border-gray-200">
                            <button
                                onClick={() => setShareType('cash')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${shareType === 'cash'
                                        ? 'bg-givewise-blue text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Cash
                            </button>
                            <button
                                onClick={() => setShareType('securities')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${shareType === 'securities'
                                        ? 'bg-givewise-blue text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Securities
                            </button>
                        </div>

                        {/* Donation Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Donation Amount ($)
                            </label>
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-givewise-blue focus:border-transparent outline-none transition-all text-lg font-semibold text-gray-800"
                            />
                        </div>

                        {/* Province & Income Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Province
                                </label>
                                <select
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-givewise-blue outline-none bg-white"
                                >
                                    {Object.entries(PROVINCIAL_RATES).map(([code, { name }]) => (
                                        <option key={code} value={code}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Annual Income ($)
                                </label>
                                <select
                                    value={income}
                                    onChange={(e) => setIncome(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-givewise-blue outline-none bg-white"
                                >
                                    <option value={50000}>$0 - $55k</option>
                                    <option value={100000}>$55k - $111k</option>
                                    <option value={150000}>$111k - $173k</option>
                                    <option value={200000}>$173k - $246k</option>
                                    <option value={300000}>$246k+</option>
                                </select>
                            </div>
                        </div>

                        {/* Securities Specific Input */}
                        {shareType === 'securities' && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    Adjusted Cost Base ($)
                                    <div className="group relative">
                                        <Info size={16} className="text-blue-400 cursor-help" />
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            The original cost you paid for the securities.
                                        </span>
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    value={acb}
                                    onChange={(e) => setAcb(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-givewise-blue focus:border-transparent outline-none bg-white font-semibold"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-givewise-blue/5 p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Estimated Impact</h2>

                    <div className="space-y-4">
                        <ResultRow
                            label="Donation Receipt"
                            value={formatCurrency(donationAmount)}
                            highlight
                        />

                        <div className="h-px bg-gray-200 my-4"></div>

                        <ResultRow
                            label="Charitable Tax Credit"
                            value={`-${formatCurrency(results.taxCredit)}`}
                            icon={<TrendingUp size={18} className="text-green-500" />}
                            subtext="Federal + Provincial Credits"
                        />

                        {shareType === 'securities' && (
                            <ResultRow
                                label="Capital Gains Tax Saved"
                                value={`-${formatCurrency(results.capitalGainsTax)}`}
                                icon={<CheckCircle size={18} className="text-givewise-gold" />}
                                subtext="0% Tax on Capital Gains"
                            />
                        )}

                        <div className="h-px bg-gray-300 my-4"></div>

                        <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-gray-700">Net Cost of Donation</span>
                            <span className="text-4xl font-extrabold text-givewise-blue">
                                {formatCurrency(results.netCost)}
                            </span>
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-2">
                            You save {formatCurrency(results.taxCredit + results.capitalGainsTax)} in taxes!
                        </p>
                    </div>

                    {/* Mini Viz */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                            <div
                                className="bg-givewise-blue h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(results.netCost / donationAmount) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                            <span>Net Cost</span>
                            <span>Total Impact</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const ResultRow = ({ label, value, icon, subtext, highlight }) => (
    <div className={`flex justify-between items-start ${highlight ? 'text-gray-900' : 'text-gray-700'}`}>
        <div>
            <div className="flex items-center gap-2 font-medium">
                {icon}
                {label}
            </div>
            {subtext && <p className="text-xs text-gray-400 mt-0.5 ml-6">{subtext}</p>}
        </div>
        <span className={`font-bold ${highlight ? 'text-xl' : 'text-lg'}`}>{value}</span>
    </div>
);

export default Calculator;
