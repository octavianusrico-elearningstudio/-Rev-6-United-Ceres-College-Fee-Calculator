import React, { useId, useState } from 'react';
import { parseDateAsLocal, formatCurrency } from '../utils/dateUtils';
import { HiOutlineHashtag, HiChevronDown } from 'react-icons/hi2';

interface Props {
    totalAmount: number;
    durationMonths: number;
    instalments: number;
    onInstalmentsChange: (count: number) => void;
    startDate: string;
    onStartDateChange: (date: string) => void;
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
};

const inputBaseStyles = "block w-full bg-white border border-gray-300 shadow-sm py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";
const inputStyles = `mt-1 ${inputBaseStyles} rounded-md`;


export const InstalmentCalculator: React.FC<Props> = ({ totalAmount, durationMonths, instalments, onInstalmentsChange, startDate, onStartDateChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const instalmentsInputId = useId();
    const startDateInputId = useId();
    const maxInstalments = 12;
    const instalmentAmount = (totalAmount && instalments > 0) ? totalAmount / instalments : 0;
    
    const firstPaymentDate = parseDateAsLocal(startDate);

    const instalmentPlan = Array.from({ length: instalments }, (_, i) => {
        const paymentDate = new Date(firstPaymentDate.getTime());
        paymentDate.setMonth(paymentDate.getMonth() + i);
        return {
            number: i + 1,
            date: formatDate(paymentDate),
            amount: instalmentAmount,
        };
    });

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                aria-expanded={isOpen}
                aria-controls="instalment-calculator-content"
            >
                <h3 className="text-md font-semibold text-gray-700">Instalment Plan</h3>
                <HiChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                 <div id="instalment-calculator-content" className="p-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                        <div>
                            <label htmlFor={startDateInputId} className="block text-sm font-medium text-gray-600">Course Start Date</label>
                            <input
                                type="date"
                                id={startDateInputId}
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor={instalmentsInputId} className="block text-sm font-medium text-gray-600"># of Instalments</label>
                            <div className="relative mt-1">
                                 <HiOutlineHashtag className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="number"
                                    id={instalmentsInputId}
                                    value={instalments}
                                    min="1"
                                    max={maxInstalments}
                                    onChange={(e) => onInstalmentsChange(Math.max(1, Math.min(maxInstalments, parseInt(e.target.value) || 1)))}
                                    className={`${inputBaseStyles} rounded-md pl-10`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Max 12 instalments.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="text-center sm:text-left">
                            <label className="block text-sm font-medium text-gray-600">First Payment Due</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(firstPaymentDate)}</p>
                        </div>
                        <div className="text-center sm:text-right">
                            <label className="block text-sm font-medium text-gray-600">Amount Per Instalment</label>
                            <p className="mt-1 text-xl font-semibold text-brand-primary">{formatCurrency(instalmentAmount)}</p>
                        </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto pr-2 border border-gray-200 rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Instalment</th>
                                    <th scope="col" className="px-4 py-2">Due Date</th>
                                    <th scope="col" className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {instalmentPlan.map(item => (
                                    <tr key={item.number} className={`border-b border-gray-200 last:border-b-0 ${item.number === 1 ? 'bg-brand-primary/10' : ''}`}>
                                        <td className="px-4 py-2 font-medium text-gray-900">#{item.number}</td>
                                        <td className="px-4 py-2">{item.date}</td>
                                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-3">
                        Instalment only apply to Course Fee
                    </p>
                </div>
            )}
        </div>
    );
};