import React from 'react';
import { HiCheck } from 'react-icons/hi2';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <ol className="flex items-center w-full">
      {steps.map((step, stepIdx) => {
        const isCompleted = stepIdx < currentStep - 1;
        const isCurrent = stepIdx === currentStep - 1;
        const isUpcoming = stepIdx > currentStep - 1;

        return (
          <React.Fragment key={step}>
            {/* Step Item */}
            <li className="flex flex-col items-center text-center px-2 flex-shrink-0">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold transition-all duration-300
                  ${isCompleted ? 'bg-brand-primary text-brand-text-dark' : ''}
                  ${isCurrent ? 'border-4 border-brand-primary bg-white text-brand-primary shadow-lg scale-110' : ''}
                  ${isUpcoming ? 'border-2 border-gray-300 bg-white text-gray-500' : ''}
                `}
              >
                {isCompleted ? <HiCheck className="w-7 h-7" /> : stepIdx + 1}
              </div>
              <p
                className={`mt-3 text-sm font-medium transition-colors duration-300
                  ${isCurrent ? 'text-brand-primary font-bold' : 'text-gray-500'}
                `}
              >
                {step}
              </p>
            </li>
            
            {/* Connector */}
            {stepIdx < steps.length - 1 && (
              <li className="flex-auto">
                <div
                  className={`h-1.5 w-full transition-colors duration-300
                    ${isCompleted ? 'bg-brand-primary' : 'bg-gray-300'}
                  `}
                />
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
};