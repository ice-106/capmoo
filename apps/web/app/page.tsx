"use client";

import React, { useRef, useState } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import TextBox from "./_components/textbox";
import Dropdown from "./_components/dropdown";
import ProfilePhoto from "./_components/profilephoto";
import IconWithLabel from "./_components/iconwithlabel";
import { MapPin } from "lucide-react";
import SearchBar from "./_components/searchbar";

export default function Page() {
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };

  // Validate on blur
  const validateInput = () => {
    const isEmpty = input1Ref.current?.value === "";
    setHasError(isEmpty || false);
  };

  return (
    <main className="font-poppins w-full">
      <Header text="Page" />
      <Footer />
      This is a page
      <TextBox
        ref={input1Ref}
        name="defaultExample"
        placeholder="Enter text here"
        // No value prop for uncontrolled
        defaultValue="" // Use defaultValue instead
        onBlur={validateInput}
        errorMessage={hasError ? "Input can't be empty" : ""}
      />
      <TextBox
        ref={input2Ref}
        name="defaultExample"
        placeholder="Enter text here"
        value={inputValue}
        onChange={handleInputChange}
        errorMessage={inputValue === "" ? "Input can't be empty" : ""}
      />
      <Dropdown
        selected={selected}
        onSelect={setSelected}
        defaultText="Select something bro"
        options={["a", "b", "c", "d", "e"]}
      />
      <p className="mt-4">Current value 1: {input1Ref.current?.value}</p>
      <p className="mt-4">Current value 2: {input2Ref.current?.value}</p>

      <button onClick={() => {
        console.log("Input value:", input1Ref.current?.value);
        console.log("Selected:", selected);
      }}>
        Log values
      </button>
      <ProfilePhoto allowEdit={true} />
      <IconWithLabel icon={MapPin} label="Chulalongkorn University" size={24} />
      <SearchBar 
        onSearch={(value => console.log(value))}
        placeholder="Search..."
        enableDrawer={true}
      />
    </main>
  );
}