import React from 'react';
import type { Course, StudentType } from '../types';
import { formatCurrency } from '../utils/dateUtils';

interface Props {
    course: Course;
    studentType: StudentType;
}

const FeeRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
        <span className="text-gray-600 text-sm">{label}</span>
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
    </div>
);

export const FeeBreakdown: React.FC<Props> = ({ course, studentType }) => {
    const applicationFee = course.fees.application[studentType];
    const totalCourseFees = course.fees.course + course.fees.material + course.fees.examination + course.fees.administrative;
    const totalFees = totalCourseFees + applicationFee;

    return (
        <div>
            <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Fee Breakdown</h3>
            <div className="space-y-1">
                <FeeRow label="Course Fee" value={course.fees.course} />
                <FeeRow label="Material Fee" value={course.fees.material} />
                <FeeRow label="Examination Fee" value={course.fees.examination} />
                <FeeRow label="Administrative Fee" value={course.fees.administrative} />
                
                {/* Intermediate Total: Total Course Fees */}
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200 bg-gray-50 -mx-6 px-6 my-2">
                     <span className="font-bold text-gray-700 text-sm">Total Course Fees</span>
                     <span className="font-bold text-brand-primary text-base">{formatCurrency(totalCourseFees)}</span>
                </div>

                <div className="pt-1">
                    <FeeRow label={`Application Fee (${studentType})`} value={applicationFee} />
                </div>
                
                {/* Final Total: Course Subtotal */}
                <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gray-200">
                    <span className="font-bold text-gray-700 text-sm">Course Subtotal</span>
                    <span className="font-bold text-brand-primary text-lg">{formatCurrency(totalFees)}</span>
                </div>
            </div>
        </div>
    );
};