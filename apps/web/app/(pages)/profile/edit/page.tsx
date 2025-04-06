'use client'
import React from "react";
import Header from "../../../_components/header";

export default function ProfileEditPage() {
    return (
        <main className="font-poppins w-full">
            <Header text="Profile" />
            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <h1>Edit Profile</h1>
                    </div>
                </div>
            </div>
        </main>
    );
}