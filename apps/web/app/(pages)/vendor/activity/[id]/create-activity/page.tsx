'use client'
import React, { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "../../../../../_components/header";
import SubHeaderPayment from "./subheader";
import FooterTemplate from "../../../../../_components/footerTemplate";
import Button from "../../../../../_components/Button";
import TextBox from "../../../../../_components/textbox";
import Dropdown from "../../../../../_components/dropdown";
import { MapPin } from "lucide-react";

const mockData = {
    name: "Capmoo Adventure",
    price: 200,
    timeOptions: ['8:00 - 9:00', '9:00 - 10:00'],
    activityOptions: [
        "Food & Cooking",
        "Arts & Crafts",
        "Music & Performance",
        "Nature & Outdoors",
        "Culture & History",
        "Health & Wellness"
      ]
};

const titleData = {
    title: "Let’s set up your activity!",
    icon: MapPin,
    text: mockData.name,
};

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const name = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const guestNo = useRef<HTMLInputElement>(null);
    const date = useRef<HTMLInputElement>(null);
    const [timeSelected, setTimeSelected] = useState<string[]>([]);
    const [categorySelected, setCategorySelected] = useState<string[]>([]);

    const handleClickContinue = () => {
        router.push(`/vendor/activity/[id]/create-activity/page2`);
    };

    const handleClickBack = () => {
        router.back();
    };

    const handleSelectTime = (newSelected: string[]) => {
        const selectedTime = newSelected.length === 2 ? newSelected[1] : newSelected[0];
        setTimeSelected(selectedTime ? [selectedTime] : []);
    };

    const handleSelectCategory = (newSelected: string[]) => {
        const selectedCategory = newSelected.length === 2 ? newSelected[1] : newSelected[0];
        setCategorySelected(selectedCategory ? [selectedCategory] : []);
    };

    return (
        <main className="font-poppins w-full flex flex-col justify-between gap-12 pb-12">
            <Header
                text="Let’s set up your activity!"
            />
            <div
                className="flex flex-col justify-center gap-8 w-full"
            >
                <SubHeaderPayment
                    currentStep={1}
                    title={titleData.title}
                    icon={titleData.icon}
                    text={titleData.text}
                />
                <div
                    className="flex flex-col justify-center gap-4"
                >
                    <h2>
                        Activity Details
                    </h2>
                    <div
                        className="grid grid-cols-[2fr,4fr] gap-4 justify-center items-center w-full"
                    >
                        Name
                        <TextBox
                            ref={name}
                            textSize="small"
                            placeholder="activityname"
                        />
                        Description
                        <TextBox
                            type="textarea"
                            sizeVariant="big"
                            placeholder="Write an activity description"
                        />


                        Category
                        <Dropdown
                            selected={categorySelected}
                            onSelect={handleSelectCategory}
                            options={mockData.activityOptions}
                            defaultText="select category"
                        />
                    </div>

                    <h2>
                        Schedule
                    </h2>
                    <div
                        className="grid grid-cols-[2fr,4fr] gap-4 justify-center items-center w-full"
                    >
                        Date
                        <TextBox
                            ref={date}
                            type="date"
                            textSize="small"
                            placeholder="fullname"
                        />
                        Time
                        <Dropdown
                            selected={timeSelected}
                            onSelect={handleSelectTime}
                            options={mockData.timeOptions}
                            defaultText="select time"
                        />
                    </div>
                    
                </div>
            </div>
            <FooterTemplate>
                <div
                    className="flex justify-between items-center gap-4 px-4"
                >
                    <Button
                        label="Back"
                        onClick={handleClickBack}
                    />
                    <Button
                        label="Continue"
                        variant="orange"
                        onClick={handleClickContinue}
                    />
                </div>
            </FooterTemplate>
        </main>
    )
}