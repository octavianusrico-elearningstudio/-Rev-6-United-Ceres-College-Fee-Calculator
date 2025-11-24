import React, { useState, useMemo } from 'react';
import type { Course, MiscFee, MiscFeeSelection } from '../types';
import { HiInformationCircle, HiChevronDown, HiCubeTransparent, HiWrenchScrewdriver } from 'react-icons/hi2';
import { formatCurrency } from '../utils/dateUtils';

const inputStyles = "block w-full bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";

const AccordionSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    fees: MiscFee[];
    selectedFees: MiscFeeSelection;
    onFeeChange: (fee: MiscFee, checked: boolean) => void;
    onQuantityChange: (feeId: string, quantity: number) => void;
    courseId: string;
}> = ({ title, icon, fees, selectedFees, onFeeChange, onQuantityChange, courseId }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (fees.length === 0) return null;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <h4 className="font-semibold text-gray-700">{title}</h4>
                </div>
                <HiChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-2 space-y-1">
                    {fees.map(fee => (
                         <div key={fee.id} className={`flex items-center justify-between p-2 rounded-md transition-all ${selectedFees[fee.id] ? 'bg-brand-primary/10' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                               <input
                                    type="checkbox"
                                    id={`misc-${fee.id}-${courseId}`}
                                    checked={!!selectedFees[fee.id]}
                                    onChange={(e) => onFeeChange(fee, e.target.checked)}
                                    className="h-4 w-4 text-brand-primary bg-white border-gray-300 rounded focus:ring-2 focus:ring-brand-primary transition cursor-pointer flex-shrink-0"
                                />
                                <label htmlFor={`misc-${fee.id}-${courseId}`} className="flex flex-col cursor-pointer truncate">
                                    <span className="text-sm font-medium text-gray-900 truncate" title={fee.name}>{fee.name}</span>
                                    {fee.notes && (
                                        <span className="text-xs text-gray-500 flex items-center gap-1"><HiInformationCircle/> {fee.notes}</span>
                                    )}
                                </label>
                            </div>
                           <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <span className="text-sm font-semibold text-brand-primary w-24 text-right">{formatCurrency(fee.amount)}</span>
                                {fee.isPerUnit && !!selectedFees[fee.id] && (
                                    <input
                                        type="number"
                                        min="1"
                                        value={selectedFees[fee.id] || 1}
                                        onChange={(e) => onQuantityChange(fee.id, parseInt(e.target.value) || 1)}
                                        className={`${inputStyles} w-16 text-center`}
                                        aria-label={`Quantity for ${fee.name}`}
                                    />
                                )}
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Fix: Defined Props interface for the component
interface Props {
    course: Course;
    selectedFees: MiscFeeSelection;
    onFeesChange: (fees: MiscFeeSelection) => void;
}

export const MiscellaneousFees: React.FC<Props> = ({ course, selectedFees, onFeesChange }) => {
    
    const { standardFees, serviceFees } = useMemo(() => {
        return {
            standardFees: course.miscFees.filter(f => f.category === 'standard' || !f.category),
            serviceFees: course.miscFees.filter(f => f.category === 'service'),
        }
    }, [course.miscFees]);
    
    const handleFeeChange = (fee: MiscFee, checked: boolean) => {
        const newFees = { ...selectedFees };
        if (checked) {
            newFees[fee.id] = fee.isPerUnit ? (newFees[fee.id] || 1) : 1;
        } else {
            delete newFees[fee.id];
        }
        onFeesChange(newFees);
    };

    const handleQuantityChange = (feeId: string, quantity: number) => {
        const newFees = { ...selectedFees };
        if (quantity > 0) {
            newFees[feeId] = quantity;
        } else {
            delete newFees[feeId];
        }
        onFeesChange(newFees);
    };

    return (
        <div>
            <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Miscellaneous Fees (Optional)</h3>
            <div className="space-y-3">
                 <AccordionSection
                    title="Standard Fees"
                    icon={<HiCubeTransparent className="w-5 h-5 text-brand-primary" />}
                    fees={standardFees}
                    selectedFees={selectedFees}
                    onFeeChange={handleFeeChange}
                    onQuantityChange={handleQuantityChange}
                    courseId={course.id}
                />
                <AccordionSection
                    title="Service & Application Fees"
                    icon={<HiWrenchScrewdriver className="w-5 h-5 text-brand-primary" />}
                    fees={serviceFees}
                    selectedFees={selectedFees}
                    onFeeChange={handleFeeChange}
                    onQuantityChange={handleQuantityChange}
                    courseId={course.id}
                />
            </div>
        </div>
    );
};