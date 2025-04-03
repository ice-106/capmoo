'use client'
import React, { useRef, useState, useEffect } from "react";
import { Pencil } from 'lucide-react';
import Image from "next/image";
import useBanner from "../hooks/useBanner";
import Cropper from "./cropper";

interface ProfilePhotoProps {
    allowEdit?: boolean;
}

const defaultProfilePhoto = '/images/default_profile.png';

export default function ProfilePhoto({ allowEdit = false }: ProfilePhotoProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const { Banner, showBanner, hideBanner } = useBanner();
    const [profilePhoto, setProfilePhoto] = useState('');
    const [croppedPhoto, setCroppedPhoto] = useState('');

    useEffect(() => {
        // Implement later
        fetchProfilePhoto();
    }, [])

    // fetch profile photo
    const fetchProfilePhoto = () => {
        setProfilePhoto('');
    }

    // handle clicking the hidden input button
    const handleClickUpload = () => {
        if (photoInputRef.current) {
            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
            photoInputRef.current.click();
        }
    };

    // read the upload image and open modal for cropping
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onload = () => {
                    openCropper(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
            catch (error) {
                console.error(error);
            }
        }

        // Reset the input value to allow uploading the same file again
        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    };

    const openCropper = (image: string) => {
        showBanner({
            content: (
                <div
                    className="flex flex-col items-center gap-8 w-full h-auto"
                >
                    <h2
                        className="text-orange"
                    >
                        Crop your photo
                    </h2>
                    <Cropper
                        src={image}
                        onCropComplete={(croppedPhoto) => {
                            // Need to actually record in db later
                            setCroppedPhoto(croppedPhoto);
                            setProfilePhoto(croppedPhoto);
                            hideBanner();
                        }}
                    />
                </div>
            ),
            size: "md",
        });
    };

    return (
        <>
            <div
                className="relative w-44 h-44"
            >
                <div
                    className="flex justify-center items-center w-full h-full rounded-full overflow-hidden border-2 border-lightgrey"
                >
                    {/* Display profile photo if available */}
                    <Image
                        src={profilePhoto ? profilePhoto : defaultProfilePhoto}
                        alt="Profile"
                        width={144}
                        height={144}
                        className="w-full h-full object-cover"
                    />
                </div>
                {allowEdit && (
                    <div
                        className="absolute bottom-0 right-0 p-2 flex justify-center items-center w-10 h-10 rounded-full bg-orange cursor-pointer"
                        onClick={handleClickUpload}
                    >
                        <Pencil
                            color='white'
                        />
                    </div>
                )}
            </div>

            {/* Crop banner */}
            <Banner />

            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                className="hidden"
                ref={photoInputRef}
                onChange={handleFileChange}
            />
        </>
    )
}