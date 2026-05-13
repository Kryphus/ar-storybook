# 🚀 Prototype Checklist — Get AR Working TODAY

**Goal:** Scan a marker → diorama with turtle + rabbit appears in AR, floating above the marker, with touch zoom/rotate.

**Time estimate:** ~30-60 minutes (mostly spent finding/downloading models)

---

## Step 1: Download 3D Models (The Longest Step)

You need **3 models** in **`.glb` format**. Go to [Sketchfab](https://sketchfab.com) and download these:

- [ ] **Turtle model** — Search: `cartoon turtle` → filter: `Downloadable`, `Animated` → Download as **GLB**
- [ ] **Rabbit model** — Search: `cartoon rabbit` or `cartoon hare` → filter: `Downloadable`, `Animated` → Download as **GLB**
- [ ] **Diorama/environment** — Search: `low poly island` or `cartoon forest diorama` → filter: `Downloadable` → Download as **GLB**

> **File type required: `.glb`** (not `.gltf`, not `.fbx`, not `.obj`)
> 
> When downloading from Sketchfab, select **"glTF"** format — it usually gives you a zip.
> Inside the zip, look for the `.glb` file OR a `.gltf` + `.bin` + textures folder.
> If you get `.gltf` (not `.glb`), you can convert it at https://gltf.report — just drag & drop and export as GLB.

### Where to put them:
```
ar-storybook/
  models/
    turtle.glb       ← rename your turtle model to this
    rabbit.glb       ← rename your rabbit model to this  
    diorama.glb      ← rename your diorama model to this
```

> **Tip:** Keep each file under 5MB. Check file size before using.
> If a model is too large, drag it into https://gltf.report and use "Optimize" to compress it.

---

## Step 2: Print or Display the Marker

- [ ] The prototype uses the **Hiro marker** (built into AR.js, no setup needed)
- [ ] Print this image OR open it on another screen: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png
- [ ] Make sure the marker is **at least 6cm wide** when printed/displayed

---

## Step 3: The Code (Already Done ✅)

- [x] `index.html` — already created for you in the project folder
- [x] Loads AR.js, A-Frame, aframe-extras, arjs-gestures
- [x] Diorama + turtle + rabbit on a Hiro marker
- [x] Touch gestures (pinch zoom, rotate) enabled

---

## Step 4: Serve It

You need a local web server (can't just open the HTML file directly).

**Option A — Fastest (npx serve):**
```bash
cd ar-storybook
npx -y serve .
```
Then open `http://localhost:3000` on your phone (same WiFi network).
Use your computer's local IP: `http://192.168.x.x:3000`

**Option B — Python:**
```bash
cd ar-storybook
python -m http.server 8000
```

**Option C — GitHub Pages (for mobile HTTPS):**
1. Push to a GitHub repo
2. Go to Settings → Pages → Deploy from main branch
3. Access via `https://yourusername.github.io/ar-storybook/`

> ⚠️ **For mobile phone testing, you NEED HTTPS** (camera won't work on HTTP on phones).
> `localhost` is exempt from this rule (works on the same machine).
> For quick phone testing, GitHub Pages is the easiest HTTPS option.

---

## Step 5: Test It

- [ ] Open the URL in Chrome (Android) or Safari (iOS)
- [ ] Allow camera access when prompted
- [ ] Point camera at the Hiro marker
- [ ] The diorama + animals should appear floating above the marker
- [ ] Try pinching to zoom, two-finger rotate

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Camera doesn't open | Make sure you're on HTTPS (or localhost). Check camera permissions. |
| Models don't appear | Check browser console (F12) for 404 errors. Make sure model filenames match exactly. |
| Models are too big/small | Adjust `scale` values in `index.html` |
| Models are underground | Adjust `position` y-value (increase it) |
| Very laggy | Model files are too large. Optimize at gltf.report |
| Marker not detected | Make sure marker is flat, well-lit, and fully visible. Print it if possible. |
