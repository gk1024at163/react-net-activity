import { type DateArg, format, formatDistanceToNow } from "date-fns";
import { z } from "zod";
export function formatDate(date: DateArg<Date>) {
    return format(date, "dd MMM yyyy h:mm a");
}

export const requiredString = (fieldName: string) =>
    z.string().min(1, `${fieldName} is required`);


//time ago
export function timeAgo(date: DateArg<Date> | null | undefined) {
    if (!date) return ''; // 空值保护
    // 尝试解析日期
    const dateObj = new Date(date);
    // 验证日期是否有效
    if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date value in timeAgo:', date);
        return '';
    }
    return formatDistanceToNow(date) + " ago";
    //return formatDistanceToNow(dateObj, { addSuffix: true });
}