# Sorry My Love — Premium Cinematic Experience ❤️

A mobile-first, full-screen romantic apology experience built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js.

## Production build

```bash
npm run build
npm start
```

## Customize

- Edit the apology copy and promises in `app/page.tsx`.
- Replace demo memory image URLs in the `memories` array in `app/page.tsx`.
- Add a real audio file at `public/music/romantic.mp3` to enable music.
- The visitor name is saved to `localStorage` under `sorry-name`.

## Notes

Audio intentionally does not autoplay with sound. The floating music control requires a user tap, which works with mobile browser autoplay policies.

The experience respects `prefers-reduced-motion` and keeps sections touch-friendly for 360–430px devices.
