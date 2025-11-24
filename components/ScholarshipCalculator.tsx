import React from 'react';
import type { Scholarship } from '../types';

interface Props {
    scholarship: Scholarship;
    onScholarshipChange: (scholarship: Scholarship) => void;
}

const selectStyles = "h-full bg-white border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";
const inputStyles = "block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";


export const ScholarshipCalculator: React.FC<Props> = ({ scholarship, onScholarshipChange }) => {
    
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onScholarshipChange({ ...scholarship, type: e.target.value as 'amount' | 'percentage', value: 0 });
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onScholarshipChange({ ...scholarship, value: parseFloat(e.target.value) || 0 });
    };

    const inputSymbol = scholarship.type === 'amount' ? 'S$' : '%';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship / Discount</h3>
            <div className="flex gap-2">
                <div className="flex-shrink-0">
                    <label htmlFor="scholarship-type" className="sr-only">Scholarship Type</label>
                    <select
                        id="scholarship-type"
                        value={scholarship.type}
                        onChange={handleTypeChange}
                        className={selectStyles}
                    >
                        <option value="amount">Amount (S$)</option>
                        <option value="percentage">Percent (%)</option>
                    </select>
                </div>
                <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 sm:text-sm">{inputSymbol}</span>
                    </div>
                    <input
                        type="number"
                        id="scholarship-value"
                        value={scholarship.value}
                        onChange={handleValueChange}
                        min="0"
                        className={`${inputStyles} pl-8`}
                        placeholder="0.00"
                    />
                </div>
            </div>
        </div>
    );
};