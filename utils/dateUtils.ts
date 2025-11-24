// /utils/dateUtils.ts

/**
 * Parses a YYYY-MM-DD string into a Date object at midnight local time.
 * This avoids the browser inconsistency of parsing date-only strings as UTC.
 * @param dateString The date string in "YYYY-MM-DD" format.
 * @returns A Date object set to midnight in the local timezone.
 */
export const parseDateAsLocal = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // The month is 0-indexed in the JavaScript Date constructor (0 for January).
    return new Date(year, month - 1, day);
};


/**
 * Calculates the number of working days (Mon-Fri) between two dates.
 * The result is positive if date1 is before date2, and negative otherwise.
 * The range is inclusive of the start date and exclusive of the end date.
 * @param date1 The first date.
 * @param date2 The second date.
 * @returns The number of working days between the two dates.
 */
export const calculateWorkingDaysBetween = (date1: Date, date2: Date): number => {
    // Determine the direction and set start/end dates
    const sign = date1.getTime() <= date2.getTime() ? 1 : -1;
    const startDate = sign === 1 ? date1 : date2;
    const endDate = sign === 1 ? date2 : date1;

    let days = 0;
    const currentDate = new Date(startDate.getTime());

    // Loop from the start date until the day *before* the end date
    while (currentDate.getTime() < endDate.getTime()) {
        const dayOfWeek = currentDate.getDay(); // Sunday = 0, Saturday = 6
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            days++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days * sign;
};

/**
 * Formats a number as a currency string for Singapore Dollar (SGD).
 * Uses a robust method to ensure "S$" is always displayed.
 * @param amount The number to format.
 * @returns A string representing the amount in SGD (e.g., "S$ 1,234.56").
 */
export const formatCurrency = (amount: number): string => {
    // Use en-US for reliable comma separation and decimal points.
    const numberPart = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
    
    // Manually prepend the "S$" symbol for consistency.
    return `S$ ${numberPart}`;
};