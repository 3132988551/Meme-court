/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF8',
        milky: '#FFF8E8',
        textDeep: '#333333',
        prosecutor: '#FFB5C2',
        prosecutorBorder: '#C63E4A',
        defender: '#A6D8FF',
        defenderBorder: '#3178C6',
        judge: '#FFE577',
        judgeBorder: '#E49D3B',
        btnPink: '#FF4D8D',
        btnBlue: '#4DA3FF',
        btnGreen: '#3ED598'
      },
      boxShadow: {
        paper: '4px 4px 0 0 rgba(0,0,0,1)'
      },
      borderWidth: {
        '1_5': '1.5px'
      },
      borderRadius: {
        paper: '1.5rem'
      },
      fontFamily: {
        display: ['"Nunito"', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

