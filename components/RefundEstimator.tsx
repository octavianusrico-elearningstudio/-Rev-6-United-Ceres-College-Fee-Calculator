import React, { useMemo, useState, useEffect } from 'react';
import type { PathwayCourse } from '../types';
import { HiInformationCircle, HiChevronDown } from 'react-icons/hi2';
import { parseDateAsLocal, calculateWorkingDaysBetween, formatCurrency } from '../utils/dateUtils';
import { RefundPolicyTable } from './RefundPolicyTable';

interface Props {
    pathwayCourses: PathwayCourse[];
    withdrawalDate: string;
    onWithdrawalDateChange: (date: string) => void;
    totalPayable: number;
}

const inputStyles = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";

export const RefundEstimator: React.FC<Props> = ({ pathwayCourses, withdrawalDate, onWithdrawalDateChange, totalPayable }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [estimatorStartDate, setEstimatorStartDate] = useState<string>('');

    useEffect(() => {
        if (pathwayCourses.length > 0 && pathwayCourses[0].startDate) {
            setEstimatorStartDate(pathwayCourses[0].startDate);
        } else {
            // Default to today if no course is selected
            setEstimatorStartDate(new Date().toISOString().split('T')[0]);
        }
    }, [pathwayCourses]);

    const { refundPercentage, refundAmount, message } = useMemo(() => {
        if (!estimatorStartDate) {
            return { refundPercentage: 0, refundAmount: 0, message: "Select a course start date to estimate refund." };
        }

        const firstCourseStartDate = parseDateAsLocal(estimatorStartDate);
        const withdrawal = parseDateAsLocal(withdrawalDate);
        
        // Clear time part for accurate date-only comparison
        firstCourseStartDate.setHours(0, 0, 0, 0);
        withdrawal.setHours(0, 0, 0, 0);

        let percentage = 0;
        let msg = "";

        if (withdrawal.getTime() > firstCourseStartDate.getTime()) {
            // Withdrawal is AFTER the course start date.
            let daysAfter = 0;
            const currentDate = new Date(firstCourseStartDate.getTime());
            currentDate.setDate(currentDate.getDate() + 1); // Start counting from the day after

            while (currentDate.getTime() <= withdrawal.getTime()) {
                const dayOfWeek = currentDate.getDay(); // Sunday = 0, Saturday = 6
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    daysAfter++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (daysAfter > 0 && daysAfter <= 7) {
                percentage = 30; // Original value
                msg = "Withdrawal within 7 working days after course start.";
            } else {
                percentage = 0;
                msg = "Withdrawal more than 7 working days after course start.";
            }
        } else {
            // Withdrawal is ON or BEFORE the course start date.
            const workingDaysBeforeCommencement = calculateWorkingDaysBetween(withdrawal, firstCourseStartDate);

            if (workingDaysBeforeCommencement > 30) {
                percentage = 70; // Original value
                msg = "More than 30 working days' notice before course start."
            } else {
                percentage = 50; // Original value
                 if (workingDaysBeforeCommencement > 0) {
                    msg = `1-30 working days' notice before course start.`;
                } else {
                    msg = "Withdrawal on course start date.";
                }
            }
        }

        return {
            refundPercentage: percentage,
            refundAmount: totalPayable * (percentage / 100),
            message: msg
        };
        
    }, [estimatorStartDate, withdrawalDate, totalPayable]);


    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left"
                aria-expanded={isOpen}
                aria-controls="refund-estimator-content"
            >
                <h3 className="text-lg font-semibold text-gray-900">Refund Estimator</h3>
                <HiChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                 <div id="refund-estimator-content" className="px-6 pb-6 pt-4 border-t border-gray-200 animate-fadeIn">
                    <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                         <HiInformationCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Estimates are based on withdrawal notice period. Refer to the <a href="https://unitedceres.edu.sg/refund/" target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-yellow-900">official refund policy</a> for full details, including non-delivery or pass rejection scenarios.</span>
                    </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div>
                            <label htmlFor="course-start-date-refund" className="block text-sm font-medium text-gray-600">Course Start Date</label>
                            <input
                                type="date"
                                id="course-start-date-refund"
                                value={estimatorStartDate}
                                onChange={(e) => setEstimatorStartDate(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                         <div>
                            <label htmlFor="withdrawal-date-refund" className="block text-sm font-medium text-gray-600">Withdrawal Date</label>
                            <input
                                type="date"
                                id="withdrawal-date-refund"
                                value={withdrawalDate}
                                onChange={(e) => onWithdrawalDateChange(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                    </div>

                    {/* Compact Result Section */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex-grow">
                            <p className="text-gray-600 text-sm font-medium">{message}</p>
                            <div className="flex items-baseline gap-3 mt-1">
                                 <p className="text-lg font-semibold text-gray-900">{formatCurrency(refundAmount)}</p>
                                 <div className="flex-shrink-0">
                                    <span className="text-lg font-bold text-brand-primary">{refundPercentage}%</span>
                                    <span className="text-sm text-gray-600 ml-1.5">Refund</span>
                                </div>
                            </div>

                            {refundAmount > 0 && (
                                <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700 animate-fadeIn">
                                    <p className="font-semibold text-gray-800 mb-1">Calculation Breakdown:</p>
                                    <div className="font-sans text-sm tracking-tight space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span>{formatCurrency(totalPayable)}</span>
                                            <span className="text-gray-500 text-right ml-2">(Total Payable)</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>×&nbsp;&nbsp;{refundPercentage}%</span>
                                            <span className="text-gray-500 text-right ml-2">(Refund Rate)</span>
                                        </div>
                                        <hr className="my-1 border-gray-200"/>
                                        <div className="flex justify-between items-center font-bold text-gray-900">
                                            <span>= {formatCurrency(refundAmount)}</span>
                                            <span className="text-gray-500 text-right ml-2">(Refund Amount)</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Refund Policy Reference</h4>
                        <RefundPolicyTable />
                    </div>
                </div>
            )}
        </div>
    );
};