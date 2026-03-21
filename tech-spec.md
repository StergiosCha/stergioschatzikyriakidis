# Technical Specification — Stergios Chatzikyriakidis Website

## 1. Component Inventory

### shadcn/ui Components (built-in)
- **Button** — CTAs throughout
- **Card** — publication cards, tool cards
- **Separator** — dividers between sections
- **Sheet** — mobile navigation overlay

### Custom Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `Navigation` | Persistent header with wordmark + links | `isScrolled: boolean` |
| `MobileMenu` | Full-screen overlay menu | `isOpen, onClose` |
| `AccentShape` | Reusable geometric accent (ring/circle/arc/triangle) | `type, className` |
| `PinnedSection` | Wrapper for pinned scroll sections | `children, className, id` |
| `PublicationCard` | Publication item with hover effects | `title, authors, venue, year, link` |
| `ToolCard` | Software/tool item card | `name, description, links[]` |

### Section Components
- `HeroSection` — Section 1 (auto-play entrance + scroll exit)
- `BioSection` — Section 2
- `ResearchSection` — Section 3
- `SoftwareSection` — Section 4
- `NovelistSection` — Section 5
- `OutputsSection` — Section 6 (flowing, not pinned)
- `ContactSection` — Section 7

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero auto-play entrance | GSAP | Timeline on mount, no ScrollTrigger | Medium |
| Hero scroll exit | GSAP ScrollTrigger | `scrub: 0.5`, fromTo transforms | Medium |
| Pinned section entrances | GSAP ScrollTrigger | Three-phase timeline (0-30%, 30-70%, 70-100%) | High |
| Pinned section exits | GSAP ScrollTrigger | Same timeline, exit phase transforms | High |
| Accent shape scale/rotate | GSAP ScrollTrigger | Continuous subtle animation during settle | Low |
| Content slide-ins | GSAP ScrollTrigger | fromTo with x/y/opacity | Medium |
| Flowing section reveals | GSAP ScrollTrigger | Batch stagger for list items | Low |
| Publication hover | CSS | transform + underline transition | Low |
| Mobile menu | Framer Motion | AnimatePresence for enter/exit | Low |
| Global scroll snap | GSAP ScrollTrigger | Global snap function targeting pinned centers | High |

### Animation Library Choices
- **GSAP + ScrollTrigger**: All scroll-driven animations, pinned sections, global snap
- **CSS Transitions**: Hover states, simple transforms
- **Framer Motion**: Mobile menu overlay (AnimatePresence)

---

## 3. Animation Library Rationale

**GSAP + ScrollTrigger (primary)**
- Best-in-class scroll-linked animations with `scrub`
- Precise control over three-phase timelines (entrance/settle/exit)
- Reliable `pin: true` with proper cleanup
- Global snap implementation for pinned sections

**CSS Transitions**
- Lightweight for hover effects
- Better performance for simple transforms

**Framer Motion**
- Clean enter/exit animations for mobile menu
- AnimatePresence handles unmounting gracefully

---

## 4. Project File Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sheet.tsx
│   │   ├── Navigation.tsx         # Persistent header
│   │   ├── MobileMenu.tsx         # Mobile overlay
│   │   ├── AccentShape.tsx        # Geometric accents
│   │   ├── PublicationCard.tsx    # Publication item
│   │   └── ToolCard.tsx           # Software tool card
│   ├── sections/
│   │   ├── HeroSection.tsx        # Section 1
│   │   ├── BioSection.tsx         # Section 2
│   │   ├── ResearchSection.tsx    # Section 3
│   │   ├── SoftwareSection.tsx    # Section 4
│   │   ├── NovelistSection.tsx    # Section 5
│   │   ├── OutputsSection.tsx     # Section 6 (flowing)
│   │   └── ContactSection.tsx     # Section 7
│   ├── hooks/
│   │   ├── useScrollProgress.ts   # Scroll position tracking
│   │   └── useMediaQuery.ts       # Responsive detection
│   ├── lib/
│   │   ├── utils.ts               # cn() and utilities
│   │   └── animations.ts          # GSAP animation configs
│   ├── data/
│   │   ├── publications.ts        # All publication data
│   │   └── tools.ts               # Software/tools data
│   ├── App.tsx                    # Main app + routing
│   ├── App.css                    # Global styles
│   ├── index.css                  # Tailwind imports
│   └── main.tsx                   # Entry point
├── public/
│   ├── images/                    # All photos
│   │   ├── hero-portrait.jpg
│   │   ├── bio-portrait.jpg
│   │   ├── research-photo.jpg
│   │   ├── software-photo.jpg
│   │   └── novelist-photo.jpg
│   └── grain.png                  # Texture overlay
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 5. Dependencies

### Core
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### Animation
```json
{
  "gsap": "^3.12.0",
  "@gsap/react": "^2.1.0",
  "framer-motion": "^10.16.0"
}
```

### UI
```json
{
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.294.0"
}
```

### Fonts
- Google Fonts: `Space Grotesk`, `Inter`, `IBM Plex Mono`

---

## 6. Key Implementation Details

### Pinned Section Pattern
```tsx
// Each pinned section follows this structure
<section className="pinned-section" id="section-id">
  <div className="section-content">
    {/* Absolutely positioned elements */}
  </div>
</section>

// GSAP setup
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "+=130%",
  pin: true,
  scrub: 0.5,
  onUpdate: (self) => {
    // Progress-based animation control
  }
});
```

### Global Scroll Snap
```tsx
// Implemented once in App.tsx after all sections mounted
ScrollTrigger.create({
  snap: {
    snapTo: (progress) => {
      // Calculate nearest pinned section settle point
      // Return snap target or original progress for flowing sections
    },
    duration: { min: 0.18, max: 0.55 },
    delay: 0,
    ease: "power2.out"
  }
});
```

### Three-Phase Animation Timeline
```tsx
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top top",
    end: "+=130%",
    pin: true,
    scrub: 0.5
  }
});

// Phase 1: Entrance (0-30%)
tl.fromTo(element, { x: -50, opacity: 0 }, { x: 0, opacity: 1 }, 0);

// Phase 2: Settle (30-70%) - no animation, hold state

// Phase 3: Exit (70-100%)
tl.to(element, { x: 50, opacity: 0.25 }, 0.7);
```

### Responsive Strategy
- Desktop: Full compositions as designed
- Tablet: Reduced shape sizes, maintained layout
- Mobile: Stacked layout, smaller shapes, same content

---

## 7. Performance Considerations

- Use `will-change: transform` on animated elements
- Avoid animating layout properties (width, height)
- Use `transform` and `opacity` only
- Lazy load images below the fold
- Use `pointer-events: none` on decorative elements
- Implement `prefers-reduced-motion` support

---

## 8. Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Reduced motion preference support
- Sufficient color contrast (verified in design)