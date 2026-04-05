# Phase 4B — AI Assist + Profile Views Toast

---

## Profile Views Toast

A non-intrusive toast that appears **800ms after page load** on any `/user/[slug]` page, showing the **real-time view count** fetched from Upstash Redis.

### Files
- `src/components/ui/ViewsToast.tsx`  
  - Client component  
  - Slides in from right  
  - Auto-dismisses after 4s  
  - Includes manual dismiss (× button)  

- `src/app/api/portfolio/views/route.ts`  
  - `GET /api/portfolio/views?slug=xxx`  
  - Returns:
    ```json
    { "slug": "xxx", "views": number }
    ```

- `src/app/user/[id]/page.tsx`  
  - Renders:
    ```tsx
    <ViewsToast slug={id} />
    ```

---

### 🎨 UX & Accessibility Decisions
- Uses `aria-live="polite"` → screen-reader friendly  
- CSS-only animation:
  - `translate-x-8 → translate-x-0`  
- No animation libraries  
- Positioned top-right, above all sections  

---

### ⚙️ Architecture Decisions
- View increment handled server-side (`incrementViews()`)  
- Toast fetches views independently  
- Avoids RSC waterfall → keeps page fast  
- Decoupled UI + analytics  

---

## AI Assist (Powered by Gemini 2.5 Flash)

Three AI-powered writing helpers integrated into the portfolio/resume builder.

---

### ⚡ Supported Actions

| Action | Location | Behavior |
|--------|----------|----------|
| `generate_summary` | Summary field | Generates a 2-sentence professional summary |
| `improve_bullet` | Experience bullets (future) | Improves a single bullet point |
| `improve_description` | Experience & Projects | Rewrites description for clarity + impact |

---

### Files

- `src/app/api/ai/route.ts`  
  - POST endpoint  
  - Handles action-based prompts  
  - Calls Gemini API (`gemini-2.5-flash`)  

- `src/components/ui/AIAssistButton.tsx`  
  - Reusable AI trigger button  
  - Features:
    - Loading spinner  
    - Disabled state handling  
    - Inline error feedback  

---

### 🧠 AI Prompt Design

**System Prompt Rules:**
- ATS-friendly writing  
- Strong action verbs  
- Metrics-focused  
- ❌ No hallucination  
- ✅ Only rewrite given content  

---

### Key Design Decisions

- 🔒 Button disabled if no input data  
- ✍️ AI output replaces field directly  
- 🧑‍💻 User can edit after generation  
- 🎯 Separate prompts per action (NOT generic AI)  
- 🧩 Easily extensible for future actions  

---

### Example Usage

```tsx
<AIAssistButton
  label="Generate from my experience"
  disabled={form.workExperiences.every(w => !w.company)}
  onResult={text => set('experienceSummary', text)}
  buildRequest={() => ({
    action: 'generate_summary',
    workExperiences: form.workExperiences.filter(w => w.company),
    skills: form.skills,
  })}
/>
```
