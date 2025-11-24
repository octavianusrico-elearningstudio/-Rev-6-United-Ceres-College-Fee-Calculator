import React from 'react';
import { HiDocumentArrowDown } from 'react-icons/hi2';

interface Props {
    onGenerate: () => void;
}

export const GenerateReport: React.FC<Props> = ({ onGenerate }) => {
    return (
        <div className="bg-transparent">
            <button
                onClick={onGenerate}
                className="w-full flex items-center justify-center gap-3 bg-brand-primary text-brand-text-dark font-semibold py-3 px-4 rounded-lg hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-brand-primary/50"
            >
                <HiDocumentArrowDown size={22} />
                Generate Fee Report
            </button>
        </div>
    );
};