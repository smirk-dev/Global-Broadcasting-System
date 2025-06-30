# Global Broadcasting System

A modern, interactive 3D broadcasting dashboard built with React, Three.js (via @react-three/fiber), and Tailwind CSS. Visualize global broadcast stations on a realistic 3D Earth, manage channels, and monitor live analytics.

## Features

- 🌍 **3D Interactive Earth**: Realistic, rotatable globe with broadcast station markers.
- 📡 **Live Broadcast Panel**: View, manage, and control global broadcast stations.
- 🛰️ **Channel Manager**: Add, edit, or remove broadcast stations.
- 📊 **Analytics**: See coverage, uptime, and peak hours.
- 🎨 **Beautiful UI**: Built with Tailwind CSS and Lucide React icons.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```
The output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment

You can deploy the contents of the `dist` folder to any static hosting service, such as:

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── EarthViewer.tsx
│   │   ├── BroadcastPanel.tsx
│   │   ├── ChannelManager.tsx
│   │   └── StatusBar.tsx
│   ├── types/
│   │   └── broadcast.types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── ...
```

## Customization

- **Add/Remove Stations:** Use the Channel Manager panel.
- **Change Earth Texture:** Update the texture URL in `src/components/EarthViewer.tsx` inside the `useEffect` hook.
- **UI Styling:** Modify Tailwind classes in the component files.

## License

This project is for educational and demonstration purposes.

---

**Made with React, Three.js, Tailwind CSS,