import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";

const MAX_IMAGES = 10;

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, MAX_IMAGES - images.length);

    const newImages = fileArray.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-4 overflow-x-auto flex-nowrap pb-2 -mx-6 px-6">
      {images.map((src, index) => (
        <div key={index} className="relative flex-shrink-0 w-24 h-24">
            <Image
                src={src}
                alt={`Uploaded ${index}`}
                width={96}
                height={96}
                className="object-cover rounded-xl"
                style={{ width: '100%', height: '100%' }}
            />
          <button
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      {images.length < MAX_IMAGES && (
        <label className="flex items-center justify-center flex-shrink-0 w-24 h-24 bg-lightgrey rounded-xl cursor-pointer hover:lightgrey transition-colors">
          <Plus className="text-gray-600" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            multiple
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
