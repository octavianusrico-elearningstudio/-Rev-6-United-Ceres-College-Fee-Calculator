import React, { useRef, useState, useEffect } from 'react';
import { ReportData } from '../types';
import { HiXMark, HiClipboardDocument, HiArrowDownTray, HiEnvelope } from 'react-icons/hi2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency } from '../utils/dateUtils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    reportData: ReportData;
}

// Helper function to generate a plain text email body from the report data
const generateEmailBody = (data: ReportData): string => {
    let body = `Dear ${data.participant.name || 'Participant'},\n\n`;
    body += `Thank you for your interest in United Ceres College. Please find your detailed fee quotation below.\n\n`;
    body += `========================================\n`;
    body += `  FEE QUOTATION REPORT\n`;
    body += `========================================\n\n`;

    body += `PARTICIPANT DETAILS\n`;
    body += `----------------------------------------\n`;
    body += `Name: ${data.participant.name || 'N/A'}\n`;
    body += `WhatsApp: ${data.participant.whatsapp || 'N/A'}\n`;
    body += `Email: ${data.participant.email || 'N/A'}\n\n`;

    data.pathwayDetails.forEach((detail, index) => {
        body += `----------------------------------------\n`;
        body += `COURSE ${index + 1}: ${detail.course.name}\n`;
        body += `----------------------------------------\n\n`;
        
        body += `FEE BREAKDOWN\n`;
        
        const appFee = detail.course.fees.application[data.studentType];
        const courseFee = detail.course.fees.course;
        const combinedCourseFee = appFee + courseFee;

        body += `Total Course Fee: ${formatCurrency(combinedCourseFee)}\n`;
        body += `Material Fee: ${formatCurrency(detail.course.fees.material)}\n`;
        body += `Examination Fee: ${formatCurrency(detail.course.fees.examination)}\n`;
        body += `Administrative Fee: ${formatCurrency(detail.course.fees.administrative)}\n`;

        if (detail.selectedMiscFees.length > 0) {
            body += `\nMISCELLANEOUS FEES\n`;
            detail.selectedMiscFees.forEach(fee => {
                body += `${fee.name} (x${fee.quantity}): ${formatCurrency(fee.amount * fee.quantity)}\n`;
            });
            body += `Total Misc. Fees: ${formatCurrency(detail.courseMiscTotal)}\n`;
        }

        body += `\nTOTAL FEE: ${formatCurrency(detail.courseSubtotal)}\n\n`;

        body += `INSTALMENT PLAN (${detail.instalmentPlan.length} Payments)\n`;
        detail.instalmentPlan.forEach(p => {
            body += `#${p.number}\t Due: ${p.date}\t Amount: ${formatCurrency(p.amount)}\n`;
        });
        body += `\n`;
    });

    if (data.livingCost.totalLivingCost > 0) {
        const monthlyCost = data.livingCost.costs.rent + data.livingCost.costs.food + data.livingCost.costs.transport + data.livingCost.costs.medical;
        body += `========================================\n`;
        body += `  OPTIONAL LIVING COST ESTIMATION\n`;
        body += `========================================\n\n`;
        body += `Est. Monthly Cost: ${formatCurrency(monthlyCost)}\n`;
        body += `Total Duration: ${data.livingCost.totalDuration} months\n`;
        body += `Total Estimated Living Cost: ${formatCurrency(data.livingCost.totalLivingCost)}\n\n`;
    }

    body += `========================================\n`;
    body += `  FINAL SUMMARY\n`;
    body += `========================================\n\n`;
    body += `Subtotal: ${formatCurrency(data.totals.subtotal)}\n`;
    if (data.totals.scholarshipAmount > 0) {
        const scholarshipLabel = data.totals.scholarship.type === 'percentage' ? `${data.totals.scholarship.value}%` : 'Fixed';
        body += `Scholarship/Discount (${scholarshipLabel}): -${formatCurrency(data.totals.scholarshipAmount)}\n`;
    }
    body += `GST (9%): ${formatCurrency(data.totals.gstAmount)}\n`;
    body += `GRAND TOTAL: ${formatCurrency(data.totals.grandTotal)}\n\n`;

    body += `----------------------------------------\n`;
    body += `Disclaimer: This quotation is an estimate only and may be revised without prior notice.\n\n`;
    body += `Best regards,\n`;
    body += `United Ceres College\n`;
    
    return body;
};

export const ReportModal: React.FC<Props> = ({ isOpen, onClose, reportData }) => {
    const reportContentRef = useRef<HTMLDivElement>(null);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            // Delay closing for animation
            setTimeout(() => setShowModal(false), 300);
        }
    }, [isOpen]);

    if (!showModal && !isOpen) return null;

    const handleSendEmail = () => {
        if (!reportData.participant.email) {
            alert('Please enter a participant email address first.');
            return;
        }

        const subject = 'Fee Quotation from United Ceres College';
        const body = generateEmailBody(reportData);

        const mailtoLink = `mailto:${reportData.participant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    };

    const handleCopyToClipboard = () => {
        if (reportContentRef.current) {
            const text = reportContentRef.current.innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert('Report copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy report: ', err);
                alert('Failed to copy report.');
            });
        }
    };

    const handleDownloadPdf = async () => {
        if (!reportContentRef.current) return;
        setIsDownloadingPdf(true);
    
        try {
            const element = reportContentRef.current;
            // Clone the element to render it off-screen with specific print styles
            const clone = element.cloneNode(true) as HTMLElement;
            
            // Force A4 width (approx 794px at 96 DPI) to ensure layout consistency
            clone.style.width = '794px'; 
            clone.style.height = 'auto';
            clone.style.position = 'absolute';
            clone.style.top = '-10000px';
            clone.style.left = '-10000px';
            clone.style.backgroundColor = '#ffffff';
            // Add padding to simulate PDF margins
            clone.style.padding = '40px';
            
            // Ensure full content is visible
            clone.style.overflow = 'visible';
            clone.style.maxHeight = 'none';

            document.body.appendChild(clone);
    
            // Use html2canvas to capture the visual representation (preserves Fonts and Layout)
            const canvas = await html2canvas(clone, {
                scale: 2, // Higher scale for sharper text
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794
            });
    
            document.body.removeChild(clone);
    
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            
            // Handle pagination if content overflows one page
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
    
            pdf.save('Fee_Quotation_UCC.pdf');
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert('Failed to generate PDF.');
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    const modalClasses = isOpen ? 'opacity-100' : 'opacity-0';
    const containerClasses = isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0';
    const durationBreakdownText = reportData.pathwayDetails.length > 1 ? `(${reportData.pathwayDetails.map(p => `${p.course.abbreviation} ${p.course.durationMonths}m`).join(' + ')})` : '';

    return (
        <div className={`fixed inset-0 bg-black/60 flex justify-center items-center z-50 print:bg-transparent print:block transition-opacity duration-300 ease-in-out ${modalClasses}`} onClick={onClose}>
            <div className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col print:shadow-none print:h-auto print:max-h-none transition-all duration-300 ease-in-out ${containerClasses}`} onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center print:hidden">
                    <h2 className="text-xl font-bold text-slate-800">Fee Quotation Report</h2>
                    <div className="flex items-center gap-1">
                         <button onClick={handleSendEmail} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Send via Email">
                            <HiEnvelope size={20} />
                        </button>
                         <button onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait" title="Download as PDF">
                            {isDownloadingPdf ? (
                                <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <HiArrowDownTray size={20} />
                            )}
                        </button>
                         <button onClick={handleCopyToClipboard} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Copy to Clipboard">
                            <HiClipboardDocument size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <HiXMark size={24} />
                        </button>
                    </div>
                </header>
                
                <div ref={reportContentRef} className="p-8 overflow-y-auto bg-white" id="report-content">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">United Ceres College</h1>
                            <p className="text-slate-600 text-lg">Fee Quotation</p>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                            <p>Generated on:</p>
                            <p>{new Date().toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="mb-8 p-4 border rounded-lg bg-slate-50">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">Participant Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 text-sm">
                            <p><strong>Name:</strong> {reportData.participant.name || 'N/A'}</p>
                            <p><strong>WhatsApp:</strong> {reportData.participant.whatsapp || 'N/A'}</p>
                            <p><strong>Email:</strong> {reportData.participant.email || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {reportData.pathwayDetails.map((detail, index) => {
                        // Calculate Combined Fee for View
                        const appFee = detail.course.fees.application[reportData.studentType];
                        const courseFee = detail.course.fees.course;
                        const combinedCourseFee = appFee + courseFee;

                        return (
                        <div key={detail.course.id} className="mb-8">
                             <h3 className="text-xl font-bold text-brand-primary bg-slate-100 p-3 rounded-lg -mx-3">
                                Course {index + 1}: {detail.course.name}
                            </h3>
                            
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2 text-slate-700">Fee Breakdown</h4>
                                        <div className="text-sm space-y-1">
                                            <div className="flex justify-between"><span className="text-slate-600">Total Course Fee:</span> <span>{formatCurrency(combinedCourseFee)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-600">Material Fee:</span> <span>{formatCurrency(detail.course.fees.material)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-600">Examination Fee:</span> <span>{formatCurrency(detail.course.fees.examination)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-600">Administrative Fee:</span> <span>{formatCurrency(detail.course.fees.administrative)}</span></div>
                                        </div>
                                    </div>
                                    
                                    {detail.selectedMiscFees.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mt-4 mb-2 text-slate-700">Miscellaneous Fees</h4>
                                            <div className="text-sm space-y-1">
                                                {detail.selectedMiscFees.map(fee => (
                                                     <div key={fee.name} className="flex justify-between"><span className="text-slate-600">{fee.name} (x{fee.quantity}):</span> <span>{formatCurrency(fee.amount * fee.quantity)}</span></div>
                                                ))}
                                                <div className="flex justify-between pt-2 border-t font-bold"><span >Total Misc. Fees:</span> <span>{formatCurrency(detail.courseMiscTotal)}</span></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between mt-4 pt-2 border-t-2 text-lg font-bold">
                                        <span>Total Fee:</span>
                                        <span className="text-brand-primary">{formatCurrency(detail.courseSubtotal)}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-slate-700">Instalment Plan ({detail.instalmentPlan.length} Payments)</h4>
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100"><tr><th className="px-2 py-1 text-left font-semibold">#</th><th className="px-2 py-1 text-left font-semibold">Due Date</th><th className="px-2 py-1 text-right font-semibold">Amount</th></tr></thead>
                                        <tbody>
                                            {detail.instalmentPlan.map(p => <tr key={p.number} className="border-b"><td className="px-2 py-1">{p.number}</td><td className="px-2 py-1">{p.date}</td><td className="px-2 py-1 text-right">{formatCurrency(p.amount)}</td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )})}
                    
                    {reportData.livingCost.totalLivingCost > 0 && (
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-bold text-lg mb-2 text-blue-800">Optional Living Cost Estimation</h3>
                             <div className="text-sm space-y-1 text-blue-700">
                                <div className="flex justify-between"><span >Est. Monthly Cost:</span> <span>{formatCurrency(reportData.livingCost.costs.rent + reportData.livingCost.costs.food + reportData.livingCost.costs.transport + reportData.livingCost.costs.medical)}</span></div>
                                <div className="flex justify-between items-start">
                                    <span >Total Duration:</span>
                                    <div className="text-right">
                                        <span>{reportData.livingCost.totalDuration} months</span>
                                        {durationBreakdownText && (
                                            <p className="text-xs text-blue-600">{durationBreakdownText}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-300 font-bold"><span >Total Estimated Living Cost:</span> <span>{formatCurrency(reportData.livingCost.totalLivingCost)}</span></div>
                             </div>
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t-2">
                        <h3 className="font-bold text-xl mb-2 text-right text-slate-800">Final Summary</h3>
                        <div className="max-w-sm ml-auto space-y-2">
                            <div className="flex justify-between"><span className="text-slate-600">Subtotal:</span> <span className="font-medium text-slate-800">{formatCurrency(reportData.totals.subtotal)}</span></div>
                             {reportData.totals.scholarshipAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Scholarship ({reportData.totals.scholarship.type === 'percentage' ? `${reportData.totals.scholarship.value}%` : 'Fixed'}):
                                    </span>
                                    <span className="font-medium text-green-600">-{formatCurrency(reportData.totals.scholarshipAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between"><span className="text-slate-600">GST (9%):</span> <span className="font-medium text-slate-800">{formatCurrency(reportData.totals.gstAmount)}</span></div>
                            <div className="flex justify-between text-2xl font-bold mt-2 pt-2 border-t"><span className="text-slate-900">GRAND TOTAL:</span> <span className="text-slate-900">{formatCurrency(reportData.totals.grandTotal)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs text-slate-500 text-center">
                        <p>Disclaimer: This quotation is an estimate only and may be revised without prior notice.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};