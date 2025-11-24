export type StudentType = 'local' | 'international';

export interface CourseFee {
  application: {
    local: number;
    international: number;
  };
  course: number;
  material: number;
  examination: number;
  administrative: number;
}

export interface MiscFee {
  id: string;
  name: string;
  amount: number;
  isPerUnit?: boolean;
  notes?: string;
  category?: 'standard' | 'service';
}

export interface Course {
  id: string;
  name: string;
  abbreviation: string;
  durationMonths: number;
  modules: number;
  fees: CourseFee;
  miscFees: MiscFee[];
}

export interface MiscFeeSelection {
    [key: string]: number;
}

export interface PathwayCourse {
    id: number;
    courseId: string;
    miscFees: MiscFeeSelection;
    instalments: number;
    startDate: string;
}

export interface Participant {
    name: string;
    whatsapp: string;
    email: string;
}

export interface Scholarship {
    type: 'amount' | 'percentage';
    value: number;
}

// Data structure for the generated report
export interface ReportData {
    participant: Participant;
    pathwayDetails: Array<{
        course: Course;
        courseBaseTotal: number;
        selectedMiscFees: { name: string; amount: number; quantity: number }[];
        courseMiscTotal: number;
        courseSubtotal: number;
        instalmentPlan: { number: number; date: string; amount: number }[];
    }>;
    studentType: StudentType;
    totals: {
        subtotal: number;
        scholarship: Scholarship;
        scholarshipAmount: number;
        gstAmount: number;
        grandTotal: number;
    };
    livingCost: {
        costs: { rent: number; food: number; transport: number; medical: number; };
        totalDuration: number;
        totalLivingCost: number;
    };
}