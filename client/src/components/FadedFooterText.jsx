// FadedFooterText.jsx
import React from "react";

const FadedFooterText = ({ text }) => {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden w-full flex items-center justify-center pt-1px">
      <p className="text-[19vw] font-extrabold text-green-200 opacity-20 tracking-wide select-none whitespace-nowrap leading-none">
        {text}
      </p>
    </div>
  );
};

export default FadedFooterText;
 