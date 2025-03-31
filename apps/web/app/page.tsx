'use client';

import React, { useState } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import TextBox from "./_components/textbox";
import Dropdown from "./_components/dropdown";
import Galleryr from './_components/galleryrect';  // Import the Gallery component
import Gallerys from './_components/gallerysquare';  // Import the Gallery component
// Sample posts data for the gallery
const posts = [
  {
    id: 'post1',
    images: [
      {
        src: 'https://m.media-amazon.com/images/M/MV5BNDUwNjBkMmUtZjM2My00NmM4LTlmOWQtNWE5YTdmN2Y2MTgxXkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',
      },
      {
        src: 'https://m.media-amazon.com/images/M/MV5BNDUwNjBkMmUtZjM2My00NmM4LTlmOWQtNWE5YTdmN2Y2MTgxXkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',
      },
      {
        src: 'https://m.media-amazon.com/images/M/MV5BNDUwNjBkMmUtZjM2My00NmM4LTlmOWQtNWE5YTdmN2Y2MTgxXkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',
      },
      {
        src: 'https://m.media-amazon.com/images/M/MV5BNDUwNjBkMmUtZjM2My00NmM4LTlmOWQtNWE5YTdmN2Y2MTgxXkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',
      },
      {
        src: 'https://m.media-amazon.com/images/M/MV5BNDUwNjBkMmUtZjM2My00NmM4LTlmOWQtNWE5YTdmN2Y2MTgxXkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',
      },
    ],
  },
];

export default function Page() {
  const [selected, setSelected] = useState<string[]>([]);
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
      <Dropdown 
        selected={selected}
        onSelect={setSelected}
        defaultText="Select something bro"
        options={["a", "b", "c", "d", "e"]}
      />
      <p className="mt-4">Current value: {inputValue}</p>
      <button
        onClick={() => console.log(selected)}
      >log selected</button>

      {/* Pass the images array directly to the Gallery component */}
      <Galleryr images={posts[0].images} />
    </main>
  );
}
