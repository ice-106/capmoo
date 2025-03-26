"use client";

import React, { useState } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import TextBox from "./_components/textbox";

export default function Page() {
  const [inputValue, setInputValue] = useState("Use case: prefilled names");
  const [errorMessage, setErrorMessage] = useState("");

  const handleBlur = (value: string) => {
    setInputValue(value);
    if (value.trim() === "") {
      setErrorMessage("This field is required");
    } else {
      setErrorMessage("");
    }
  };

  return (
    <main className="font-poppins w-full">
      <Header text="Page" />
      <Footer />
      This is a page
      <TextBox
        name="test"
        placeholder="Enter text here"
        defaultValue={inputValue}
        errorMessage={errorMessage}
        onBlur={handleBlur} // Validate on blur
      />
      <p className="mt-4">Value after blur: {inputValue}</p>
    </main>
  );
}
