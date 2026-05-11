# NextJS Portfolio — Comprehensive Codebase Analysis

## Overview
A full-stack SaaS portfolio builder platform allowing users to create & host personalized portfolio sites. Multi-tenant architecture with Redis storage, AI-powered content enhancement, PDF generation, email integration, and real-time analytics.

---

## 1. CUSTOM HOOKS (React Hooks)

### `useFormArray<T>` 
- **File:** [src/hooks/useFormArray.ts](src/hooks/useFormArray.ts)
- **Purpose:** Generic array field management for dynamic form sections (projects, work, education, certifications)
- **Input:** `initialValue: T[]` - initial array of items
- **Output:** `{ items: T[], update(index, field, value), add(item), remove(index), setItems }`
- **State Management:** Manages array state with immutable updates
- **Key Methods:**
  - `update()` - Update a specific field in an item at index
  - `add()` - Append new item
  - `remove()` - Delete item by index
- **Memoization:** Uses `useCallback` for all methods
- **Critical Logic:** Immutable update pattern prevents React stale closures

---

### `useScrollAnimation`
- **File:** [src/hooks/useScrollAnimation.ts](src/hooks/useScrollAnimation.ts)
- **Purpose:** Intersection Observer detection for scroll-triggered animations
- **Input:** `threshold: number` (default 0.15)
- **Output:** `{ ref: RefObject<HTMLElement>, visible: boolean }`
- **Behavior:**
  - Fires once only (observer disconnects after first intersection)
  - Used by `AnimatedSection` component for fade-in/slide-in effects
- **Performance:** Single observer per component instance; cleanup on unmount
- **Critical:** Prevents CSS animation delays on page load

---

### `useSlugValidation`
- **File:** [src/hooks/useSlugValidation.ts](src/hooks/useSlugValidation.ts)
- **Purpose:** Slug validation with debounced API checking for URL availability
- **Input:** None (user input via callback)
- **Output:** `{ slug: string, status: SlugStatus, checkSlug(value), setSlug }`
- **SlugStatus Values:** `"idle" | "checking" | "available" | "taken" | "invalid"`
- **Validation Rules:**
  - Format: `/^[a-z0-9-]{3,40}$/` (lowercase, numbers, hyphens, 3-40 chars)
  - Sanitizes input: converts to lowercase, removes special chars
  - Debounces API calls: 500ms delay before fetch
- **Critical Business Logic:**
  - Prevents duplicate slug creation (checks Redis)
  - Debounce prevents rate limiting on rapid typing
  - Cleanup on unmount prevents memory leaks
- **API Call:** `GET /api/portfolio/check-slug?slug=${sanitized}`
- **Potential Bug:** No error state differentiation (failed API calls set "idle")

---

### `useTypingEffect`
- **File:** [src/hooks/useTypingEffect.ts](src/hooks/useTypingEffect.ts)
- **Purpose:** Character-by-character typing animation (used when AI streaming text)
- **Input:** None
- **Output:** `{ text: string, isStreaming: boolean, streamText(fullText, speed=15) }`
- **Parameters:**
  - `fullText` - Text to animate
  - `speed` - Delay between characters in ms (default 15)
- **Behavior:** Blocks UI during animation (`isStreaming` flag disables input)
- **UX Consideration:** Used with AI descriptions to provide visual feedback
- **Potential Issue:** Blocking animation could feel sluggish with long text

---

## 2. UTILITY FUNCTIONS

### `calculateYearsOfExperience(workExperiences)`
- **File:** [src/lib/utils.ts](src/lib/utils.ts)
- **Purpose:** Calculate total professional experience from work history, handling overlapping roles
- **Input:** Array of work items with `startYear`, `startMonth`, `endYear`, `endMonth`, `isCurrentJob`
- **Output:** Number (rounded to nearest 0.5, minimum 1)
- **Algorithm:**
  1. Parse all date ranges into `[start, end]` tuples
  2. Sort by start date
  3. Merge overlapping ranges (union operation)
  4. Sum total months across merged ranges
  5. Convert to years with 0.5 precision
- **Edge Cases:** Handles overlapping roles, missing end dates (assumes current), no work history
- **Used In:** [src/components/About.tsx](src/components/About.tsx#L24)
- **Critical:** Accurate experience display on portfolio pages

---

### `cn(...inputs)`
- **File:** [src/lib/utils.ts](src/lib/utils.ts)
- **Purpose:** Merge Tailwind CSS classes with conflict resolution
- **Dependencies:** `clsx`, `tailwind-merge`
- **Usage:** Avoid Tailwind specificity conflicts when combining class strings
- **Example:** `cn("bg-blue-500", "bg-red-500")` → `"bg-red-500"` (last wins)

---

### `formDataToPortfolio(data: PortfolioFormData)`
- **File:** [src/lib/schema.ts](src/lib/schema.ts#L200+)
- **Purpose:** Convert form state to Portfolio data structure for Redis storage
- **Input:** `PortfolioFormData` (client form state)
- **Output:** `Portfolio` (Zod-validated storage format)
- **Transformation:** Maps form fields → nested portfolio structure; preserves legacy feature flags

---

### `getSectionVisibility(portfolio: Portfolio)`
- **File:** [src/lib/schema.ts](src/lib/schema.ts#L170+)
- **Purpose:** Resolve section visibility flags with backward compatibility for legacy portfolios
- **Input:** Portfolio object
- **Output:** Object with boolean flags for each section × resume/portfolio
- **Backward Compat:** Falls back to legacy `features` object if new `sections` not set
- **Fields Returned:**
  ```
  showProjectsInPortfolio, showProjectsInResume
  showWorkInPortfolio, showWorkInResume
  showEducationInPortfolio, showEducationInResume
  showCertsInPortfolio, showCertsInResume
  showContactInPortfolio
  showBuildSection
  ```

---

### `validateForm(form, slugStatus)`
- **File:** [src/lib/formValidation.ts](src/lib/formValidation.ts)
- **Purpose:** Validate entire portfolio form before submission
- **Input:** `PortfolioFormData`, `SlugStatus`
- **Output:** `FormErrors` object (string keys = error messages)
- **Validations:**
  - **Identity:** firstName, lastName, slug format, slug taken status
  - **About:** oneLinerIntro (10+ chars), experienceSummary (20+ chars), location, timezone, passion
  - **Skills & Contact:** at least 1 skill, valid email, contact description (10+ chars)
  - **Arrays:** Work, education, certifications (company, title, institution names required)
- **Returns:** Empty object if all valid

---

### `hasErrors(errors: FormErrors)`
- **File:** [src/lib/formValidation.ts](src/lib/formValidation.ts#L80)
- **Purpose:** Check if any validation errors exist
- **Input:** `FormErrors` object
- **Output:** Boolean

---

### `scrollToFirstError()`
- **File:** [src/lib/formValidation.ts](src/lib/formValidation.ts#L84)
- **Purpose:** Scroll UI to first form field with error (marked with `data-error="true"`)
- **UX Pattern:** Improves form usability by highlighting problem areas

---

### `generateSlug(firstName, lastName): string`
- **File:** [src/lib/storage.ts](src/lib/storage.ts#L100+)
- **Purpose:** Generate URL-safe slug from user name
- **Algorithm:**
  - Concatenate firstName + lastName
  - Convert to lowercase
  - Replace non-alphanumeric chars with hyphens
  - Remove consecutive hyphens
- **Output:** e.g., `"shaffiahuja"` from "Shaffi" + "Ahuja"

---

## 3. COMPONENTS REQUIRING TESTING

### Client Components (Form/Interactive)

#### `UserForm` (Client)
- **File:** [src/components/UserForm.tsx](src/components/UserForm.tsx)
- **Type:** Route component at `/user/create` wrapper
- **Props:** None (uses React Router)
- **State:**
  ```typescript
  form: PortfolioFormData // Main form state
  formErrors: FormErrors
  isSubmitting: boolean
  submitError?: string
  ```
- **Hooks Used:**
  - `useFormArray` (projects, work, education, certifications)
  - `useSlugValidation` (slug checking)
  - `useTypingEffect` (AI responses)
  - `useRouter` (navigation)
- **Key Methods:**
  - `handleSubmit()` - Validate and POST to `/api/portfolio`
  - `update/add/remove` - Array manipulation via `useFormArray`
  - `checkSlug()` - Triggers validation
- **Features:**
  - Dynamic array sections with add/remove
  - AI assist buttons for descriptions
  - Real-time slug availability checking
  - Section visibility toggles (resume vs portfolio)
- **Critical Testing Areas:**
  - Form validation logic with various field combinations
  - Error display and scrolling behavior
  - Array add/remove operations
  - Slug validation debounce and API integration
  - Form state persistence before submission
  - Rate limiting response (429)

#### `FormSections` Components (Client)
- **File:** [src/components/FormSections.tsx](src/components/FormSections.tsx)
- **Components:**
  1. `ProjectForm` - Projects array item editor
  2. `WorkForm` - Work experience editor
  3. `EducationForm` - Education editor
  4. `CertificationForm` - Certification editor
- **Props:** `{ index, item, errors, onUpdate, onRemove, canRemove, ... }`
- **Features:**
  - AI Assist buttons for descriptions
  - Tech stack multi-select
  - Date month/year dropdowns
  - Conditional rendering (remove button)
  - Streaming text animation
- **Memoization:** All wrapped in `memo()` to prevent unnecessary re-renders

#### `FormComponents` (Client)
- **File:** [src/components/FormComponents.tsx](src/components/FormComponents.tsx)
- **Exported Components:**
  1. `FieldError` - Error message display
  2. `SectionHeading` - Section title with border
  3. `Toggle` - Switch/checkbox button
  4. `SlugIndicator` - Slug status badge (checking/available/taken/invalid)
  5. `SkillMultiSelect` - Dropdown multi-select for skills
- **All memoized** to prevent rerenders from parent updates
- **Testing Focus:** Each component's rendering logic, state changes

#### `AIAssistButton` (Client)
- **File:** [src/components/ui/AIAssistButton.tsx](src/components/ui/AIAssistButton.tsx)
- **Props:**
  ```typescript
  label?: string
  disabled?: boolean
  onResult: (text: string) => void
  buildRequest: () => object // Constructs API payload
  ```
- **State:** `loading`, `error`
- **API Call:** `POST /api/ai`
- **Error Handling:** Shows error message on network/API failure
- **Testing:** Loading state, error states, successful generation

#### `ContactForm` (Client)
- **File:** [src/components/ui/ContactForm.tsx](src/components/ui/ContactForm.tsx)
- **Props:** `{ contactMeFor: string, sendTo: string }`
- **State:** `pending`, `showToast`
- **Form Fields:** name, email, message (all required)
- **On Submit:**
  - Calls `sendMail()` server action
  - Shows success toast on messageId returned
  - Resets form on success
  - Logs/shows error on failure
- **Testing:**
  - Form validation (required fields)
  - API call success/failure
  - Toast visibility
  - Form reset behavior

#### `BuildPortfolio` (Client)
- **File:** [src/components/BuildPortfolio.tsx](src/components/BuildPortfolio.tsx)
- **Purpose:** Landing page section showcasing user portfolios
- **State:** `dynamicUsers: UserPreview[]` (fetched from API)
- **Data Fetching:** `GET /api/portfolio/list` on mount
- **Renders:** Grid of portfolio previews (up to 6 dynamic + 2 legacy)
- **Props:** None
- **Hooks:** `useScrollAnimation` (fade-in animation)
- **Components:** Uses `InitialAvatar` for users without profile images
- **Testing:**
  - API call and data loading
  - Error handling (silently fails)
  - Avatar generation logic
  - Stagger animation delays

#### `ViewsToast` (Client)
- **File:** [src/components/ui/ViewsToast.tsx](src/components/ui/ViewsToast.tsx)
- **Props:** `{ slug: string }`
- **Purpose:** Display portfolio view counter in bottom-right toast
- **Behavior:**
  - Fetches views count on mount from `GET /api/portfolio/views?slug=`
  - Shows after 800ms delay for smooth UX
  - Displays live dot animation with view count
  - Accessibility: `role="status"`, `aria-live="polite"`
- **Edge Cases:** Missing slug, API errors (silently skips rendering)

#### `AnimatedSection` (Client)
- **File:** [src/components/ui/AnimatedSection.tsx](src/components/ui/AnimatedSection.tsx)
- **Props:** `{ children, className, direction, delay, id }`
- **Purpose:** Wrapper component that applies scroll-triggered fade/slide animations
- **Direction Options:** `"up" | "left" | "right" | "none"`
- **Hook:** Uses `useScrollAnimation` for visibility detection
- **Transitions:** 700ms duration, ease-out timing
- **Testing:** Animation triggering, delay application, direction correctness

#### `SkillMultiSelect` (Client)
- **File:** [src/components/FormComponents.tsx](src/components/FormComponents.tsx#L134+)
- **Props:** `{ selected: string[], onChange: (selected) => void }`
- **State:** `open: boolean`
- **Features:**
  - Dropdown toggle
  - Checkbox list of predefined skills
  - Selected skills highlighted
  - Arrow icon rotation animation
- **Testing:** Select/deselect logic, dropdown open/close, change callbacks

---

### Server/Hybrid Components (Display)

#### `Hero` (RSC)
- **File:** [src/components/Hero.tsx](src/components/Hero.tsx)
- **Props:** `{ data: IntroData }`
- **Features:**
  - Name display with wave emoji animation
  - One-liner intro
  - CTA button with pulsing dot
  - Scroll anchor to contact section
- **Accessibility:** `role="img"` on emoji, `aria-label` on button

#### `About` (RSC)
- **File:** [src/components/About.tsx](src/components/About.tsx)
- **Props:** `{ data: AboutMeData, intro: IntroData, workExperience: WorkExperienceItem[] }`
- **Features:**
  - Profile image (custom photo OR gender-based placeholder)
  - Years of experience calculation (dynamic from work history)
  - Location/timezone card
  - Tech stack with skill icons (from skillicons.dev)
  - Passion description
  - Email contact link
- **Testing:**
  - Years display formatting (5 vs 5.5)
  - Image fallback logic
  - Skill icon rendering
  - Years calculation edge cases

#### `Projects` (Client)
- **File:** [src/components/Projects.tsx](src/components/Projects.tsx)
- **Props:** `{ data: Project[] }`
- **Features:**
  - Carousel with embla-carousel
  - Project cards with icon, title, description, tech stack
  - GitHub/Live URL links
  - Previous/Next navigation (only shows if multiple)
- **Nullability:** Returns null if no projects

#### `WorkExperience` (RSC)
- **File:** [src/components/WorkExperience.tsx](src/components/WorkExperience.tsx)
- **Props:** `{ data: WorkExperienceItem[] }`
- **Features:** Lists work items with dates, company, title, description
- **Accessibility:** `role="list"` with per-item `role="listitem"`

#### `Education` (RSC)
- **File:** [src/components/Education.tsx](src/components/Education.tsx) [Read to get details]
- **Props:** Education items
- **Similar to:** WorkExperience

#### `Certifications` (RSC)
- **File:** [src/components/Certifications.tsx](src/components/Certifications.tsx) [Read to get details]
- **Props:** Certification items

#### `ContactMe` (RSC)
- **File:** [src/components/ContactMe.tsx](src/components/ContactMe.tsx) [Read to get details]
- **Wraps:** `ContactForm` client component

---

### UI Subcomponents (Presentational)

#### `Card` (RSC)
- **File:** [src/components/ui/Card.tsx](src/components/ui/Card.tsx)
- **Props:** `{ image?, skills?, title, description }`
- **Features:**
  - Optional image display
  - Optional skills grid (fetches icons from skillicons.dev)
  - Title + description
- **Testing:** Image rendering, skill icons, missing data handling

#### `ProjectCard` (RSC)
- **File:** [src/components/ui/ProjectCard.tsx](src/components/ui/ProjectCard.tsx)
- **Props:** `{ icon?, title, role?, description, techstack, link?, githubUrl? }`
- **Features:**
  - Custom or default gradient icon
  - Tech stack icons (skillicons.dev)
  - GitHub/Live link buttons
  - Role subtitle
- **Testing:** Icon fallback, link visibility, tech stack rendering

#### `WorkCard` (RSC)
- **File:** [src/components/ui/WorkCard.tsx](src/components/ui/WorkCard.tsx) [Read to get details]
- **Props:** Work item + company image

#### `Toast` (Client)
- **File:** [src/components/ui/Toast.tsx](src/components/ui/Toast.tsx)
- **Props:** `{ message: string, variant: 'success' | 'error' | 'info' }`
- **Rendering:** Applied via CSS class mapping

#### `Carousel` (Client)
- **File:** [src/components/ui/Carousel.tsx](src/components/ui/Carousel.tsx)
- **Dependencies:** `embla-carousel-react`
- **Components:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`
- **Testing:** Navigation, item rendering, responsive behavior

---

### PDF Component

#### `ResumePDF` (RSC)
- **File:** [src/components/pdf/ResumePDF.tsx](src/components/pdf/ResumePDF.tsx)
- **Dependencies:** `@react-pdf/renderer`
- **Purpose:** Generate PDF resume from Portfolio data
- **Props:** `{ portfolio: Portfolio }`
- **Features:**
  - Uses section visibility to conditionally render sections
  - Professional formatting with StyleSheet
  - Work experience timeline
  - Skills/tech stack
  - Projects and certifications
  - Contact information footer
- **Used In:** `GET /api/resume/[slug]` route
- **Testing:** PDF generation, section visibility logic, content formatting

---

## 4. API ROUTES

### `POST /api/portfolio` (Create Portfolio)
- **File:** [src/app/api/portfolio/route.ts](src/app/api/portfolio/route.ts)
- **Purpose:** Save new portfolio to Redis
- **Input:**
  ```json
  {
    "slug": "shaffiahuja",
    "Intro": {...},
    "AboutMe": {...},
    "Projects": [...],
    "WorkExperience": [...],
    "Education": [...],
    "Certifications": [...],
    "ContactMe": {...},
    "Footer": {...}
  }
  ```
- **Validation:** Zod schema `PortfolioSchema`
- **Rate Limiting:** 3 portfolios per IP per 24h (`checkRateLimit`)
- **Slug Uniqueness:** Checks Redis set before saving
- **Output (201):**
  ```json
  { "success": true, "slug": "...", "url": "/user/...", "remaining": 2 }
  ```
- **Error Codes:**
  - **400:** Invalid JSON body
  - **409:** Slug already taken
  - **422:** Validation failed (returns field errors)
  - **429:** Rate limit exceeded
  - **503:** Redis not configured (helpful dev message)
  - **500:** Unknown error
- **Side Effects:**
  - Saves to Redis: `portfolio:{slug}` (JSON)
  - Adds slug to set: `slugs`
  - Increments rate limit counter: `ratelimit:{ip}`
- **Critical:** All validations in order; most restrictive first

---

### `GET /api/portfolio/check-slug` (Validate Slug)
- **File:** [src/app/api/portfolio/check-slug/route.ts](src/app/api/portfolio/check-slug/route.ts)
- **Purpose:** Check if slug is available (used by `useSlugValidation`)
- **Input:** `?slug={value}`
- **Format Validation:** `/^[a-z0-9-]{3,40}$/`
- **Output (200):**
  - If valid format: `{ "available": true/false }`
  - If invalid format: `{ "available": false, "reason": "invalid_format" }`
- **Error Codes:**
  - **400:** Missing slug param
- **Side Effects:** None (read-only)
- **Performance:** No debounce here; debounce is client-side in hook

---

### `GET /api/portfolio/list` (List Portfolio Previews)
- **File:** [src/app/api/portfolio/list/route.ts](src/app/api/portfolio/list/route.ts)
- **Purpose:** Fetch up to 6 user portfolio previews for landing page carousel
- **Output (200):**
  ```json
  {
    "slugs": [
      { "slug": "...", "firstName": "...", "lastName": "...", "oneLinerIntro": "...", "profileImage": "..." }
    ]
  }
  ```
- **Limit:** First 6 slugs from Redis set
- **Side Effects:** None (read-only)
- **Error Fallback:** Returns empty array on any error
- **Performance:** Multiple parallel Redis fetches (`Promise.all`)

---

### `GET /api/portfolio/views` (Fetch View Count)
- **File:** [src/app/api/portfolio/views/route.ts](src/app/api/portfolio/views/route.ts)
- **Purpose:** Get view counter for a portfolio
- **Input:** `?slug={slug}`
- **Output (200):** `{ "slug": "...", "views": 1234 }`
- **Error Codes:**
  - **400:** Missing slug param
- **Side Effects:** None (read-only increment happens in user page route)

---

### `GET /api/resume/[slug]` (Download Resume PDF)
- **File:** [src/app/api/resume/[slug]/route.ts](src/app/api/resume/[slug]/route.ts)
- **Purpose:** Generate and download PDF resume for a portfolio
- **Input:** Dynamic route param `:slug`
- **Process:**
  1. Fetch portfolio from Redis (or fallback to legacy data)
  2. Render `ResumePDF` component
  3. Convert to buffer via `@react-pdf/renderer`
  4. Return as binary PDF with attachment headers
- **Output (200):**
  ```
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="FirstName_LastName_Resume.pdf"
  ```
- **Error Codes:**
  - **404:** Portfolio not found
  - **500:** PDF generation failed (logs error)
- **Side Effects:** None
- **Performance:** Async PDF rendering; stream if file is large
- **Critical:** Convert Node Buffer → Uint8Array for Next.js 15 compatibility

---

### `POST /api/ai` (AI Content Assist)
- **File:** [src/app/api/ai/route.ts](src/app/api/ai/route.ts)
- **Purpose:** Generate/improve content using Google Gemini API
- **Input:**
  ```json
  {
    "action": "generate_summary" | "improve_bullet" | "improve_description",
    "text": "...",
    "context": "...",
    "workExperiences": [...],
    "skills": [...]
  }
  ```
- **Actions:**
  1. **generate_summary** - Create 2-sentence summary from work + skills
  2. **improve_bullet** - Rewrite resume bullet for impact
  3. **improve_description** - Rewrite project/job description for clarity
- **Gemini Model:** `gemini-2.5-flash`
- **System Prompt:** Resume writer specializing in tech; no fictional info
- **Output (200):** `{ "result": "..." }`
- **Error Codes:**
  - **400:** Invalid JSON or unknown action
  - **500:** Missing GEMINI_API_KEY
  - **502:** Gemini API error
  - **500:** Network/unknown error
- **Side Effects:** Calls external Gemini API
- **Critical:** No rate limiting on this endpoint (potential abuse vector)
- **Performance:** Streaming response from Gemini

---

### `POST /pages/api/sendEmail` (Send Contact Email)
- **File:** [src/pages/api/sendEmail.ts](src/pages/api/sendEmail.ts)
- **Purpose:** Server action for sending emails via Nodemailer
- **Input:**
  ```typescript
  {
    email: string (sender),
    sendTo?: string (recipient),
    subject: string,
    text: string,
    html?: string
  }
  ```
- **Provider:** Gmail SMTP
- **Auth:** Via `SMTP_SERVER_USERNAME` + `SMTP_SERVER_PASSWORD`
- **Output (success):**
  ```json
  { "messageId": "...", "response": "..." }
  ```
- **Error:** Returns void (logs error)
- **Side Effects:**
  - Sends email via Gmail SMTP
  - Logs messageId and recipient
- **Security Issue:** No validation of `sendTo` parameter (could redirect emails)
- **Critical Missing:** No rate limiting on email sends

---

## 5. DATA STRUCTURES & SCHEMAS

### Zod Schemas (Type-Safe Validation)

#### Core Portfolio Schema
- **File:** [src/lib/schema.ts](src/lib/schema.ts)
- **Root:** `PortfolioSchema` - Top-level portfolio structure
- **Exported Types:**
  ```typescript
  Portfolio, Project, WorkExperienceItem, EducationItem, 
  CertificationItem, SectionToggles, SectionVisibility,
  IntroData, AboutMeData, ContactMeData, FooterData
  ```

#### Sub-Schemas

**ProjectSchema**
```typescript
{
  icon?: string (URL)
  title: string (required, non-empty)
  role?: string
  description: string (required, non-empty)
  techstack: string[] (defaults to [])
  link?: string (valid URL or empty string)
  githubUrl?: string (valid URL or empty string)
}
```

**WorkExperienceSchema**
```typescript
{
  image?: string
  company: string (required)
  title: string (required)
  location?: string
  startMonth: string (from MONTHS array)
  startYear: string (required, min 4 chars for year)
  endMonth?: string
  endYear?: string
  isCurrentJob: boolean (defaults to false)
  description?: string
}
```

**EducationSchema**
```typescript
{
  type: enum["degree" | "12th" | "10th" | "diploma" | "other"]
  institutionName: string (required)
  fieldOfStudy?: string
  startYear?: string
  endYear?: string
  grade?: string
  location?: string
}
```

**CertificationSchema**
```typescript
{
  name: string (required)
  organization: string (required)
  date?: string
  credentialUrl?: string (valid URL or empty)
}
```

**SectionVisibilitySchema**
```typescript
{
  showInResume: boolean (defaults to true)
  showInPortfolio: boolean (defaults to true)
}
```

**SectionTogglesSchema** - Control visibility per section
```typescript
{
  projects: SectionVisibility
  workExperience: SectionVisibility
  education: SectionVisibility
  certifications: SectionVisibility
  contact: SectionVisibility
  buildSection: { showInPortfolio: boolean }
}
```

**IntroSchema** (nested in Portfolio)
```typescript
{
  FirstName: string (required)
  LastName: string (required)
  OneLinerIntro: string (required, min 10 chars)
  Theme: enum["light" | "dark"]
  profileImage?: string
  phone?: string
}
```

**AboutMeSchema**
```typescript
{
  gender: enum["male" | "female" | "other"]
  experience: {
    yearsOfExperience: number (0-50)
    experienceSummary: string (min 20 chars)
  }
  locationOfWork: {
    timeZone: string (required)
    locatedAt: string (required)
  }
  passion: {
    passionTitle: string (required)
    passionDescription?: string
    description?: string (legacy alias)
  }
  skills: string[] (min 1, from predefined SKILLS list)
  email: string (required, valid email)
}
```

**ContactMeSchema**
```typescript
{
  contactMeFor: string (min 10 chars)
  email: string (required, valid email)
}
```

**FooterSchema**
```typescript
{
  FirstName: string
  LastName: string
  github?: string (valid URL or empty)
  linkedin?: string (valid URL or empty)
  leetcode?: string (valid URL or empty)
}
```

#### Legacy Feature Flags
```typescript
features: {
  showProjects: boolean (defaults to true)
  showWorkExperience: boolean
  showContact: boolean
  showBuildSection: boolean
}
```
- **Purpose:** Backward compatibility with old portfolios before granular section toggles
- **Fallback:** `getSectionVisibility()` checks new `sections` first, then falls back to `features`

---

### Form State Type

**PortfolioFormData** - Client-side form state
- **File:** [src/lib/schema.ts](src/lib/schema.ts#L233+)
- **Difference from Portfolio:** Flat structure (easier for form inputs), nested arrays
- **Converter Function:** `formDataToPortfolio(data: PortfolioFormData): Portfolio`

---

### Constants

**SKILLS** - Predefined skill list (20+ items)
```
react, typescript, javascript, html, css, next, redux, mui, bootstrap, 
tailwind, figma, dotnet, cs, python, aws, docker, terraform, sqlite, git, angular
```

**MONTHS** - Month names array (used in date dropdowns)

---

## 6. INTEGRATION POINTS (How Components/Utils/Hooks Connect)

### Data Flow: Form → API → Storage → Display

```
UserForm (component)
  ↓ uses
  useFormArray (hook) - manages projects/work/education/certifications
  useSlugValidation (hook) - validates slug availability
  useTypingEffect (hook) - animates AI responses
  ↓ calls
  validateForm (utility) - validates all fields
  ↓ submits to
POST /api/portfolio
  ↓ validates with
  PortfolioSchema (Zod)
  ↓ checks
  checkRateLimit, isSlugTaken (storage)
  ↓ saves to
  Redis: portfolio:{slug}
  Redis: slugs set
  ↓
User Portal Display (/user/[slug])
  ↓ fetches
  getPortfolio (storage) → Redis
  incrementViews (storage) → Redis counter
  getSectionVisibility (utility) - determines what to show
  ↓ renders
  Hero, About, Projects, WorkExperience, etc.
  ↓ uses
  calculateYearsOfExperience (utility)
  useScrollAnimation (hook)
  AnimatedSection (component)
```

### AI Enhancement Flow

```
UserForm (with description field)
  ↓
AIAssistButton (component)
  ↓ user clicks
buildRequest() → { action, text, context }
  ↓
POST /api/ai
  ↓
Gemini API (external)
  ↓
Response { result: string }
  ↓
onResult() callback
  ↓
useTypingEffect.streamText() (hook)
  ↓
Animated typing in textarea
```

### Resume Generation Flow

```
Portfolio Display Page (/user/[slug])
  ↓ user clicks "Download Resume"
GET /api/resume/[slug]
  ↓
getPortfolio or getLegacyUser (storage)
  ↓
ResumePDF component
  ↓ uses
  getSectionVisibility, calculateYearsOfExperience (utilities)
  ↓
renderToBuffer (PDF library)
  ↓
NextResponse (PDF attachment)
```

### Contact Flow

```
Portfolio Page (/user/[slug])
  ↓
ContactMe component (RSC)
  ↓
ContactForm component (Client)
  ↓ user submits
sendMail (server action)
  ↓
Nodemailer + Gmail SMTP
  ↓
Email sent ✓
  ↓
Toast notification
```

### Portfolio Preview Flow

```
Landing Page (/app/(main)/page.tsx)
  ↓
BuildPortfolio component
  ↓
GET /api/portfolio/list
  ↓
Redis: SMEMBERS slugs
Redis: GET portfolio:{slug} (parallel)
  ↓
Preview cards rendered
  ↓ + legacy users
Legacy data fallback
```

### Analytics Flow

```
User Portfolio Page (/user/[slug])
  ↓ Server-side on page load
incrementViews(slug)
  ↓
Redis: INCR views:{slug}
  ↓
ViewsToast component (Client)
  ↓ On mount
GET /api/portfolio/views?slug=
  ↓
displays view count in bottom-right toast
```

---

## 7. CRITICAL BUSINESS LOGIC AREAS (Where Bugs Hurt Most)

### 1. Form Validation & Slug Uniqueness
- **File:** [src/lib/formValidation.ts](src/lib/formValidation.ts), [src/app/api/portfolio/route.ts](src/app/api/portfolio/route.ts#L30)
- **Impact:** Data integrity; prevents invalid portfolios from being created
- **Bug Risk:** High
  - Slug collision if race condition occurs between check and save
  - Missing validation on array items could allow malformed data
  - Form validation might miss edge cases (empty strings after trim)
- **Recommendation:** Implement transactional slug check-and-set in Redis (Lua script)

### 2. Years of Experience Calculation
- **File:** [src/lib/utils.ts](src/lib/utils.ts#L18+)
- **Impact:** Displayed on portfolio; affects professional credibility
- **Bug Risk:** Medium
  - Overlapping date ranges could be counted twice if merge logic fails
  - Month/year parsing could fail on legacy data (missing fields)
  - Rounding to 0.5 precision could be unexpected
- **Recommendation:** Add unit tests for overlapping roles, partial dates, edge years

### 3. Rate Limiting
- **File:** [src/lib/storage.ts](src/lib/storage.ts#L50+), [src/app/api/portfolio/route.ts](src/app/api/portfolio/route.ts#L6)
- **Impact:** Prevents API abuse; limits portfolio creation
- **Bug Risk:** Medium
  - Rate limit window is per-IP (can be spoofed or shared by NAT)
  - No distributed rate limiting (doesn't scale across servers)
  - Limit is hardcoded (3 portfolios/day); no admin override
- **Recommendation:** Consider checking for authenticated users separately

### 4. Email Sending (Contact Form)
- **File:** [src/pages/api/sendEmail.ts](src/pages/api/sendEmail.ts), [src/components/ui/ContactForm.tsx](src/components/ui/ContactForm.tsx)
- **Impact:** User communications; direct channel to portfolio owners
- **Bug Risk:** HIGH
  - **No rate limiting** - Spam vulnerability
  - **No CSRF protection** - Forms can be spammed from external sites
  - **sendTo not validated** - Email could be redirected
  - **Password in error logs** - Could leak SMTP credentials
  - **No email validation** - Invalid `from` fields accepted
- **Recommendation:** 
  - Add rate limiting per IP
  - Validate sendTo against whitelist
  - Remove sensitive variables from error logs

### 5. Section Visibility Logic
- **File:** [src/lib/schema.ts](src/lib/schema.ts#L170+)
- **Impact:** Determines what appears on portfolio & resume
- **Bug Risk:** Medium
  - Legacy `features` fallback could show wrong sections
  - Boolean defaults might differ between portfolio and resume
  - No validation that at least one section is visible
- **Recommendation:** Add unit tests for all fallback combinations

### 6. AI Content Generation
- **File:** [src/app/api/ai/route.ts](src/app/api/ai/route.ts)
- **Impact:** Core feature; affects portfolio quality
- **Bug Risk:** Medium
  - **No rate limiting** - Gemini API costs could skyrocket
  - **No input length limits** - Could flood Gemini with huge texts
  - **No output validation** - Could return jailbroken or harmful content
  - **No caching** - Duplicate requests generate duplicate API calls
- **Recommendation:**
  - Add rate limiting (1 call/user/minute)
  - Validate input length
  - Consider response caching
  - Add output sanitization

### 7. PDF Generation
- **File:** [src/components/pdf/ResumePDF.tsx](src/components/pdf/ResumePDF.tsx), [src/app/api/resume/[slug]/route.ts](src/app/api/resume/[slug]/route.ts)
- **Impact:** User-facing deliverable; represents professional image
- **Bug Risk:** Medium
  - Large PDFs could timeout or cause OOM
  - Missing fields could cause rendering errors
  - Section visibility might not match portfolio display
- **Recommendation:** Add error boundary, test with large data sets

---

## 8. ERROR HANDLING PATTERNS (Current)

### Pattern 1: Silent Failures with Null/Empty Fallbacks
**Used In:** `BuildPortfolio`, `ViewsToast`, `ContactForm`
```typescript
fetch('/api/...')
  .then(r => r.json())
  .then(data => setData(data))
  .catch(() => {})  // Silently fails
```
**Impact:** User unaware of problems; poor UX
**Risk:** Data inconsistency

---

### Pattern 2: Try-Catch with Error Messages
**Used In:** `ContactForm`, `AIAssistButton`
```typescript
try {
  const response = await fetch('/api/...');
  const data = await response.json();
  if (!response.ok) {
    setError(data.error ?? 'Default message');
    return;
  }
} catch (error) {
  setError('Network error. Please try again.');
}
```
**Impact:** User sees error; can retry
**Risk:** Generic error messages unhelpful for debugging

---

### Pattern 3: API Response Codes with Specific Errors
**Used In:** All API routes
```typescript
if (!allowed) {
  return NextResponse.json({ error: '...' }, { status: 429 });
}
```
**Output Examples:**
- 400 Bad Request - Invalid JSON, missing params
- 409 Conflict - Slug already taken
- 422 Unprocessable Entity - Validation failed
- 429 Too Many Requests - Rate limited
- 500 Internal Server Error - Unexpected

**Issue:** No error codes/IDs (harder to debug client-side)

---

### Pattern 4: Server Action Error Handling
**Used In:** `sendMail`
```typescript
try {
  const isVerified = await transporter.verify();
} catch (error) {
  console.error('Sensitive info exposed:', error);
  return; // Returns void, no error propagated
}
```
**Risk:** Errors logged but not communicated to user

---

### Pattern 5: Schema Validation Errors
**Used In:** `POST /api/portfolio`
```typescript
const parsed = PortfolioSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
    { status: 422 }
  );
}
```
**Impact:** Detailed field-level errors returned to client

---

### Gaps & Recommendations

1. **No error tracking** - No logs to external service (Sentry, DataDog)
2. **No error boundaries** - Client components can crash without catching
3. **Inconsistent error messages** - Some translated, some generic
4. **No retry logic** - Failed requests not retried automatically
5. **No timeout handling** - Long API calls could hang indefinitely
6. **No API authentication** - Anyone can spam endpoints

---

## 9. EXTERNAL DEPENDENCIES (Calls Outside the System)

### External APIs & Services

#### 1. **Upstash Redis** (Data Storage)
- **Purpose:** Persistent KV store for portfolios, slugs, rate limits, views
- **Env Vars:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **Package:** `@upstash/redis`
- **Calls:**
  - `SET` - Save portfolio
  - `SADD` - Add slug to set
  - `SISMEMBER` - Check slug taken
  - `SMEMBERS` - List all slugs
  - `GET` - Fetch portfolio
  - `INCR` - Increment views/rate limit
- **Timeout:** No explicit timeout configured
- **Fallback:** Functions return null/empty if Redis not configured

---

#### 2. **Google Gemini API** (AI Content Generation)
- **Purpose:** Generate and improve resume/portfolio content
- **Env Vars:** `GEMINI_API_KEY`
- **Model:** `gemini-2.5-flash`
- **Endpoint:** `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
- **Input:** JSON with text content prompt
- **Output:** JSON response with generated text
- **Rate Limiting at API:** Limited by Gemini quota (not enforced client-side)
- **Error Handling:** Basic 502/500 responses
- **Security:** API key exposed in backend environment only (safe)

---

#### 3. **Gmail SMTP** (Email Sending)
- **Purpose:** Send contact form emails
- **Env Vars:** `SMTP_SERVER_HOST`, `SMTP_SERVER_USERNAME`, `SMTP_SERVER_PASSWORD`, `SITE_MAIL_RECIEVER`
- **Package:** `nodemailer`
- **Protocol:** SMTP (port 587, secure mode)
- **Auth:** Username/password authentication
- **Services Called:**
  - `transporter.verify()` - Check SMTP connection
  - `transporter.sendMail()` - Send email
- **Security Issues:**
  - Credentials stored in env (acceptable)
  - Error logs could expose credentials

---

#### 4. **Skill Icons API** (Tech Stack Icons)
- **Purpose:** Display tech stack icons in cards
- **URL:** `https://skillicons.dev/icons?i=${skill}`
- **Format:** SVG icons
- **Called From:** Client-side (ProjectCard, Card components)
- **No API key** - Public CDN
- **Fallback:** Image broken if icon not found
- **Performance:** Separate HTTP request per skill; consider bundling

---

#### 5. **Sanity CMS** (Optional)
- **Purpose:** Can be used for content management (current implementation not actively used)
- **Package:** `sanity`, `next-sanity`
- **Config:** [src/sanity/lib/client.ts](src/sanity/lib/client.ts)
- **Status:** Imported but not actively used in current codebase

---

### External Libraries

#### Frontend State & Forms
- `react` - UI framework
- `react-dom` - DOM bindings
- `zod` - Schema validation
- `clsx`, `tailwind-merge` - CSS utilities

#### Animations & Carousels
- `embla-carousel-react` - Carousel component
- `tailwindcss-animate` - Animation utilities

#### UI Components
- `@radix-ui/react-slot` - Low-level component primitives
- `lucide-react`, `react-icons` - Icon libraries

#### Rich Text Editing
- `@tiptap/react`, `@tiptap/starter-kit` - Rich text editor
- `@uiw/react-md-editor` - Markdown editor

#### PDF Generation
- `@react-pdf/renderer` - Server-side PDF rendering

#### Next.js Specific
- `next` - Framework
- `next-sanity` - Sanity integration

#### Backend/Email
- `nodemailer` - Email sending
- `@upstash/redis` - Redis client (covered above)

#### Styling
- `styled-components` - CSS-in-JS
- `tailwindcss` - Utility CSS

---

## 10. ANTI-PATTERNS & POTENTIAL BUGS OBSERVED

### Critical Issues

#### 1. **Race Condition in Slug Uniqueness Check**
- **Location:** [src/app/api/portfolio/route.ts](src/app/api/portfolio/route.ts#L28)
- **Issue:** 
  ```typescript
  const taken = await isSlugTaken(slug);  // Check
  if (taken) return error;
  
  // ... other checks ...
  
  await savePortfolio(portfolio);  // Save
  ```
  - Between check and save, another request could claim the slug
- **Fix:** Use Redis transaction (Lua script) for atomic check-and-set

---

#### 2. **No CSRF Protection on Contact Form**
- **Location:** [src/components/ui/ContactForm.tsx](src/components/ui/ContactForm.tsx)
- **Issue:** Any external site can POST to `sendEmail` endpoint
- **Risk:** Spam/abuse
- **Fix:** Add token validation or use SameSite cookies

---

#### 3. **Unbounded Input to Gemini API**
- **Location:** [src/app/api/ai/route.ts](src/app/api/ai/route.ts)
- **Issue:** No input length validation before sending to external API
- **Risk:**
  - Cost explosion (Gemini charges by token)
  - DoS on external API
- **Fix:** `if (userPrompt.length > 5000) return error;`

---

#### 4. **No Rate Limiting on AI Endpoint**
- **Location:** [src/app/api/ai/route.ts](src/app/api/ai/route.ts)
- **Issue:** Anyone can spam AI assist requests
- **Risk:** Gemini API costs spike; service unavailable
- **Fix:** Add `checkRateLimit` like portfolio creation

---

#### 5. **Silent Email send() Failures**
- **Location:** [src/pages/api/sendEmail.ts](src/pages/api/sendEmail.ts#L36)
- **Issue:**
  ```typescript
  export async function sendMail(...) {
    try {
      const isVerified = await transporter.verify();  // Could throw
    } catch (error) {
      console.error(...); // Logs but continues
      return; // Returns void
    }
    const info = await transporter.sendMail(...);
    return info;
  }
  ```
- **Problem:** If verify fails, function returns undefined; caller doesn't know why
- **Fix:** Throw or return error object

---

#### 6. **Slug Generation Not Unique**
- **Location:** [src/lib/storage.ts](src/lib/storage.ts#L100+)
- **Issue:**
  ```typescript
  export function generateSlug(firstName: string, lastName: string): string {
    const base = `${firstName}${lastName}`.toLowerCase() // ...
    // No collision detection
  }
  ```
- **Problem:** If already taken, user must manually change it
- **Fix:** Add counter suffix (e.g., `shaffiahuja1`, `shaffiahuja2`) if collision

---

#### 7. **Email Recipient Validation Missing**
- **Location:** [src/pages/api/sendEmail.ts](src/pages/api/sendEmail.ts#L19)
- **Issue:**
  ```typescript
  export async function sendMail({
    email,
    sendTo, // No validation!
    // ...
  ```
- **Risk:** Attacker could redirect emails to arbitrary addresses
- **Fix:** Validate `sendTo` against whitelist or portfolio owner email

---

### Moderate Issues

#### 8. **Hardcoded Magic Numbers**
- **Locations:** Multiple
  - `RATE_LIMIT_MAX = 3` - [src/lib/storage.ts](src/lib/storage.ts#L8)
  - `RATE_LIMIT_WINDOW = 86400` - [src/lib/storage.ts](src/lib/storage.ts#L9)
  - `SLUG_DEBOUNCE_MS = 500` - [src/hooks/useSlugValidation.ts](src/hooks/useSlugValidation.ts#L10)
  - `threshold = 0.15` - [src/hooks/useScrollAnimation.ts](src/hooks/useScrollAnimation.ts#L4)
- **Issue:** Not configurable; no explanation
- **Fix:** Move to config file with comments

---

#### 9. **No Input Sanitization**
- **Location:** Form components
- **Issue:** Text inputs (name, email, description) not sanitized against XSS
- **Risk:** User-submitted data could contain malicious scripts
- **Note:** Reduced risk due to React's automatic escaping, but still vulnerable if:
  - Data rendered as `dangerouslySetInnerHTML`
  - Rich text editor doesn't sanitize (TipTap)
- **Fix:** Use `DOMPurify` or similar on user inputs

---

#### 10. **Inconsistent Error Handling**
- **Locations:** Multiple
  - `BuildPortfolio` - silent failure
  - `ContactForm` - shows toast but no retry
  - `ViewsToast` - silent failure
  - `AIAssistButton` - shows error but no retry
- **Issue:** User experience inconsistent
- **Fix:** Standardize error UX across components

---

#### 11. **No Loading States for Async Operations**
- **Location:** `ContactForm` partially has `pending`, others don't
- **Issue:** User doesn't know if action succeeded or is pending
- **Fix:** Add loading state to all async operations

---

#### 12. **Type Safety Issues**
- **Location:** Multiple components
  - `Portfolio` cast to `any` in some places
  - Props typed as `any` (e.g., Projects data)
- **Issue:** Runtime errors not caught at type check
- **Fix:** Remove `any` types and properly type all props

---

#### 13. **Missing Image Alt Text Contexts**
- **Location:** [src/components/ui/Card.tsx](src/components/ui/Card.tsx#L13+)
- **Issue:** Skill icons use `alt={skill}` but skill is just a string
- **Fix:** More descriptive alt text like `alt="React framework icon"`

---

#### 14. **No Pagination on Portfolio List**
- **Location:** [src/app/api/portfolio/list/route.ts](src/app/api/portfolio/list/route.ts#L28)
- **Issue:** Hardcoded to fetch first 6 slugs only (no scrolling/pagination)
- **Impact:** As more portfolios created, older ones not visible
- **Fix:** Add offset/limit params or cursor pagination

---

#### 15. **Memory Leak Risk in useSlugValidation**
- **Location:** [src/hooks/useSlugValidation.ts](src/hooks/useSlugValidation.ts#L46)
- **Issue:** Debounce timeout could fire after unmount if not cleaned
- **Mitigation:** Cleanup implemented, but logic complex
- **Recommendation:** Use `AbortController` instead of manual timeout cleanup

---

### Low Priority Issues

#### 16. **No Lighthouse/SEO Optimization**
- Missing meta tags on user portfolio pages
- No OG tags for social sharing
- No structured data (JSON-LD)

---

#### 17. **No Analytics Tracking**
- Page views tracked in Redis, but no funnel analysis
- No user retention metrics
- No feature usage tracking

---

#### 18. **Hardcoded Delays in ViewsToast**
- **Location:** [src/components/ui/ViewsToast.tsx](src/components/ui/ViewsToast.tsx#L20)
- **Issue:** `setTimeout(() => setVisible(true), 800)` magic number
- **Fix:** Extract to constant

---

#### 19. **No Accessibility Improvements**
- Carousel missing `role="region"`
- Some sections missing `aria-label` attributes
- Color-only status indicators (slug status) could be inaccessible to color-blind users

---

#### 20. **Legacy Data Fallback Complex**
- **Location:** Multiple routes
  - [src/app/user/[id]/page.tsx](src/app/user/[id]/page.tsx#L13)
  - [src/app/api/resume/[slug]/route.ts](src/app/api/resume/[slug]/route.ts#L7)
- **Issue:** Hardcoded slug mappings (shaffiahuja, nimishmadan, sahilahuja1729)
- **Risk:** New portfolios not included in tests
- **Fix:** Centralize legacy user config

---

## Summary of Test Coverage Recommendations

### High Priority (Critical Path)
1. **Slug validation & uniqueness** - Race conditions
2. **Form validation** - Data integrity
3. **Email sending** - User communications
4. **Resume PDF generation** - User-facing deliverable
5. **Rate limiting** - Security & cost

### Medium Priority
6. Years experience calculation
7. Section visibility logic
8. AI content generation (output validation)
9. Portfolio storage/retrieval (Redis)
10. Contact form submission

### Low Priority
11. Animations & scroll triggers
12. Carousel navigation
13. Error messages display
14. View counter updates

---

## Key Metrics for Testing

- **Code Coverage Target:** 80%+ (critical paths 100%)
- **API Response Times:** All routes < 500ms (excluding PDF generation)
- **PDF Generation:** < 5s for portfolios with max content
- **Email Send:** < 3s (SMTP timeout)
- **Redis Operations:** Latency < 50ms per operation
- **Rate Limit Accuracy:** 100% (±1 due to clock skew)

---

Generated: 2026-04-09 | Framework: Next.js 15.1 | Database: Upstash Redis | AI: Gemini 2.5-Flash
