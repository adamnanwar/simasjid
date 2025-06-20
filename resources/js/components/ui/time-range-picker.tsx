import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TimeRangePickerProps {
    startTime: string;
    endTime: string;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
    label?: string;
    required?: boolean;
}

export function TimeRangePicker({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    label = "Rentang Waktu",
    required = false
}: TimeRangePickerProps) {
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(timeString);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">{label} {required && '*'}</Label>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="start-time" className="text-xs text-gray-600">Jam Mulai</Label>
                    <select
                        id="start-time"
                        value={startTime}
                        onChange={(e) => onStartTimeChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        required={required}
                    >
                        <option value="">Pilih jam mulai</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <Label htmlFor="end-time" className="text-xs text-gray-600">Jam Selesai</Label>
                    <select
                        id="end-time"
                        value={endTime}
                        onChange={(e) => onEndTimeChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        required={required}
                    >
                        <option value="">Pilih jam selesai</option>
                        {timeOptions.filter(time => time > startTime).map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {startTime && endTime && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    Preview: {startTime} - {endTime}
                </div>
            )}
        </div>
    );
} 