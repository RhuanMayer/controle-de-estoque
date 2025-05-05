// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // seu conteúdo normal
    theme: {
      extend: {},
    },
    plugins: [
      require('tailwind-scrollbar'), // 👈 ADICIONA ISSO AQUI
    ],
  }
  