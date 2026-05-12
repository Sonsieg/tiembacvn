import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FFFDF8", // Nền chính sáng, sạch
          soft: "#FAF7F0",    // Section nền phụ
          warm: "#F5EFE6",    // Card/box nhẹ
        },
        champagne: {
          DEFAULT: "#C9A85D", // CTA chính, sang hơn #D6B56D
          hover: "#B8954F",
          soft: "#EFE2C3",    // Background badge nhẹ
        },
        silver: {
          DEFAULT: "#BFC5CC", // Line, border, icon
          light: "#E6E9ED",
          dark: "#8D96A0",
        },
        navy: {
          DEFAULT: "#162033", // Header/Footer, dịu hơn #0B1220
          deep: "#0F1726",    // Chỉ dùng section premium nhỏ
          soft: "#24314A",    // Hover/navy card
        },
        slate: {
          DEFAULT: "#2F3744", // Text chính, mềm hơn charcoal
          muted: "#687180",   // Text phụ
          light: "#98A1AE",
        },
        sand: {
          DEFAULT: "#E9DED0", // Border/form bg ấm
          soft: "#F3EBDD",
        },
        pearl: "#FFFFFF",
        ice: {
          DEFAULT: "#CFE7EE", // Accent rất nhẹ
          soft: "#EEF8FA",
        },
        success: "#2F6F5E",
        warning: "#B8822B",
        danger: "#B85C5C",
        surface: {
          DEFAULT: "#FFFDF8",
          subtle: "#FAF7F0",
          warm: "#F5EFE6",
          elevated: "#FFFFFF",
          premium: "#162033",
        },
        copy: {
          DEFAULT: "#2F3744",
          muted: "#687180",
          light: "#98A1AE",
          inverse: "#FFFDF8",
        },
        line: {
          DEFAULT: "#E9DED0",
          soft: "#F3EBDD",
          cool: "#E6E9ED",
        },
        cta: {
          DEFAULT: "#C9A85D",
          hover: "#B8954F",
          soft: "#EFE2C3",
          text: "#162033",
        },
        badge: {
          DEFAULT: "#EFE2C3",
          text: "#162033",
          border: "#C9A85D",
        },
        input: {
          DEFAULT: "#FFFFFF",
          muted: "#FAF7F0",
          border: "#E9DED0",
        },
        modal: {
          DEFAULT: "#FFFFFF",
          overlay: "rgba(15, 23, 38, 0.48)",
        },
        drawer: {
          DEFAULT: "#FFFDF8",
          footer: "#FAF7F0",
        },
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(11, 18, 32, 0.05)",
        float: "0 10px 30px -5px rgba(11, 18, 32, 0.08)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
};

export default config;
