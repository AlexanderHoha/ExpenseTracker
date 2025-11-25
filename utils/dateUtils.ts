export class DateUtils {
    static toDateString(stringIsoDate: string) : string { 
        return new Date(stringIsoDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }); 
    };
};