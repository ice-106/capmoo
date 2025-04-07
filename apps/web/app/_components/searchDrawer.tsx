import React, { useState, useLayoutEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import SearchBar from './searchbar';
import Dropdown from './dropdown';
import TextBox from './textbox';

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

  return (
    <div className="fixed inset-0 flex justify-center z-30">
      <div className="absolute w-[375px] top-[7.5rem] bottom-28 bg-white overflow-y-scroll">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }} 
          className="flex flex-col p-6 gap-y-8"
        >
          {/* Back Button and Search Bar */}
          <div className="flex flex-col gap-4 mb-4">
            {/* To Do: Change to Actual Back Button */}
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
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="text-xs italic underline text-orange"
                  >
                    clear
                  </button>
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
                  <button
                    type="button"
                    onClick={clearPrice}
                    className="text-xs italic underline text-orange"
                  >
                    clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-x-2">
                <TextBox
                  placeholder="Min"
                  value={minPrice}
                  onChange={(minPrice) => setMinPrice(minPrice)}
                  width="100%"
                  size="small"
                  variant="light"
                />
                <span className="flex-shrink-0 text-sm">Baht -</span>
                <TextBox
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(maxPrice) => setMaxPrice(maxPrice)}
                  width="100%"
                  size="small"
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
                  <button
                    type="button"
                    onClick={clearCategories}
                    className="text-xs italic underline text-orange"
                  >
                    clear
                  </button>
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