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
        // 还原：右下 4px 的纯黑纸片投影（原始风格）
        paper: '4px 4px 0 0 rgba(0,0,0,1)'
      },
      borderWidth: {
        '1_5': '1.5px'
      },
      borderRadius: {
        // 还原较大的卡片圆角，贴近原版“纸片”观感
        paper: '1.5rem'
      },
      fontFamily: {
        // 中文优先，其次英文字体；回退到系统字体
        zh: ['"Noto Sans SC"', '"ZCOOL KuaiLe"', 'system-ui', 'sans-serif'],
        en: ['"Poppins"', '"Fredoka"', 'system-ui', 'sans-serif'],
        display: ['"ZCOOL KuaiLe"', '"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans SC"', '"Poppins"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
