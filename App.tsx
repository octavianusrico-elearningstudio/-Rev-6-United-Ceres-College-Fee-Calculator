import React, { useState, useMemo } from 'react';
import { FeeBreakdown } from './components/FeeBreakdown';
import { InstalmentCalculator } from './components/InstalmentCalculator';
import { MiscellaneousFees } from './components/MiscellaneousFees';
import { LivingCostEstimator } from './components/LivingCostEstimator';
import { RefundEstimator } from './components/RefundEstimator';
import { Summary } from './components/Summary';
import { Header } from './components/Header';
import { ParticipantInfo } from './components/ParticipantInfo';
import { GenerateReport } from './components/GenerateReport';
import { ReportModal } from './components/ReportModal';
import { ScholarshipCalculator } from './components/ScholarshipCalculator';
import { Stepper } from './components/Stepper';
import { courseData } from './data/courseData';
import { Course, StudentType, PathwayCourse as PathwayCourseType, MiscFeeSelection, Participant, ReportData, Scholarship } from './types';
import { HiPlusCircle, HiTrash, HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { parseDateAsLocal } from './utils/dateUtils';

const inputBaseStyles = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";
const selectStyles = `${inputBaseStyles} pr-10`;

const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [pathwayCourses, setPathwayCourses] = useState<PathwayCourseType[]>([
        { id: Date.now(), courseId: courseData[0].id, miscFees: {}, instalments: 1, startDate: '2025-10-30' }
    ]);
    const [studentType, setStudentType] = useState<StudentType>('international');
    const [livingCosts, setLivingCosts] = useState({ rent: 0, food: 0, transport: 0, medical: 0 });
    const [scholarship, setScholarship] = useState<Scholarship>({ type: 'amount', value: 0 });
    const [withdrawalDate, setWithdrawalDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [participantInfo, setParticipantInfo] = useState<Participant>({ name: '', whatsapp: '', email: '' });
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const steps = ['Details', 'Courses', 'Finalize'];
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));


    const handleUpdateCourse = (id: number, updatedCourse: Partial<PathwayCourseType>) => {
        setPathwayCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedCourse } : c));
    };

    const handleAddCourse = () => {
        setPathwayCourses(prev => [
            ...prev,
            { id: Date.now(), courseId: courseData[0].id, miscFees: {}, instalments: 1, startDate: new Date().toISOString().split('T')[0] }
        ]);
    };

    const handleRemoveCourse = (id: number) => {
        setPathwayCourses(prev => prev.filter(c => c.id !== id));
    };
    
    const totals = useMemo(() => {
        const pathwayDetails = pathwayCourses.map(pc => {
            const course = courseData.find(c => c.id === pc.courseId);
            if (!course) return null;

            const applicationFee = course.fees.application[studentType];
            const courseBaseTotal = applicationFee + course.fees.course + course.fees.material + course.fees.examination + course.fees.administrative;
            
            let courseMiscTotal = 0;
            const selectedMiscFees: { name: string; amount: number; quantity: number }[] = [];
            Object.entries(pc.miscFees).forEach(([feeId, quantity]) => {
                const miscfee = course.miscFees.find(mf => mf.id === feeId);
                if(miscfee && Number(quantity) > 0) {
                    const amount = miscfee.amount * Number(quantity);
                    courseMiscTotal += amount;
                    selectedMiscFees.push({ name: miscfee.name, amount: miscfee.amount, quantity: Number(quantity) });
                }
            });

            const courseSubtotal = courseBaseTotal + courseMiscTotal;

            // Note: The instalment amount logic is in the component itself. This is for display if needed elsewhere.
            const instalmentAmount = (course.fees.course && pc.instalments > 0) ? course.fees.course / pc.instalments : 0;
            const instalmentPlan = Array.from({ length: pc.instalments }, (_, i) => {
                const paymentDate = parseDateAsLocal(pc.startDate);
                paymentDate.setMonth(paymentDate.getMonth() + i);
                return {
                    number: i + 1,
                    date: paymentDate.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' }),
                    amount: instalmentAmount,
                };
            });
            
            return {
                ...pc,
                courseName: course.name,
                courseAbbreviation: course.abbreviation,
                courseBaseTotal,
                courseMiscTotal,
                courseSubtotal,
                durationMonths: course.durationMonths,
                course,
                selectedMiscFees,
                instalmentPlan,
            };
        }).filter((c): c is NonNullable<typeof c> => c !== null);

        const totalCourseFees = pathwayDetails.reduce((sum, d) => sum + d.courseBaseTotal, 0);
        const totalMiscFees = pathwayDetails.reduce((sum, d) => sum + d.courseMiscTotal, 0);
        const totalDuration = pathwayDetails.reduce((sum, d) => sum + Number(d.durationMonths), 0);
        
        const subtotal = totalCourseFees + totalMiscFees;

        const scholarshipAmount = scholarship.type === 'percentage'
            ? subtotal * (scholarship.value / 100)
            : scholarship.value;
        
        const subtotalAfterScholarship = Math.max(0, subtotal - scholarshipAmount);
        
        const gstAmount = subtotalAfterScholarship * 0.09;
        const grandTotal = subtotalAfterScholarship + gstAmount;

        const totalLivingCosts = (livingCosts.rent + livingCosts.food + livingCosts.transport + livingCosts.medical) * totalDuration;

        return { 
            pathwayDetails,
            totalCourseFees, 
            totalMiscFees, 
            subtotal,
            scholarshipAmount,
            subtotalAfterScholarship,
            gstAmount, 
            grandTotal, 
            totalLivingCosts, 
            totalDuration,
        };
    }, [pathwayCourses, studentType, livingCosts, scholarship]);

    const reportData: ReportData = {
        participant: participantInfo,
        pathwayDetails: totals.pathwayDetails,
        studentType,
        totals: {
            subtotal: totals.subtotal,
            scholarship: scholarship,
            scholarshipAmount: totals.scholarshipAmount,
            gstAmount: totals.gstAmount,
            grandTotal: totals.grandTotal,
        },
        livingCost: {
            costs: livingCosts,
            totalDuration: totals.totalDuration,
            totalLivingCost: totals.totalLivingCosts,
        },
    };

    const renderActionBar = () => (
        <div className="max-w-4xl mx-auto p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex-grow w-full">
                {currentStep > 1 && <Summary totals={totals} />}
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-auto flex items-stretch sm:items-center gap-3">
                {currentStep > 1 && (
                    <button onClick={prevStep} className="flex-grow sm:flex-grow-0 justify-center flex items-center gap-2 text-gray-700 font-semibold py-3 px-4 rounded-lg bg-transparent hover:bg-gray-100 border border-gray-300 transition-all duration-200">
                        <HiArrowLeft size={20}/> Previous
                    </button>
                )}
                
                {currentStep < steps.length ? (
                    <button onClick={nextStep} className="flex-grow sm:flex-grow-0 justify-center flex items-center gap-2 text-brand-text-dark font-semibold py-3 px-4 rounded-lg bg-brand-primary hover:bg-brand-primary-hover transition-all duration-200 shadow-sm hover:shadow-md">
                        Next Step <HiArrowRight size={20}/>
                    </button>
                ) : (
                    <div className="flex-grow sm:flex-grow-0">
                        <GenerateReport onGenerate={() => setIsReportModalOpen(true)} />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <Header />

            {/* Sticky Action Bar for Steps 2 & 3 */}
            {currentStep > 1 && (
                <div className="sticky top-20 bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/50 z-10">
                    {renderActionBar()}
                </div>
            )}
            
            <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 pb-32">
                
                <div className="mb-12 mt-4">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                {/* Step 1: Participant & Global Settings */}
                <div className={`${currentStep === 1 ? 'block animate-fadeIn' : 'hidden'} space-y-8`}>
                    <ParticipantInfo info={participantInfo} onInfoChange={setParticipantInfo} />
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="student-type" className="block text-sm font-medium text-gray-600">Student Type</label>
                                <select
                                    id="student-type"
                                    value={studentType}
                                    onChange={(e) => setStudentType(e.target.value as StudentType)}
                                    className={selectStyles}
                                >
                                    <option value="international">International Student</option>
                                    <option value="local">Local Student</option>
                                </select>
                            </div>
                             <div className="text-sm text-gray-700 p-3 bg-gray-100 border border-gray-200 rounded-lg">
                                <strong>Note:</strong> A Goods and Services Tax (GST) of 9% is applied to all course fees.
                            </div>
                            <div className="text-xs text-gray-500 italic pt-2">
                                Disclaimer: This quotation is an estimate only and may be revised without prior notice.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Course Selection */}
                <div className={`${currentStep === 2 ? 'block animate-fadeIn' : 'hidden'} space-y-8`}>
                    {pathwayCourses.map((pc, index) => {
                        const course = courseData.find(c => c.id === pc.courseId)!;
                        
                        return (
                            <div key={pc.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-shadow hover:shadow-brand-primary/10">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                                    <h2 className="text-xl font-bold text-brand-primary">Course {index + 1}</h2>
                                    {pathwayCourses.length > 1 && (
                                        <button 
                                            onClick={() => handleRemoveCourse(pc.id)} 
                                            className="text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10 p-1"
                                            aria-label={`Remove Course ${index + 1}`}
                                        >
                                            <HiTrash size={20} />
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor={`course-${pc.id}`} className="block text-sm font-medium text-gray-600">Select Course</label>
                                        <select
                                            id={`course-${pc.id}`}
                                            value={pc.courseId}
                                            onChange={(e) => handleUpdateCourse(pc.id, { courseId: e.target.value })}
                                            className={selectStyles}
                                        >
                                            {courseData.map(course => (
                                                <option key={course.id} value={course.id}>{course.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <FeeBreakdown course={course} studentType={studentType} />
                                    <MiscellaneousFees course={course} selectedFees={pc.miscFees} onFeesChange={(miscFees) => handleUpdateCourse(pc.id, { miscFees })} />
                                    <InstalmentCalculator
                                        totalAmount={course.fees.course}
                                        durationMonths={course.durationMonths}
                                        instalments={pc.instalments}
                                        onInstalmentsChange={(instalments) => handleUpdateCourse(pc.id, { instalments })}
                                        startDate={pc.startDate}
                                        onStartDateChange={(startDate) => handleUpdateCourse(pc.id, { startDate })}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex justify-center pt-4">
                        <button onClick={handleAddCourse} className="flex items-center gap-2 text-brand-primary font-semibold py-3 px-5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 transition-all duration-200 transform hover:scale-105 border border-brand-primary/30 shadow-sm hover:shadow-md">
                            <HiPlusCircle size={22}/> Add Another Course to Pathway
                        </button>
                    </div>
                </div>
                
                {/* Step 3: Finalize (Scholarship, Living Costs, Refund) */}
                <div className={`${currentStep === 3 ? 'block animate-fadeIn' : 'hidden'} space-y-8`}>
                    <ScholarshipCalculator scholarship={scholarship} onScholarshipChange={setScholarship} />
                    <LivingCostEstimator
                        costs={livingCosts}
                        onCostsChange={setLivingCosts}
                        totalDuration={totals.totalDuration}
                        totalLivingCost={totals.totalLivingCosts}
                        pathwayDetails={totals.pathwayDetails}
                    />
                    <RefundEstimator 
                        pathwayCourses={pathwayCourses}
                        withdrawalDate={withdrawalDate}
                        onWithdrawalDateChange={setWithdrawalDate}
                        totalPayable={totals.subtotal}
                    />
                </div>
            </main>

             {/* Action Bar for Step 1 */}
            {currentStep === 1 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-10">
                     {renderActionBar()}
                </div>
            )}


            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportData={reportData}
            />
        </div>
    );
};

export default App;