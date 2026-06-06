The provided Kafeno logo image is served from `public/assets/kafeno-logo.png`.

Steps:

1. Save the attached image (from your browser or this chat) and name it exactly:

   `kafeno-logo.png`

2. Move or copy the file into the public web assets folder so the app can serve it at runtime:

   `public/assets/kafeno-logo.png`

3. Recommended sizes:
   - Full-size master: 2400×720 (or similar wide ratio)
   - Web-optimized versions: 1200×360, 800×240, 400×120

Why this file is needed:

- `src/components/KafenoLogo.tsx` loads `/assets/kafeno-logo.png` by default.
- Vite serves files from `public/`, so `public/assets/kafeno-logo.png` is the runtime copy.
- `public/favicon.png` is the browser tab icon, generated from `public/logo.jpeg` with transparent corners.
