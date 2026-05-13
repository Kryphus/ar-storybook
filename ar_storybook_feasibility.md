# Web AR Storybook: "Si Pagong at si Kuneho"
# Comprehensive Project Plan & Feasibility Analysis

---

## TL;DR — Is This Achievable?

**Yes, absolutely.** Marker-based Web AR with 3D models, animations, touch interactions, and audio narration is well within the capabilities of current free/open-source Web AR tech. The scope is realistic for a school final project. Below is the full breakdown.

---

## 1. Recommended Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **AR Engine** | **AR.js** (marker-based) | Free, lightweight, battle-tested for simple marker tracking. Perfect for this use case. |
| **3D Framework** | **A-Frame** (built on Three.js) | Declarative HTML-like syntax for 3D scenes. Pairs natively with AR.js. Low learning curve. |
| **Animation** | **aframe-extras** (`animation-mixer`) | Plays GLTF/GLB embedded animations out of the box. No extra code needed. |
| **Touch Gestures** | **arjs-gestures** | Adds pinch-to-zoom, rotation, and drag with a single script. Drop-in library. |
| **Audio** | HTML5 `<audio>` + JS | Trigger AI narration audio files on marker detection. Simple event-driven. |
| **Model Format** | **GLB** (binary GLTF) | Single-file, compressed, web-optimized. Industry standard for web 3D. |
| **Hosting** | GitHub Pages / Vercel / Netlify | Free static hosting. AR.js is fully client-side, no backend needed. |

> [!TIP]
> **Why AR.js over MindAR?** For simple black-and-white pattern markers, AR.js is simpler and lighter. MindAR is better for *image* tracking (photos, artwork) but is overkill for custom markers you design yourself. If you later want to track the actual storybook illustrations instead of printed markers, MindAR would be the upgrade path.

### Required Script Includes

```html
<head>
  <!-- A-Frame: 3D scene framework -->
  <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>

  <!-- AR.js: marker-based AR -->
  <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>

  <!-- aframe-extras: GLTF animation playback -->
  <script src="https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v7.5.0/dist/aframe-extras.min.js"></script>

  <!-- arjs-gestures: pinch-to-zoom, rotate, drag -->
  <script src="https://raw.githack.com/fcor/arjs-gestures/master/dist/gestures.js"></script>
</head>
```

### Minimal Working Example

```html
<body style="margin: 0; overflow: hidden;">
  <a-scene embedded arjs gesture-detector>

    <!-- Custom marker for Page 1 -->
    <a-marker type="pattern" url="markers/page1.patt" id="marker-page1">
      <a-entity
        gltf-model="url(models/pagong.glb)"
        animation-mixer="clip: idle; loop: repeat"
        scale="0.3 0.3 0.3"
        class="clickable"
        gesture-handler="minScale: 0.25; maxScale: 8">
      </a-entity>
    </a-marker>

    <a-entity camera></a-entity>
  </a-scene>

  <audio id="narration-page1" src="audio/narration-page1.mp3"></audio>

  <script>
    document.querySelector('#marker-page1').addEventListener('markerFound', () => {
      document.querySelector('#narration-page1').play();
    });
  </script>
</body>
```

That's it. A few lines of HTML and you have a 3D animated model appearing on a marker with touch controls and narration. The barrier to entry is very low.

---

## 2. Feature Feasibility Breakdown

### ✅ Marker-Based AR (One Marker Per Page)
- **Difficulty: Easy**
- AR.js has a [marker generator tool](https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) to create custom `.patt` files
- Each page of your storybook gets its own marker → its own 3D scene
- You can embed markers directly into the physical storybook pages
- **Tip:** Markers should be high-contrast, asymmetric designs inside a thick black border

### ✅ 3D Models Appearing on Scan
- **Difficulty: Easy**
- Load `.glb` models and anchor them to markers
- Multiple models per marker is supported (just add more `<a-entity>` tags under one `<a-marker>`)
- 2–3 simple models per marker runs fine on most phones

### ✅ Basic Animations (Idle, Walk, Run)
- **Difficulty: Easy**
- If the model already has embedded animations, `animation-mixer` plays them automatically
- Switch clips via JavaScript: `el.setAttribute('animation-mixer', 'clip: walk')`
- Can chain animations with timeouts or events

### ✅ Touch Interactions (Zoom, Rotate, Drag)
- **Difficulty: Easy** (with the `arjs-gestures` library)
- Everything below works out of the box:

| Gesture | What It Does | How |
|---|---|---|
| **Pinch (two fingers)** | Zoom in / zoom out on the 3D model | Scales the entity between `minScale` and `maxScale` |
| **Two-finger twist** | Rotate the 3D model | Rotates around the Y-axis; speed controlled by `rotationFactor` |
| **One-finger drag** | Pan/move the model (with custom code) | Requires a small custom script using `touchmove` events |

**Usage:**
```html
<!-- On the scene: detect gestures -->
<a-scene arjs gesture-detector>

  <!-- On the model: handle gestures -->
  <a-entity
    gltf-model="url(models/kuneho.glb)"
    class="clickable"
    gesture-handler="minScale: 0.25; maxScale: 10; rotationFactor: 5">
  </a-entity>
```

> [!NOTE]
> Touch interactions make the experience feel much more interactive and "game-like" with almost zero extra code. Users can examine models from all angles and zoom into details.

### ⚠️ Story-Specific Animations (Acting Out Scenes)
- **Difficulty: Hard — but there's a practical middle ground**
- Making models "act out" complex scenes (climbing trees, racing, talking) requires custom skeletal animation authoring in Blender — this is time-intensive and has a steep learning curve
- **Practical approach:** Use a *combination* of:
  1. **Built-in model animations** (idle, walk, run) triggered at the right time
  2. **A-Frame position/rotation animations** to move models around the scene (e.g., turtle walking left-to-right, rabbit lying down)
  3. **Scene composition** — place models in poses that *suggest* the story moment (e.g., rabbit under a tree idle, turtle walking past with walk animation)

**Example — turtle walks across the scene while rabbit idles:**
```html
<a-marker type="pattern" url="markers/page5.patt">
  <!-- Turtle walks from left to right -->
  <a-entity
    gltf-model="url(models/pagong.glb)"
    animation-mixer="clip: walk; loop: repeat"
    position="-1 0 0"
    animation="property: position; to: 1 0 0; dur: 5000; easing: linear">
  </a-entity>

  <!-- Rabbit is sleeping/idle under a tree -->
  <a-entity
    gltf-model="url(models/kuneho.glb)"
    animation-mixer="clip: idle; loop: repeat"
    position="0.5 0 -0.5"
    rotation="0 -90 0">
  </a-entity>

  <!-- Tree prop -->
  <a-entity
    gltf-model="url(models/tree.glb)"
    position="0.5 0 -0.8"
    scale="0.5 0.5 0.5">
  </a-entity>
</a-marker>
```

This gives the *impression* of acting out the story without needing custom skeletal animations.

### ✅ AI Narration Audio Per Page
- **Difficulty: Easy**
- Generate narration audio per page using any TTS tool (ElevenLabs, Google TTS, Narakeet, etc.)
- On marker detection, play the corresponding audio:

```javascript
document.querySelector('#marker-page1').addEventListener('markerFound', () => {
  document.querySelector('#narration-page1').play();
});

// Optional: stop narration when marker is lost
document.querySelector('#marker-page1').addEventListener('markerLost', () => {
  document.querySelector('#narration-page1').pause();
});
```

> [!TIP]
> For Filipino narration, **ElevenLabs** has good multilingual voices. **Google Cloud TTS** also supports Filipino (Tagalog). Both have free tiers sufficient for a school project.

### ⚠️ Game Elements
- **Difficulty: Medium to Hard** (depends on scope — see Section 4)

---

## 3. The 3D Model Problem

This is the most valid concern. Here's a realistic strategy:

### Where to Get Models

| Source | Pros | Cons |
|---|---|---|
| **Sketchfab** (free section) | Huge library, many animated, GLB export | Style consistency is a gamble |
| **Kenney.nl** | Free, consistent low-poly style | Limited animal selection |
| **Mixamo** (for humanoid only) | Free animations you can apply to models | Only works with humanoid rigs |
| **Poly Pizza / Google Poly archive** | Simple, consistent styles | Fewer options |
| **AI 3D generators** (Meshy, Tripo3D) | Generate from text prompt, consistent style possible | Quality varies, may need cleanup |

### Adding Animations Without Heavy Software

> [!IMPORTANT]
> You **will** likely need **Blender** at some point (it's free). But for your use case you only need very basic skills — importing, scaling, exporting. YouTube has tons of "Blender for absolute beginners" tutorials that cover what you need in under 30 minutes.

| Task | Tool | Difficulty |
|---|---|---|
| Convert formats (FBX → GLB) | Blender or [gltf.report](https://gltf.report) | Trivial |
| Apply Mixamo animations to humanoid models | Mixamo website (drag & drop) | Easy |
| Simple movement animations (walk across scene) | **A-Frame's built-in `animation` component** — no Blender needed | Easy |
| Resize / reposition models | Blender (scale, rotate, export) | Easy |
| Custom skeletal animations for animals | Blender (keyframe animation) | Hard (avoid if possible) |

### Style Consistency Strategy

- **Best approach:** Pick ONE art style and commit. Search for model *packs* or models from the *same creator* on Sketchfab
- **Low-poly/cartoon** style is the most forgiving — slight differences between models look intentional
- If you can't find a matching set, use **AI-generated 3D models** (Meshy, Tripo3D) to produce stylistically consistent cartoon animals from text prompts
- **Last resort:** Use simple geometric primitives (A-Frame boxes, spheres) as placeholder characters during development, replace with real models later

> [!TIP]
> Search Sketchfab for "cartoon turtle animated" and "cartoon rabbit animated" with the **"downloadable"** and **"animated"** filters on. Look for models from the same creator or art style. Download in GLTF/GLB format.

---

## 4. Game Element Ideas (Ranked by Feasibility)

| Idea | Feasibility | Description |
|---|---|---|
| **Quiz per page** | ✅ Easy | After narration ends, show an HTML overlay quiz about what just happened in the story. Pure HTML/JS, no AR needed. Score tracking across pages. |
| **Find the hidden marker** | ✅ Easy | Hide a bonus marker somewhere on certain pages. When found, unlock a special animation, sound effect, or bonus trivia. |
| **Tap-to-interact** | ⚠️ Medium | Tap on 3D models to trigger reactions (e.g., tap the rabbit and it jumps, tap the turtle and it waves). Uses A-Frame `cursor` raycasting. |
| **Drag-and-drop puzzle** | ⚠️ Medium | After scanning a page marker, the user must drag story elements into the correct position (2D HTML overlay game). |
| **Simple race mini-game** | ⚠️ Medium-Hard | A 2D HTML5 canvas game (not in AR) — tap to make the turtle move, avoid obstacles. Keep it as a separate page/screen, not inside the AR view. |
| **3D AR race on marker** | ❌ Hard | Moving two models along a path in AR with user input control. Technically possible but complex for a school project timeline. |

> [!IMPORTANT]
> **Recommendation:** Go with the **quiz/trivia approach** as your primary game element (easy to implement, clearly "gamified," directly tied to the educational aspect of a storybook). Add **tap-to-interact** on the 3D models as a bonus. This gives you solid "game elements" without scope creep. If time permits, the 2D race mini-game is a stretch goal.

### Quiz Implementation Sketch

```html
<!-- Quiz overlay (hidden by default, shown after narration ends) -->
<div id="quiz-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
     background:rgba(0,0,0,0.8); z-index:999; color:white; padding:20px;">
  <h2>Tanong: Ano ang ginawa ni Kuneho?</h2>
  <button onclick="checkAnswer('a')">A. Natulog sa ilalim ng puno</button>
  <button onclick="checkAnswer('b')">B. Tumakbo nang mabilis</button>
  <button onclick="checkAnswer('c')">C. Kumain ng gulay</button>
</div>
```

---

## 5. Diorama Scene Approach

Instead of just placing individual models flat on the marker, you can create a **miniature diorama/stage** — a 3D environment (like a forest island) that floats above the marker, with the animal characters placed on top of it. This looks significantly more impressive and sells the "storybook scene" feel.

### How It Works

In A-Frame, every entity under an `<a-marker>` is positioned relative to the marker's center. You wrap everything (diorama base + characters + props) in a **parent entity** and lift it up by setting the `y` position:

```html
<a-marker type="pattern" url="markers/page5.patt" id="marker-page5">
  <!-- Parent entity: the entire diorama scene, floating above the marker -->
  <a-entity id="diorama-page5" position="0 0.3 0"
            class="clickable"
            gesture-handler="minScale: 0.25; maxScale: 8; rotationFactor: 5">

    <!-- The forest/environment diorama model -->
    <a-entity gltf-model="url(models/diorama-forest.glb)"
              scale="0.4 0.4 0.4">
    </a-entity>

    <!-- Turtle walking across the diorama surface -->
    <a-entity gltf-model="url(models/pagong.glb)"
              animation-mixer="clip: walk; loop: repeat"
              position="-0.5 0.05 0"
              scale="0.1 0.1 0.1"
              animation="property: position; from: -0.5 0.05 0; to: 0.5 0.05 0; dur: 6000; easing: linear">
    </a-entity>

    <!-- Rabbit sleeping under a tree on the diorama -->
    <a-entity gltf-model="url(models/kuneho.glb)"
              animation-mixer="clip: idle; loop: repeat"
              position="0.2 0.05 -0.1"
              scale="0.1 0.1 0.1">
    </a-entity>

  </a-entity>
</a-marker>
```

**Key benefits of the parent entity wrapper:**
- The whole scene moves/scales/rotates together as a unit
- Animal positions are relative to the diorama, not the marker
- Touch gestures (zoom/rotate) on the parent rotate the **entire diorama** — exactly the effect you want
- Each page can have a different diorama, or you reuse the same one with different character positions

### Moving Animals On the Diorama

Animals can walk, run, and follow paths on the diorama surface using A-Frame's built-in `animation` component:

| Movement Type | How | Difficulty |
|---|---|---|
| Walk from point A to B | `animation="property: position; from: ... to: ..."` | ✅ Easy |
| Follow a multi-step path (A → B → C) | Chain animations: `animation__1`, `animation__2`, `animation__3` with delays | ✅ Easy-Medium |
| Walk, stop, then walk again | Listen for `animationcomplete` event in JS, trigger next animation | ⚠️ Medium |
| Walk along a curved path | Custom component with waypoints array | ⚠️ Medium |

**Example — turtle follows a multi-step path across the diorama:**
```html
<a-entity gltf-model="url(models/pagong.glb)"
          animation-mixer="clip: walk; loop: repeat"
          position="-0.5 0.05 0"
          scale="0.1 0.1 0.1"
          animation__1="property: position; to: 0 0.05 0.2; dur: 3000; easing: linear"
          animation__2="property: position; to: 0.5 0.05 0; dur: 3000; delay: 3000; easing: linear"
          animation__3="property: rotation; to: 0 90 0; dur: 500; delay: 2800">
</a-entity>
```

### Where to Get Diorama Models

| Source | Search Term | Notes |
|---|---|---|
| **Sketchfab** | "low poly island diorama", "cartoon forest diorama", "forest scene low poly" | Best option — tons of free ones with the floating-platform look |
| **Blender (DIY)** | YouTube: "blender low poly diorama tutorial" | Medium difficulty, but gives you full control |
| **AI generators** | Meshy/Tripo3D: "cartoon forest diorama island low poly" | Quick results, may need cleanup |

> [!TIP]
> Search Sketchfab for **"low poly island diorama"** or **"cartoon forest scene"** — this is an extremely popular style and there are many free downloadable ones. They already have that floating-platform look that works perfectly hovering above an AR marker.

### Diorama Feasibility Summary

| Aspect | Difficulty |
|---|---|
| Anchor diorama above marker | ✅ Easy — just set `position="0 0.3 0"` on parent |
| Place animals on the diorama surface | ✅ Easy — position relative to parent entity |
| Basic movement (A to B) | ✅ Easy — A-Frame `animation` component |
| Multi-step path movement | ✅ Easy-Medium — chained animations with delays |
| Rotate/zoom the entire diorama | ✅ Easy — `gesture-handler` on parent entity |
| Finding a good diorama model | ⚠️ Medium — style-match with your animal models |
| Performance on mobile | 🟡 Watch it — diorama + 2 animals = heavier scene. Keep everything low-poly |

> [!WARNING]
> **Performance tip:** A diorama model adds polygon count on top of your character models. Keep the diorama model **under 3MB** and use low-poly style. Test on the weakest phone in your group early. If it's too slow, simplify the diorama or reduce texture resolution using [gltf.report](https://gltf.report).

---

## 6. Touch Interactions — Full Details

The `arjs-gestures` library provides touch controls with almost no code:

### Setup
```html
<!-- 1. Include the script -->
<script src="https://raw.githack.com/fcor/arjs-gestures/master/dist/gestures.js"></script>

<!-- 2. Add gesture-detector to the scene -->
<a-scene arjs gesture-detector>

  <a-marker type="pattern" url="markers/page1.patt">
    <!-- 3. Add gesture-handler to each model -->
    <a-entity
      gltf-model="url(models/pagong.glb)"
      class="clickable"
      gesture-handler="minScale: 0.25; maxScale: 10; rotationFactor: 5">
    </a-entity>
  </a-marker>

  <a-entity camera></a-entity>
</a-scene>
```

### Supported Gestures

| Gesture | Fingers | Effect | Customization |
|---|---|---|---|
| **Pinch to zoom** | 2 fingers, pinch/spread | Scales model up or down | `minScale`, `maxScale` |
| **Rotate** | 2 fingers, twist | Rotates model around Y-axis | `rotationFactor` (higher = faster) |
| **Tap** | 1 finger, tap | Can trigger events via A-Frame cursor/raycaster | Custom JS event listeners |
| **Drag/Pan** | 1 finger, drag | Moves model position (requires custom script) | Custom `touchmove` handler |

### Custom One-Finger Drag (if needed)

```javascript
// Simple one-finger drag to move a model
AFRAME.registerComponent('draggable', {
  init: function () {
    this.el.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const z = (touch.clientY / window.innerHeight) * 2 - 1;
      this.el.setAttribute('position', { x: x, y: 0, z: z });
    });
  }
});
```

> [!NOTE]
> For a storybook, pinch-to-zoom and rotation are the most useful gestures — they let users examine the 3D models closely from any angle. Drag is less necessary since models are anchored to markers.

---

## 7. Key Limitations & Concerns

### 🔴 Critical — Must Address

#### iOS Safari Restrictions
- Web AR on iOS **requires HTTPS** — use GitHub Pages (HTTPS by default)
- Camera permissions can be finicky — AR.js handles the prompt, but **test early on iPhones**
- Performance is generally worse on iOS Safari than Android Chrome
- **Workaround:** Test on both platforms from day one. Don't leave iOS testing to the end

#### Marker Quality Matters
- Markers must be **high contrast, asymmetric, and unique** — the AR.js generator helps with this
- Bad lighting = bad tracking. Design markers with **thick black borders**
- **Printed markers track far better than screens** — your physical storybook is an advantage
- Each marker must be visually distinct from the others, or AR.js will confuse them
- Recommended minimum marker size: **6cm × 6cm** when printed

### 🟡 Important — Be Aware

#### Model File Size
- Each GLB should ideally be **under 5MB** (under 2MB is better)
- Large models = slow loading on mobile data
- Use [gltf.report](https://gltf.report) to inspect and optimize model sizes
- Consider a loading screen/progress bar while models download

#### Multiple Models Per Scene
- AR.js can handle **2–3 simple models per marker** without issue
- More than that, or high-poly models, will drop frame rate on budget phones
- **Test on the lowest-end phone in your group**

#### No Occlusion
- Web AR doesn't support occlusion (models can't appear "behind" real-world objects)
- Models will always render on top of everything — fine for a storybook, but worth knowing

#### Audio Autoplay Restrictions
- Mobile browsers block audio autoplay until the user interacts with the page
- **Solution:** Add a "Start" or "Begin Story" button on your landing page. Once tapped, audio playback is unlocked for the session
- Without this, narration won't play on marker detection

### 🟢 Good News

#### No Backend Needed
- Everything runs client-side. No server, no database, no deployment headaches
- Just static HTML + JS + assets → host on GitHub Pages for free

#### No App Store Needed
- Users just open a URL — no installation required
- Share via QR code on the storybook cover

---

## 8. Suggested Project Structure

```
ar-storybook/
├── index.html                  # Landing page with "Start" button & instructions
├── ar.html                     # Main AR page (all markers in one scene)
│
├── models/
│   ├── pagong.glb              # Turtle model (animated)
│   ├── kuneho.glb              # Rabbit model (animated)
│   ├── diorama-forest.glb      # Forest diorama base model
│   ├── diorama-race.glb        # Race track diorama (if different per page)
│   └── props/
│       ├── tree.glb            # Tree prop
│       ├── finish-line.glb     # Finish line prop
│       └── ...
│
├── markers/
│   ├── page1.patt             # AR marker pattern files
│   ├── page2.patt
│   ├── ...
│   └── printable/             # High-res printable marker images
│       ├── page1-marker.png
│       └── ...
│
├── audio/
│   ├── narration-page1.mp3    # AI-generated Filipino narration
│   ├── narration-page2.mp3
│   ├── sfx-correct.mp3        # Quiz sound effects
│   ├── sfx-wrong.mp3
│   └── ...
│
├── css/
│   └── style.css              # Landing page & overlay styling
│
├── js/
│   ├── app.js                 # Marker events, audio control, scene management
│   └── quiz.js                # Quiz/game logic
│
└── assets/
    └── images/                # Landing page images, icons, etc.
```

> [!TIP]
> **One HTML file vs. multiple?** You have two options:
> - **Single `ar.html`** with ALL markers defined — simpler, all models preload once. Better if total model size is small.
> - **Separate page per marker** (`page1.html`, `page2.html`, ...) — each page loads only its own models. Better if total assets are large, but requires navigation between pages.
>
> For a storybook with ~6-8 pages and lightweight models, the single-file approach is usually fine.

---

## 9. Development Roadmap

| Phase | Tasks | Time Estimate |
|---|---|---|
| **1. Prototype** | Get AR.js + A-Frame running with the Hiro preset marker + any free GLB model. Test on phone. Confirm camera, model rendering, and touch gestures work. | 1–2 days |
| **2. Model Sourcing** | Find/download stylistically consistent turtle + rabbit + **diorama** models from Sketchfab or AI generators. Test them in the prototype. Ensure style consistency. | 2–3 days |
| **3. Marker Design** | Design and generate custom `.patt` markers for each story page using the AR.js generator. Print test markers. | 1 day |
| **4. Core AR Pages** | Build the diorama AR scene for each story page — position diorama, place characters, set up path animations, compose the scene. | 3–5 days |
| **5. Narration** | Generate AI narration audio for each page (Filipino). Wire up marker-triggered audio playback. Handle the autoplay restriction with a start button. | 1–2 days |
| **6. Game Elements** | Implement quiz overlays per page + optional tap-to-interact on models. | 2–3 days |
| **7. Landing Page** | Build a polished landing page with instructions, a start button, and a QR code to the live app. | 1 day |
| **8. Testing & Polish** | Test on multiple devices (Android + iOS). Optimize model sizes. Fix edge cases. Add loading indicators. | 2–3 days |

**Total: ~2–3 weeks** of focused work (assuming the team splits tasks in parallel).

---

## 10. The Story — Page Breakdown Suggestion

Here's a suggested breakdown of "Si Pagong at si Kuneho" into AR pages:

| Page | Story Beat | Diorama Scene | Character Animation |
|---|---|---|---|
| 1 | Introduction — Pagong and Kuneho meet | Forest clearing diorama, both characters facing each other | Idle |
| 2 | Kuneho challenges Pagong to a race | Same forest diorama, Kuneho gesturing/jumping | Jump / Idle |
| 3 | The race begins | Race path diorama with a starting line prop | Both walk/run forward from start |
| 4 | Kuneho runs ahead, gets confident | Forest path diorama, Kuneho far ahead on the path | Kuneho: run (fast), Pagong: walk (slow, trailing behind) |
| 5 | Kuneho takes a nap under a tree | Forest diorama with a large tree, Kuneho resting beneath it | Kuneho: idle/sleep, Pagong: walk past via position tween |
| 6 | Pagong passes Kuneho | Same forest diorama, Pagong overtaking | Pagong: walk animation + position tween past Kuneho |
| 7 | Pagong wins! | Finish line diorama, Pagong at the line, Kuneho far behind | Pagong: idle (victory), Kuneho: run (too late) |
| 8 | Moral of the story | Simple diorama, both characters side by side, text overlay with moral | Idle |

> [!NOTE]
> You don't need exactly 8 pages — adjust based on how detailed your version of the story is. 6–10 pages is a good range for scope.

---

## 11. Useful Links & Resources

| Resource | URL | Purpose |
|---|---|---|
| **AR.js Docs** | https://ar-js-org.github.io/AR.js-Docs/ | Official documentation |
| **AR.js Marker Generator** | https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html | Create custom `.patt` markers |
| **A-Frame Docs** | https://aframe.io/docs/ | 3D scene framework documentation |
| **aframe-extras** | https://github.com/c-frame/aframe-extras | Animation mixer for GLTF models |
| **arjs-gestures** | https://github.com/fcor/arjs-gestures | Touch gesture library |
| **Sketchfab (free)** | https://sketchfab.com/search?features=downloadable&type=models&q=cartoon+animal | Free 3D models |
| **gltf.report** | https://gltf.report | Inspect & optimize GLB/GLTF files |
| **Blender** | https://www.blender.org | Free 3D modeling (for format conversion, basic edits) |
| **ElevenLabs** | https://elevenlabs.io | AI voice generation for narration |
| **Google Cloud TTS** | https://cloud.google.com/text-to-speech | Text-to-speech with Filipino support |

---

## 12. Summary — Answers to All Concerns

| Concern | Answer |
|---|---|
| **"Is Web AR good enough?"** | ✅ Yes. AR.js + A-Frame is the standard stack for marker-based Web AR. Free, well-documented, and handles everything you described. |
| **"What tech stack?"** | AR.js + A-Frame + aframe-extras + arjs-gestures. All free, all client-side, all HTML/JS. |
| **"Can I zoom, rotate, touch?"** | ✅ Yes. The `arjs-gestures` library adds pinch-to-zoom, two-finger rotation, and tap interactions with a single script include. |
| **"What about 3D models?"** | Source from Sketchfab (filter: animated, downloadable, cartoon). Use same creator/style for consistency. AI generators (Meshy, Tripo3D) as backup. |
| **"How do I add animations?"** | Use built-in model animations + A-Frame's `animation` component for movement. Avoid custom Blender animation unless absolutely necessary. |
| **"Is the race game feasible?"** | ⚠️ A 3D AR race is hard. A 2D HTML race mini-game is medium. Quizzes are easy and just as valid as "game elements." |
| **"Can I make a diorama scene?"** | ✅ Yes. Wrap a diorama model + characters in a parent entity, lift with `position="0 0.3 0"`. Touch gestures rotate/zoom the whole scene. Animals move on it via A-Frame animations. Easy to implement. |
| **"What should I worry about?"** | iOS compatibility, marker print quality, model file sizes, diorama polygon count, audio autoplay restrictions, and scope creep. |
