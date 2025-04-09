"use client";

import React from 'react';
import Header from '../../_components/header';
import Footer from '../../_components/footer';

const scheduleDummy = [
    {
        "activity": "Activity 1",
        "startTime": "2025-03-14T10:00:00Z",
        "endTime": "2025-03-14T13:00:00Z",
    },
    {
        "activity": "Activity 2",
        "startTime": "2023-04-02T12:00:00Z",
        "endTime": "2023-04-02T13:00:00Z",
    }
];

export default function SchedulePage() {
    const { days, previousMonthEndIndex, nextMonthStartIndex } = getCurrentMonthCalendar();

    // Group days into weeks (rows) to create a 7-day calendar layout
    const weeks = [];
    let currentWeek = [];
    for (let i = 0; i < days.length; i++) {
        currentWeek.push(days[i]);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // If there's any remaining days, add them as the last week
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    console.log(weeks);

    return (
        <main className="font-poppins w-full">
            <Header text="Schedule" />

            {/* Main content */}
            <div className="flex flex-col gap-2">
                {/* Day labels */}
                <div className="grid grid-cols-7 gap-0 border-2 border-orange rounded-md p-2">
                    <div className="flex justify-center items-center font-semibold">Sun</div>
                    <div className="flex justify-center items-center font-semibold">Mon</div>
                    <div className="flex justify-center items-center font-semibold">Tue</div>
                    <div className="flex justify-center items-center font-semibold">Wed</div>
                    <div className="flex justify-center items-center font-semibold">Thu</div>
                    <div className="flex justify-center items-center font-semibold">Fri</div>
                    <div className="flex justify-center items-center font-semibold">Sat</div>
                </div>
                {/* Days in the month */}
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-0 border-2 border-orange rounded-md p-2">
                        {week.map((day, dayIndex) => (
                            <div key={dayIndex} className="flex justify-center items-center">
                                {day ? (
                                    <span
                                        className={`${(weekIndex == 0 && dayIndex < previousMonthEndIndex) || (weekIndex == weeks.length - 1 && dayIndex >= nextMonthStartIndex) ? 'text-gray-400' : 'text-black'}`}
                                    >{day}</span>
                                ) : (
                                    <span className="text-gray-400"> </span> // Empty day slots
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Footer />
        </main>
    )
};

const getCurrentMonthCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 - 11
    const currentYear = today.getFullYear();

    // Get the first day of the current month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get the number of days in the previous month
    const previousMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    // Get the first day in the next month in index
    let nextMonthStartIndex = new Date(currentYear, currentMonth + 1, 1).getDay();
    nextMonthStartIndex = nextMonthStartIndex === 0 ? 8 : nextMonthStartIndex;

    // Create an array to represent the calendar days
    const days = [];
    let previousMonthEndIndex = 0;

    // Fill in the previous month's days (leading days)
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push(previousMonthDays - i);
        previousMonthEndIndex++;
    }

    // Fill in the current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    // Fill in the next month's days (trailing days)
    const totalDaysInGrid = days.length;
    const daysNeededForNextMonth = totalDaysInGrid % 7 === 0 ? 0 : 7 - (totalDaysInGrid % 7);
    for (let i = 1; i <= daysNeededForNextMonth; i++) {
        days.push(i);
    }

    return { days, previousMonthEndIndex, nextMonthStartIndex };
};