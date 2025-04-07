'use client'
import React, { useState, useRef } from "react";
import Header from "../../../_components/header";
import ProfilePhoto from "../../../_components/profilephoto";
import TextBox from "../../../_components/textbox";
import Modal from "../../../_components/Modal";
import { PencilLine } from "lucide-react";

export default function ProfileEditPage() {
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [username, setUsername] = useState("username");
    const newUsername = useRef<HTMLInputElement>(null);
    const name = useRef<HTMLInputElement>(null);
    const tel = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const address = useRef<HTMLInputElement>(null);
    const [error, setError] = useState({
        name: false,
        tel: false,
        email: false,
        address: false,
    });

    // Function to handle confirming the new username
    const confirmUsernameChange = () => {
        if (!newUsername.current || newUsername.current.value.trim() === "") {
            return;
        }
        setUsername(newUsername.current.value);
        setIsOpenEdit(false);
    };

    const cancelUsernameChange = () => {
        setIsOpenEdit(false);
    };

    return (
        <main className="font-poppins w-full">
            <Header text="Profile" />

            <Modal isOpen={isOpenEdit} onClose={cancelUsernameChange}>
                <div className="flex flex-col gap-2 bg-white border-2 border-black rounded-md p-4 w-64 z-50">
                    <h2 className="text-orange text-lg font-semibold">Edit your username</h2>
                    <TextBox
                        placeholder="Enter username"
                        variant="light"
                        errorMessage={newUsername.current?.value.trim() === "" ? "Username can't be empty" : ""}
                        ref={newUsername}
                    />
                    <div className="flex justify-between items-center">
                        <button onClick={cancelUsernameChange}>Cancel</button>
                        <button onClick={confirmUsernameChange}>Confirm</button>
                    </div>
                </div>
            </Modal>

            {/* Main profile edit section */}
            <div className="flex flex-col gap-4 items-center">
                <ProfilePhoto allowEdit={true} />
                <div className="flex gap-2 pl-[26px]">
                    {username}
                    <PencilLine
                        color="orange"
                        onClick={() => setIsOpenEdit(true)}
                        className="cursor-pointer"
                    />
                </div>
                <h3
                    className="w-full"
                >
                    Contact Information
                </h3>
                <div
                    className="grid grid-cols-[1fr,3fr] gap-4 justify-center items-center"
                >
                    Name
                    <TextBox
                        placeholder="Enter name"
                        variant="light"
                        ref={name}
                    />
                    Tel no.
                    <TextBox
                        placeholder="0XX-XXX-XXXX"
                        variant="light"
                        ref={tel}
                    />
                    Email
                    <TextBox
                        placeholder="Enter email"
                        variant="light"
                        ref={email}
                    />
                    Address
                    <TextBox
                        placeholder="Enter address"
                        variant="light"
                        ref={address}
                    />
                </div>
            </div>

            {/* <button
                onClick={() =>
                    setError(prevState => ({
                        ...prevState,
                        name: !error.name,
                    }))}
            >Show error</button> */}

            {/* <button
                onClick={() => {
                    console.log("Name:", name.current?.value);
                    console.log("Tel:", tel.current?.value);
                    console.log("Email:", email.current?.value);
                    console.log("Address:", address.current?.value);
                    console.log("Username:", username);
                    // Add your save logic here
                } }
                className="bg-orange text-white rounded-md p-2 mt-4"
            >
                Save
            </button> */}
        </main>
    );
};
