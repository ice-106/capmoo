"use client";

import React, { useState } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import TextBox from "./_components/textbox";

export default function Page() {
  const [inputValue, setInputValue] = useState("Use case: prefilled names"); // Prefilled value

  return (
    <main className="font-poppins w-full">
      <Header text="Page" />
      <Footer />
      This is a page
      <TextBox
        placeholder="Type here"
        width="18rem"
        errorMessage="Here's sample with error"
      />
      <TextBox
        placeholder="Enter text here"
        value={inputValue} // Controlled value
        onChange={(value) => setInputValue(value)}
        errorMessage={inputValue === "" ? "This field is required" : ""}
      />
      <p className="mt-4">
        Just to Show It Works, Current Input Value: {inputValue}
      </p>
    </main>
  );
}
