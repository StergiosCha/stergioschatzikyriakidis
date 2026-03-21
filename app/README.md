# Stergios Chatzikyriakidis - Academic Website

Personal academic website for Professor Stergios Chatzikyriakidis, Professor of Computational Linguistics at the University of Crete.

## Features

- Modern editorial design with smooth scroll-driven animations
- Responsive layout for all devices
- GSAP ScrollTrigger animations with pinned sections
- Publications, Software, and Datasets showcase
- Contact section with direct email links

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- GSAP (ScrollTrigger)
- shadcn/ui components

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `stergioschatzikyriakidis` (or any name you prefer)
3. Make it public

### Step 2: Update vite.config.ts

The vite.config.ts is already configured for GitHub Pages deployment with the `base` path.

If your repository name is different, update the `base` in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/your-repo-name/',  // Change this to match your repo name
  // ... rest of config
})
```

### Step 3: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/stergioschatzikyriakidis.git

# Push
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Source", select **GitHub Actions**
4. The deployment workflow will run automatically

### Step 5: Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will:
- Build the site on every push to main
- Deploy to GitHub Pages automatically

Your site will be available at: `https://YOUR_USERNAME.github.io/stergioschatzikyriakidis/`

## Adding Your Photo

To replace the AI-generated images with your actual photo:

1. Add your photo to `/public/images/`
2. Name it `hero-portrait.jpg` (or update the imports in the section files)
3. Recommended size: 3:4 aspect ratio, at least 800x1000px
4. Rebuild and redeploy

## Customization

### Update Publications

Edit `/src/data/publications.ts` to add or modify publications.

### Update Software/Datasets

Edit `/src/data/tools.ts` to add or modify software tools and datasets.

### Update Colors

Edit the CSS variables in `/src/App.css`:

```css
:root {
  --bg-primary: #E9E6E1;
  --bg-secondary: #111111;
  --accent: #D06D48;
  --text-primary: #111111;
  --text-secondary: #6E6A63;
}
```

## License

© Stergios Chatzikyriakidis. All rights reserved.
