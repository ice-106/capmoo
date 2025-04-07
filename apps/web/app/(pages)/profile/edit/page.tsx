'use client'
import React, { useState } from "react";
import Header from "../../../_components/header";
import ProfilePhoto from "../../../_components/profilephoto";
import TextBox from "../../../_components/textbox";
import Modal from "../../../_components/Modal";
import { PencilLine } from "lucide-react";

export default function ProfileEditPage() {
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [username, setUsername] = useState("username");
    const [newUsername, setNewUsername] = useState(username);

    // Function to handle confirming the new username
    const confirmUsernameChange = () => {
        if (newUsername.trim() === "") {
            return;
        }
        setUsername(newUsername.trim());
        setIsOpenEdit(false);
    };

    const cancelUsernameChange = () => {
        setNewUsername(username);
        setIsOpenEdit(false);
    };

    return (
        <main className="font-poppins w-full">
            <Header text="Profile" />

            {/* Modal for editing username */}
            <UsernameEditModal
                isOpen={isOpenEdit}
                onClose={cancelUsernameChange}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                onConfirm={confirmUsernameChange}
            />

            {/* Main profile edit section */}
            <ProfileSection
                username={username}
                onEditClick={() => setIsOpenEdit(true)}
            />
        </main>
    );
}

interface UsernameEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    newUsername: string;
    setNewUsername: (value: string) => void;
    onConfirm: () => void;
};

// Modal component for username editing
function UsernameEditModal({ isOpen, onClose, newUsername, setNewUsername, onConfirm }: UsernameEditModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-2 bg-white border-2 border-black rounded-md p-4 w-64 z-50">
                <h2 className="text-orange text-lg font-semibold">Edit your username</h2>
                <TextBox
                    placeholder="Enter username"
                    variant="light"
                    errorMessage={newUsername.trim() === "" ? "Username can't be empty" : ""}
                    onChange={setNewUsername}
                />
                <div className="flex justify-between items-center">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </Modal>
    );
}

interface ProfileSectionProps {
    username: string;
    onEditClick: () => void;
};

// Profile section for displaying the username and photo
function ProfileSection({ username, onEditClick }: ProfileSectionProps) {
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    return (
        <div className="flex flex-col gap-4 items-center">
            <ProfilePhoto allowEdit={true} />
            <div className="flex gap-2">
                {username}
                <PencilLine
                    color="orange"
                    onClick={onEditClick}
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
                <div>
                    Name
                </div>
                <TextBox
                    placeholder="Enter name"
                    variant="light"
                    onChange={setName}
                />
                <div>
                    Tel no.
                </div>
                <TextBox
                    placeholder="0XX-XXX-XXXX"
                    variant="light"
                    onChange={setTel}
                />
                <div>
                    Email
                </div>
                <TextBox
                    placeholder="Enter email"
                    variant="light"
                    onChange={setEmail}
                />
                <div>
                    Address
                </div>
                <TextBox
                    placeholder="Enter address"
                    variant="light"
                    onChange={setAddress}
                />
            </div>
        </div>
    );
}
