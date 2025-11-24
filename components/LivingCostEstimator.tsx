import React from 'react';
import { HiInformationCircle } from 'react-icons/hi2';
import { formatCurrency } from '../utils/dateUtils';

interface PathwayDetail {
    courseAbbreviation: string;
    durationMonths: number;
}

interface Props {
    costs: { rent: number; food: number; transport: number; medical: number; };
    onCostsChange: (costs: { rent: number; food: number; transport: number; medical: number; }) => void;
    totalDuration: number;
    totalLivingCost: number;
    pathwayDetails: PathwayDetail[];
}

const inputStyles = "block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";

const CostInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">S$</span>
            </div>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className={`${inputStyles} pl-8`}
            />
        </div>
    </div>
);


export const LivingCostEstimator: React.FC<Props> = ({ costs, onCostsChange, totalDuration, totalLivingCost, pathwayDetails }) => {
    const durationBreakdownText = pathwayDetails.length > 1
        ? `(${pathwayDetails.map(p => `${p.courseAbbreviation} ${p.durationMonths}m`).join(' + ')})`
        : '';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Living Cost Estimator</h3>
            <div className="p-3 mb-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                <HiInformationCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>These are estimates and are not part of the course fees. Costs are calculated based on the total duration of selected courses.</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <CostInput label="Rent / mo." value={costs.rent} onChange={(v) => onCostsChange({...costs, rent: v})} />
                <CostInput label="Food / mo." value={costs.food} onChange={(v) => onCostsChange({...costs, food: v})} />
                <CostInput label="Transport / mo." value={costs.transport} onChange={(v) => onCostsChange({...costs, transport: v})} />
                <CostInput label="Medical / mo." value={costs.medical} onChange={(v) => onCostsChange({...costs, medical: v})} />
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>Est. Monthly Cost:</span>
                    <span className="font-medium text-gray-800">{formatCurrency(costs.rent + costs.food + costs.transport + costs.medical)}</span>
                </div>
                <div className="flex justify-between items-start text-gray-600 text-sm">
                    <span>Total Duration:</span>
                    <div className="text-right">
                        <span className="font-medium text-gray-800">{totalDuration} months</span>
                        {durationBreakdownText && (
                            <p className="text-xs text-gray-500">{durationBreakdownText}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 font-bold text-base">
                    <span className="text-gray-900">Total Estimated Living Cost:</span>
                    <span className="text-brand-primary">{formatCurrency(totalLivingCost)}</span>
                </div>
            </div>
        </div>
    );
};