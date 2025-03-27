"use client";

import React, { useState } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import TextBox from "./_components/textbox";

export default function Page() {
  const [inputValue, setInputValue] = useState("Use case: prefilled names");

  return (
    <main className="font-poppins w-full">
      <Header text="Page" />
      <Footer />
      This is a page
      <TextBox
        name="test"
        placeholder="Enter text here"
        defaultValue={inputValue}
        errorMessage={inputValue === "" ? "Input can't be empty" : ""}
        onChange={(value) => setInputValue(value)} // Update state on change
      />
      <p className="mt-4">Current value: {inputValue}</p>
    </main>
  );
}