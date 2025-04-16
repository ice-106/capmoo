"use client";

import Button from "../../../../_components/Button";

const AddReviewFooter: React.FC<{ isFormValid: boolean; handlePost: () => void }> = ({ isFormValid, handlePost }) => {
  return (
    <nav className="fixed h-28 bottom-0 left-0 right-0 flex justify-center items-start bg-white p-4 shadow-lg shadow-darkgrey/50 z-10">
      <div className="w-[375px]">
        <Button label="Post" variant="orange" onClick={handlePost} disabled={!isFormValid}/>
      </div>
    </nav>
  );
};

export default AddReviewFooter;
