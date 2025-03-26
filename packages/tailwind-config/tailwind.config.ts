import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      backgroundImage: {
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
      },
      colors: {
        lemon: '#F6BF27',
        orange: '#F28123',
        pumpkin: '#F3752B',
        white: '#FFFFFF',
        lightgrey: '#CCCCCC',
        grey: '#666666',
        darkgrey: '#333333',
        black: '#000000',
        red: '#C12022'
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        ibm_thai: ['var(--font-ibm-plex-sans-thai)'],
        ibm_thai_looped: ['var(--font-ibm-plex-sans-thai-looped)'],
      },
    },
  },
  plugins: [function({addBase}: { addBase: (styles: Record<string, any>) => void })  {
    addBase({
        h1: {
          fontWeight: '700',
          fontSize: '36px',
          lineHeight: '44px',
        },
        h2: {
          fontWeight: '600',
          fontSize: '24px',
          lineHeight: '32px',
        },
        h3: {
          fontWeight: '600',
          fontSize: '20px',
          lineHeight: '28px',
        },
        h4: {
          fontWeight: '600',
          fontSize: '16px',
          lineHeight: '24px',
        },
        p: {
          fontWeight: '400',
          fontSize: '14px',
          lineHeight: '22px',
        },
        button: {
          fontWeight: '600',
          fontSize: '14px',
          lineHeight: '20px',
        },
    })
  },
  ],
};
export default config;
