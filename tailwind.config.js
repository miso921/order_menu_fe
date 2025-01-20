/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "pretendard-regular": ["Pretendard-Regular", "sans-serif"],
                "paperlogy-8ExtraBold": ["Paperlogy-8ExtraBold", "sans-serif"],
            },
        },
    },
    plugins: [
        // eslint-disable-next-line no-undef
        require("tailwind-scrollbar-hide"), // 추가된 플러그인
    ],
};
