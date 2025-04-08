import React, { useState, useLayoutEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import SearchBar from './searchbar';
import Dropdown from './dropdown';
import TextBox from './textbox';
import TextBtn from './textBtn';
import { useSwipeGesture } from '../_hooks/useSwipeGesture';

interface SearchDrawerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  placeholder?: string;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({
  value,
  onChange,
  onSubmit,
  onClose,
  placeholder = 'Search...'
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Create refs for the TextBox components
  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
  
  // Use our custom hook
  const [translateX, swipeHandlers] = useSwipeGesture({
    direction: 'right',
    onSwipeComplete: onClose
  });

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const clearLocation = () => setSelectedLocation([]);
  
  const clearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
  };
  
  const clearCategories = () => setSelectedCategories([]);

  // Handle text input changes
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  // Get all form values for submission
  const getFormValues = () => {
    return {
      searchTerm: value,
      location: selectedLocation,
      minPrice: minPrice,
      maxPrice: maxPrice,
      categories: selectedCategories
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form values:', getFormValues());
    onSubmit();
  };

  return (
    <div className="fixed inset-0 flex justify-center z-30">
      <div 
        className="absolute w-[375px] top-[7.5rem] bottom-28 bg-white overflow-y-scroll"
        style={swipeHandlers.style}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col p-6 gap-y-8"
        >
          {/* Back Button and Search Bar */}
          <div className="flex flex-col gap-4 mb-4">
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-2"
            >
              <ArrowLeft size={24} />
            </button>
            <SearchBar
              placeholder={placeholder}
              defaultValue={value}
              onSearch={onSubmit}
              onChange={onChange}
              enableDrawer={false}
            />
          </div>

          <div className="flex flex-col gap-y-6">
            {/* Location Dropdown */}
            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between items-center">
                <h3>Location</h3>
                {selectedLocation.length > 0 && (
                  <TextBtn text="clear" onClick={clearLocation} />
                )}
              </div>
              <Dropdown
                selected={selectedLocation}
                onSelect={setSelectedLocation}
                defaultText="Select Area"
                options={['Area 1', 'Area 2', 'Area 3']}
              />
            </div>

            {/* Price Range Inputs */}
            <div className="flex flex-col gap-y-2 mt-4">
              <div className="flex justify-between items-center">
                <h3>Price</h3>
                {(minPrice || maxPrice) && (
                  <TextBtn text="clear" onClick={clearPrice} />
                )}
              </div>
              <div className="flex items-center gap-x-2">
                <TextBox
                  ref={minPriceRef}
                  placeholder="Min"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  width="100%"
                  textSize="small"
                  variant="light"
                />
                <span className="flex-shrink-0 text-sm">Baht -</span>
                <TextBox
                  ref={maxPriceRef}
                  placeholder="Max"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  width="100%"
                  textSize="small"
                  variant="light"
                />
                <span className="flex-shrink-0 text-sm">Baht</span>
              </div>
            </div>

            {/* Category Checkboxes */}
            <div className="flex flex-col gap-y-2 mt-4">
              <div className="flex justify-between items-center">
                <h3>Category</h3>
                {selectedCategories.length > 0 && (
                  <TextBtn text="clear" onClick={clearCategories} />
                )}
              </div>
              <Dropdown
                selected={selectedCategories}
                onSelect={setSelectedCategories}
                defaultText="Select Categories"
                options={['Option 1', 'Option 2', 'Option 3']}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange text-white py-2 rounded-lg hover:bg-orange/90 transition-colors mt-6"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchDrawer;