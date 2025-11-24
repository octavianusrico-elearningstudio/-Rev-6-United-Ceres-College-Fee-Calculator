import React from 'react';
import { formatCurrency } from '../utils/dateUtils';

interface Props {
    totals: {
        subtotal: number;
        scholarshipAmount: number;
        gstAmount: number;
        grandTotal: number;
    };
}

export const Summary: React.FC<Props> = ({ totals }) => {
    return (
        <div className="flex-grow flex items-center justify-end">
            <div className="w-full max-w-xs sm:w-80 space-y-1 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totals.subtotal)}</span>
                </div>

                {totals.scholarshipAmount > 0 && (
                    <div className="flex justify-between items-center text-brand-primary">
                        <span>Scholarship:</span>
                        <span className="font-semibold">-{formatCurrency(totals.scholarshipAmount)}</span>
                    </div>
                )}
                
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">GST (9%):</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totals.gstAmount)}</span>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-300">
                    <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-800 text-base">GRAND TOTAL:</span>
                        <span className="font-bold text-xl text-gray-900">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};