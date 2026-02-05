import { useState, useEffect } from 'react';

// Hook này trì hoãn việc cập nhật giá trị (chỉ cập nhật sau 500ms)
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Hủy timeout nếu người dùng gõ tiếp
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};