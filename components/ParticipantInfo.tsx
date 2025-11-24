import React from 'react';
import type { Participant } from '../types';
import { HiUser, HiPhone, HiEnvelope } from 'react-icons/hi2';

interface Props {
    info: Participant;
    onInfoChange: (info: Participant) => void;
}

const inputStyles = "block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition hover:border-gray-400";

const InfoInput: React.FC<{
    id: keyof Participant;
    label: string;
    value: string;
    icon: React.ReactNode;
    type?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, value, icon, type = 'text', placeholder, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                type={type}
                name={id}
                id={id}
                value={value}
                onChange={onChange}
                className={`${inputStyles} pl-10`}
                placeholder={placeholder}
            />
        </div>
    </div>
);


export const ParticipantInfo: React.FC<Props> = ({ info, onInfoChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onInfoChange({ ...info, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Participant Details</h3>
            <div className="space-y-4">
                <InfoInput
                    id="name"
                    label="Full Name"
                    value={info.name}
                    onChange={handleChange}
                    placeholder="e.g., Jane Doe"
                    icon={<HiUser className="h-5 w-5 text-gray-400" />}
                />
                <InfoInput
                    id="whatsapp"
                    label="WhatsApp Number"
                    type="tel"
                    value={info.whatsapp}
                    onChange={handleChange}
                    placeholder="+65 1234 5678"
                    icon={<HiPhone className="h-5 w-5 text-gray-400" />}
                />
                <InfoInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={info.email}
                    onChange={handleChange}
                    placeholder="jane.doe@example.com"
                    icon={<HiEnvelope className="h-5 w-5 text-gray-400" />}
                />
            </div>
             <p className="text-xs text-gray-500 italic mt-4">
                By submitting your details, you consent to the collection, use and disclosure of your personal data for course-related communication in accordance with the Personal Data Protection Act 2012 (Singapore).
            </p>
        </div>
    );
};