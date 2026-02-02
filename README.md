# Remotion Videos

Marketing and demo videos built with [Remotion](https://remotion.dev/).

## 🎬 Rendered Videos

| Video | Description | Duration | Download |
|-------|-------------|----------|----------|
| **ChatbotSalesDemo** | AI chatbot capturing leads in real-time | 51s | [▶️ Download](https://minio.524013333.xyz/videos/chatbot-sales-demo.mp4) |
| **ChatbotBuilderDemo** | Chatbot builder interface walkthrough | 45s | [▶️ Download](https://minio.524013333.xyz/videos/chatbot-builder-demo.mp4) |
| **LogoIntro** | SmallERP animated logo intro | 5s | [▶️ Download](https://minio.524013333.xyz/videos/logo-intro.mp4) |
| **SmallERPExplainer** | Full product explainer video | 60s | [▶️ Download](https://minio.524013333.xyz/videos/smallerp-explainer.mp4) |

## 📁 Source Files

```
src/
├── ChatbotSalesDemo.tsx    # AI sales chatbot demo
├── ChatbotBuilderDemo.tsx  # Builder interface demo
├── LogoIntro.tsx           # Animated logo
├── SmallERPExplainer.tsx   # Product explainer
├── InstagramReel*.tsx      # Various marketing reels
├── Dashboard*.tsx          # Dashboard demos
└── components/             # Shared UI components
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Preview in browser
npm start

# Render specific video
npx remotion render ChatbotSalesDemo out/chatbot-demo.mp4

# Render all
npx remotion render
```

## 🎨 Video Specs

- **Resolution:** 1080x1920 (9:16 portrait) for reels, 1920x1080 for demos
- **FPS:** 30
- **Codec:** H.264
- **Format:** MP4

## 📦 Tech Stack

- [Remotion](https://remotion.dev/) - React video framework
- TypeScript
- Tailwind CSS (inline styles)
