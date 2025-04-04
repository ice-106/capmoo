"use client";

import React, { useState } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import TextBox from "./_components/textbox";
import Dropdown from "./_components/dropdown";
import ProfilePhoto from "./_components/profilephoto";
import SearchBar from "./_components/searchbar";

export default function Page() {
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("Use case: prefilled names");
  const [searchQuery, setSearchQuery] = useState("");

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
      <Dropdown
        selected={selected}
        onSelect={setSelected}
        defaultText="Select something bro"
        options={["a", "b", "c", "d", "e"]}
      />
      <p className="mt-4">Current value: {inputValue}</p>
      <button onClick={() => console.log(selected)}>log selected</button>
      <ProfilePhoto 
        allowEdit={true}
      />
      <SearchBar 
        placeholder="Search activities..."
        width="300px"
        defaultValue="Initial search term"
        onChange={(query) => setSearchQuery(query)}
      />    
      </main>
  );
}
