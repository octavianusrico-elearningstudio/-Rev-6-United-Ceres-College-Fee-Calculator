import React from 'react';

export const RefundPolicyTable: React.FC = () => {
    const tableHeaderClass = "p-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider";
    const tableCellClass = "p-3 align-top";
    const firstColClass = `${tableCellClass} font-semibold text-gray-900 text-sm w-1/5`;
    const secondColClass = `${tableCellClass} text-sm text-gray-600`;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                        <th scope="col" className={tableHeaderClass}>
                            % of [the amount of Course Fees and Miscellaneous Fees paid under Schedules B and C]
                        </th>
                        <th scope="col" className={tableHeaderClass}>
                            If the Contracting Party's written notice of withdrawal is received:
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                        <td className={firstColClass}>[70]</td>
                        <td className={secondColClass}>
                            more than [30] working days before the Course Commencement Date
                        </td>
                    </tr>
                    <tr>
                        <td className={firstColClass}>[50]</td>
                        <td className={secondColClass}>
                            on or before, but not more than [30] working days before the Course Commencement Date
                        </td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className={firstColClass}>[30]</td>
                        <td className={secondColClass}>
                            after, but not more than [7] working days after the Course Commencement Date
                        </td>
                    </tr>
                    <tr>
                        <td className={firstColClass}>[0]</td>
                        <td className={secondColClass}>
                            more than [7] working days after the Course Commencement Date
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};