'use client'
import React, { useState, useRef } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Header from "../../../../_components/header";
import SubHeaderPayment from "./subheader";
import FooterTemplate from "../../../../_components/footerTemplate";
import Button from "../../../../_components/Button";
import TextBox from "../../../../_components/textbox";
import Dropdown from "../../../../_components/dropdown";
import { MapPin } from "lucide-react";

const dummyTitle = [
    "Wat Phra Kaew", "Siam Amazing Park", "Safari World", "Dream World", "Bang Krachao", "Sea Life Bangkok",
];

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const activityId = params.id as string;
    const name = useRef<HTMLInputElement>(null);
    const tel = useRef<HTMLInputElement>(null);
    const guestNo = useRef<HTMLInputElement>(null);
    const date = useRef<HTMLInputElement>(null);
    const [timeSelected, setTimeSelected] = useState<string[]>([]);

    const mockData = {
        name: dummyTitle[Number(activityId) - 1] || "Capmoo",
        price: 200,
        timeOptions: ['8:00 - 9:00', '9:00 - 10:00']
    };

    const titleData = {
        title: "Booking",
        icon: MapPin,
        text: mockData.name,
    };

    const handleClickPay = () => {
        router.push(`${pathname}/payment?guestNo=${guestNo.current?.value}`);
    };

    const handleClickBack = () => {
        router.back();
    };

    const handleSelectTime = (newSelected: string[]) => {
        const selectedTime = newSelected.length === 2 ? newSelected[1] : newSelected[0];
        setTimeSelected(selectedTime ? [selectedTime] : []);
    };

    return (
        <main className="font-poppins w-full flex flex-col justify-between gap-12 pb-12">
            <Header
                text="Payment"
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
                        Contact Information
                    </h2>
                    <div
                        className="grid grid-cols-[2fr,4fr] gap-4 justify-center items-center w-full"
                    >
                        Name
                        <TextBox
                            ref={name}
                            textSize="small"
                            placeholder="fullname"
                        />
                        Tel
                        <TextBox
                            ref={tel}
                            textSize="small"
                            placeholder="xxx-xxx-xxxx"
                        />
                        Guests
                        <TextBox
                            ref={guestNo}
                            type="number"
                            textSize="small"
                            placeholder="number of guest"
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
                        label="Pay"
                        variant="orange"
                        onClick={handleClickPay}
                    />
                </div>
            </FooterTemplate>
        </main>
    )
}