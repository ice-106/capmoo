"use client"
import React from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

interface CropperProps {
    src: string;
    onCropComplete: (croppedImage: string) => void;
}

function Cropper({ src, onCropComplete }: CropperProps) {
    const [crop, setCrop] = useState<Crop>();
    const [croppedArea, setCroppedArea] = useState<Crop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // set initial crop area to center of the image and aspect ratio 1:1
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    
        // Make the crop aspect ratio 1:1 (square)
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 80,
                },
                1 / 1, // Aspect ratio 1:1 (square)
                width,
                height
            ),
            width,
            height
        );

        setCrop(crop);
    }
    

    // save crop area data each time the user move / resize the crop area
    const handleCropComplete = (c: Crop) => {
        setCroppedArea(c);
    };

    // helper for confirm function to generate cropped image
    const generateCroppedImage = useCallback(() => {
        if (!croppedArea || !imgRef.current) return;

        const canvas = document.createElement("canvas");
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        canvas.width = croppedArea.width * scaleX;
        canvas.height = croppedArea.height * scaleY;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
            imgRef.current,
            croppedArea.x * scaleX,
            croppedArea.y * scaleY,
            croppedArea.width * scaleX,
            croppedArea.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const base64Image = canvas.toDataURL("image/png");
        onCropComplete(base64Image); // Call the callback function with the cropped image data
    }, [croppedArea, onCropComplete]);

    return (
        <>
            <ReactCrop
                crop={crop}
                onChange={(crop, percentCrop) => setCrop(percentCrop)}
                onComplete={handleCropComplete}
                aspect={1 / 1}
                keepSelection={true}
                circularCrop={true}
                // ruleOfThirds={true}
                className="max-h-[50vh]"
            >
                <Image
                    ref={imgRef}
                    src={src}
                    onLoad={onImageLoad}
                    alt={"Upload Image"}
                    width={1440}
                    height={1440}
                    className="w-auto"
                />
            </ReactCrop>

            {/* Replace with Button component later */}
            <button
                onClick={generateCroppedImage}
                className="bg-orange text-white px-4 py-2 rounded mt-4"
            >
                Confirm
            </button>
        </>
    );
}

export default Cropper;