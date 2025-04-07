'use client'
import React, { useState } from "react";
import Header from "../../../_components/header";
import ProfilePhoto from "../../../_components/profilephoto";
import TextBox from "../../../_components/textbox";
import { PencilLine } from "lucide-react";

export default function ProfileEditPage() {
    const [username, setUsername] = useState("username");
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(username);

    return (
        <main className="font-poppins w-full">
            <Header text="Profile" />
            <div className="flex flex-col gap-4 items-center">
                <ProfilePhoto
                    allowEdit={true}
                />
                <div
                    className="flex gap-2"
                >
                    {editingUsername ? (
                        <div
                            className="flex flex-col gap-2 w-full"
                        >
                            <TextBox
                                placeholder="Enter username"
                                defaultValue={newUsername}
                                errorMessage={newUsername.trim() === "" ? "Username can't be empty" : ""}
                                onChange={setNewUsername}
                            />
                            <div
                                className="flex justify-between items-center"
                            >
                                <button
                                    onClick={() => {
                                        setNewUsername(username);
                                        setEditingUsername(false);
                                    }}
                                >
                                    cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (newUsername.trim() === "") {
                                            return;
                                        }

                                        setUsername(newUsername);
                                        setEditingUsername(false);
                                    }}
                                >
                                    confirm
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {username}
                            <PencilLine
                                color="orange"
                                onClick={() => setEditingUsername(true)}
                                className="cursor-pointer"
                            />
                        </>

                    )}
                </div>
            </div>
        </main >
    );
}