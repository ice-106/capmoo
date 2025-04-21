'use client'
import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FooterTemplate from "../../../_components/footerTemplate";
import TextBox from "../../../_components/textbox";
import Button from "../../../_components/Button";

export default function Page() {
    const router = useRouter();
    const vendorID = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleVendorLogin = () => {
        if (!vendorID.current || !password.current)
            return;

        if (vendorID.current.value !== "capmoo_meth" || password.current.value !== "12345") {
            vendorID.current.value = '';
            password.current.value = '';
            alert("Incorrect information");
            return;
        }

        router.push("/vendor/activity");
    };

    return (
        <main className="font-poppins w-full relative flex flex-col justify-between gap-12 pb-12 pt-[240px]">
            <div
                className={`absolute top-[-512px] left-[50%] -translate-x-1/2 flex justify-center items-end h-[720px] w-[720px] pb-16 rounded-full bg-pumpkin-lemon`}
            >
                <Image
                    src="/images/Logo.png"
                    alt="Capmoo"
                    width={144}
                    height={144}
                    className="w-[144px] h-auto"
                />
            </div>
            <div
                className="flex flex-col items-center gap-4 w-full text-center"
            >
                <h1
                    className="text-5xl text-black"
                >
                    Vendor Portal
                </h1>
                <span
                    className="font-semibold text-xs"
                >
                    <span className="font-normal">become a vendor by contacting us via</span>
                    <br />
                    admin@capmoo.com
                </span>
            </div>
            <div
                className="grid grid-cols-[2fr,4fr] gap-4 justify-center items-center w-full"
            >
                Vendor ID
                <TextBox
                    ref={vendorID}
                    placeholder="vendor Id"
                    variant="light"
                />
                Password
                <TextBox
                    ref={password}
                    placeholder="*********"
                    type="password"
                    variant="light"
                />
            </div>
            <div
                className="px-8"
            >
                <Button
                    label="Submit"
                    variant="orange"
                    onClick={handleVendorLogin}
                />
            </div>
            <FooterTemplate>
                <div
                    className="flex justify-center"
                >
                    <a
                        href="/"
                        className="underline text-grey"
                    >
                        back
                    </a>
                </div>
            </FooterTemplate>
        </main>
    );
};