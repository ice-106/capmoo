'use client'
import React from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../../_components/header";
import FooterTemplate from "../../../../../_components/footerTemplate";
import SubHeaderPayment from "../../../../activity/[id]/booking/subheader";
import Button from "../../../../../_components/Button";
import { Handshake, BadgeCheck } from "lucide-react";

const titleData = {
    title: "Activity Created Successfully",
    icon: Handshake,
    text: `Thank You`,
};

export default function Page() {
    const router = useRouter();


    return (
        <main className="font-poppins w-full flex flex-col justify-between gap-12 pb-12">
            <Header
                text="Payment"
            />
            <div
                className="flex flex-col justify-center gap-8 w-full"
            >
                <SubHeaderPayment
                    currentStep={3}
                    title={titleData.title}
                    icon={titleData.icon}
                    text={titleData.text}
                    closingIcon={true}
                />
                <div
                    className="flex justify-center"
                >
                    <BadgeCheck
                        size={256}
                    />
                </div>

            </div>

            <FooterTemplate>
                <Button
                    label="Back to menu"
                    variant="orange"
                    onClick={() => router.push("/vendor/profile")}
                />
            </FooterTemplate>
        </main>
    )
}