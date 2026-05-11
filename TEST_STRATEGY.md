# Test Strategy & Implementation Plan - NextJS Portfolio

**QA Engineer:** Senior SDET
**Analysis Date:** April 9, 2026
**Coverage Target:** Near 100% with focus on critical paths

---

## STEP 1: TEST PLAN

### Test Coverage Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST COVERAGE PLAN                           │
├─────────────────────────────────────────────────────────────────┤
│ LAYER         │ MODULES                    │ PRIORITY │ COVERAGE│
├───────────────┼────────────────────────────┼──────────┼─────────┤
│ UTILS         │ 15+ functions              │ 🔴 HIGH  │ 100%    │
│               │ schema, storage, utils     │          │         │
├───────────────┼────────────────────────────┼──────────┼─────────┤
│ HOOKS         │ 4 custom hooks             │ 🔴 HIGH  │ 100%    │
│               │ form, validation, animation│          │         │
├───────────────┼────────────────────────────┼──────────┼─────────┤
│ COMPONENTS    │ 30+ React components       │ 🟡 MED   │ 80%     │
│               │ Focus: UserForm, Forms     │          │         │
├───────────────┼────────────────────────────┼──────────┼─────────┤
│ API ROUTES    │ 8 endpoints                │ 🔴 HIGH  │ 100%    │
│               │ /api/portfolio, email      │          │         │
├───────────────┼────────────────────────────┼──────────┼─────────┤
│ INTEGRATION   │ E2E flows                  │ 🟡 MED   │ 70%     │
│               │ Form → API → DB            │          │         │
└─────────────────────────────────────────────────────────────────┘
```

### Critical Paths (Must Test)

1. **Portfolio Creation Flow** 🔴
   - User submits form
   - Server validates + rate limits
   - Save to Redis
   - Redirect to portfolio page
   - **Risk:** Data loss, duplicate slugs, security bypass

2. **Slug Validation** 🔴
   - Format validation (regex)
   - Uniqueness check
   - Real-time feedback
   - **Risk:** Race condition between check & save

3. **Rate Limiting** 🔴
   - IP extraction
   - Counter increments
   - Timeout enforcement
   - **Risk:** Rate limit bypass, DoS vulnerability

4. **Form Validation** 🔴
   - All required fields
   - Email format
   - Min/max lengths
   - Array validation
   - **Risk:** Invalid data in DB, crashes

5. **API Error Handling** 🔴
   - Redis unavailable
   - Invalid requests
   - Rate limit hit
   - Email failures
   - **Risk:** Silent failures, poor UX

### Test Areas & Risks

#### A. UTILITIES (src/lib/)

**Files:**
- `schema.ts` — Zod schemas, type inference
- `storage.ts` — Redis CRUD, rate limiting
- `formValidation.ts` — Form validation logic
- `utils.ts` — Helper functions

**Risks:**
- Schema validation missing edge cases
- Storage queries fail silently
- Validation allows invalid data
- Helper functions not handling nulls

**Test Focus:**
- ✅ All Zod schemas parse/fail correctly
- ✅ Redis operations handle network errors
- ✅ Rate limiting is atomic (no race conditions)
- ✅ Validation catches all invalid inputs
- ✅ Helpers handle edge cases (null, undefined, empty strings)

---

#### B. HOOKS (src/hooks/)

**Files:**
- `useFormArray.ts` — Array field mutations
- `useSlugValidation.ts` — Debounced slug checking
- `useScrollAnimation.ts` — Intersection Observer
- `useTypingEffect.tsx` — Character animation

**Risks:**
- State mutations aren't immutable
- Debounce doesn't work (stale state)
- Observer not cleaned up (memory leak)
- Async operations not handled

**Test Focus:**
- ✅ Array operations are immutable
- ✅ Debounce works correctly
- ✅ Cleanup functions run
- ✅ State syncs properly
- ✅ Edge cases: add 0, remove all, rapid updates

---

#### C. COMPONENTS (src/components/)

**High Priority (Integration heavy):**
- `UserForm.tsx` — Master form state
- `FormSections.tsx` — Form section components
- `FormComponents.tsx` — Input atoms
- `ContactForm.tsx` — Email submission
- `BuildPortfolio.tsx` — Portfolio showcase

**Medium Priority (Display):**
- `Hero.tsx`, `About.tsx`, `Projects.tsx`
- `WorkExperience.tsx`, `Education.tsx`, `Certifications.tsx`
- `Navbar.tsx`, `Footer.tsx`

**Low Priority (Simple):**
- UI atoms: `Card.tsx`, `Button.tsx`, `Toast.tsx`

**Risks:**
- Form state becomes inconsistent
- Validation doesn't prevent submission
- API errors not handled
- Dark mode toggle doesn't work
- Mobile responsiveness breaks

**Test Focus:**
- ✅ Form renders with initial state
- ✅ Input changes update state
- ✅ Validation prevents invalid submission
- ✅ API calls work and handle errors
- ✅ Theme toggle works
- ✅ Mobile menu opens/closes

---

#### D. API ROUTES (src/app/api/)

**Critical Endpoints:**
- `POST /api/portfolio` — Create (validation, storage, security)
- `GET /api/portfolio/check-slug` — Slug check (regex, query)
- `POST /api/sendEmail` — Email (SMTP, validation)

**Important Endpoints:**
- `GET /api/portfolio/list` — Showcase
- `GET /api/portfolio/views` — Analytics
- `GET /api/resume/[slug]` — PDF
- `POST /api/ai` — AI (if enabled)

**Risks:**
- Missing input validation (injection)
- No rate limiting on email (spam)
- Unhandled Redis failures (crashes)
- Slug collision (two users same slug)
- Email validation missing (redirection)

**Test Focus:**
- ✅ Valid requests succeed
- ✅ Invalid requests rejected (422)
- ✅ Rate limiting enforced (429)
- ✅ Slug uniqueness guaranteed
- ✅ Email validation works
- ✅ Redis errors handled gracefully
- ✅ Response formats correct

---

#### E. DATA PERSISTENCE (Redis)

**Risks:**
- Data corruption
- Lost writes
- Race conditions
- Stale data

**Test Focus:**
- ✅ Data saved/retrieved correctly
- ✅ Rate limit expires
- ✅ View counter increments
- ✅ Slug set membership works

---

#### F. INTEGRATION FLOWS

**Risks:**
- End-to-end data loss
- Partial failures
- State mismatches
- Async race conditions

**Test Focus:**
- ✅ Form → API → DB → Display
- ✅ Multiple users creating simultaneously
- ✅ Network failures handled
- ✅ Slug uniqueness across concurrent requests

---

### Test File Structure

```
src/
├── __tests__/
│   ├── lib/
│   │   ├── schema.test.ts          # Zod schemas
│   │   ├── storage.test.ts         # Redis operations
│   │   ├── formValidation.test.ts  # Validation logic
│   │   └── utils.test.ts           # Helper functions
│   │
│   ├── hooks/
│   │   ├── useFormArray.test.ts
│   │   ├── useSlugValidation.test.ts
│   │   ├── useScrollAnimation.test.ts
│   │   └── useTypingEffect.test.ts
│   │
│   ├── components/
│   │   ├── UserForm.test.tsx
│   │   ├── FormSections.test.tsx
│   │   ├── FormComponents.test.tsx
│   │   ├── ContactForm.test.tsx
│   │   ├── BuildPortfolio.test.tsx
│   │   ├── Hero.test.tsx
│   │   └── ... (other components)
│   │
│   ├── api/
│   │   ├── portfolio.test.ts       # POST /api/portfolio
│   │   ├── check-slug.test.ts       # GET check-slug
│   │   ├── views.test.ts            # GET/POST views
│   │   ├── list.test.ts             # GET list
│   │   ├── resume.test.ts           # GET resume
│   │   └── sendEmail.test.ts        # POST email
│   │
│   ├── integration/
│   │   ├── form-submission.test.ts # End-to-end flow
│   │   ├── portfolio-access.test.ts # View portfolio
│   │   └── concurrent-creation.test.ts
│   │
│   ├── setup/
│   │   ├── jest.setup.ts           # Global setup
│   │   └── mocks/
│   │       ├── redis.mock.ts
│   │       ├── nodemailer.mock.ts
│   │       └── fetch.mock.ts
│   │
│   └── fixtures/
│       ├── portfolio.fixture.ts
│       └── form-data.fixture.ts

jest.config.js                       # Root config
```

---

### Missing Test Coverage Areas

| Area | Current | Needed | Risk |
|------|---------|--------|------|
| Schema validation | 0% | 100% | 🔴 HIGH |
| Storage operations | 0% | 100% | 🔴 HIGH |
| Form validation | 0% | 100% | 🔴 HIGH |
| API routes | 0% | 100% | 🔴 HIGH |
| Custom hooks | 0% | 100% | 🔴 HIGH |
| Component rendering | 0% | 80% | 🟡 MED |
| Integration flows | 0% | 70% | 🟡 MED |
| Error handling | 0% | 90% | 🔴 HIGH |
| Edge cases | 0% | 95% | 🟡 MED |

---

## STEP 2: TEST SCENARIOS

### Scenario Format
```
SCENARIO: [Name]
PRECONDITIONS: [Setup]
STEPS: [Actions]
EXPECTED: [Results]
RISK LEVEL: [🔴 HIGH / 🟡 MED / 🟢 LOW]
```

---

### 2A. SCHEMA VALIDATION TESTS (src/lib/schema.ts)

#### SCENARIO: Valid Portfolio Data Passes Validation
```
Input: Complete valid portfolio object
Expected: PortfolioSchema.safeParse() returns success
Covers: Happy path
```

#### SCENARIO: Missing Required Fields Fails
```
Input: Portfolio missing firstName, slug, email
Expected: safeParse() returns error with specific field names
Covers: Validation enforcement
```

#### SCENARIO: Invalid Email Format Fails
```
Input: { email: "not-an-email" }
Expected: Error on email field
Covers: Email validation
```

#### SCENARIO: Slug Format Validation
```
Test Cases:
- "valid-slug-123" → ✅ Pass
- "Invalid_Slug" → ❌ Fail (uppercase)
- "a" → ❌ Fail (too short, < 3)
- "a-very-long-slug-that-exceeds-forty-characters-limit" → ❌ Fail (too long)
- "slug@special" → ❌ Fail (special chars)
Covers: Regex enforcement
```

#### SCENARIO: Nested Object Validation
```
Input: AboutMe with invalid skills array (non-string items)
Expected: Error on skills field
Covers: Nested validation
```

#### SCENARIO: Experience Years Bounds
```
Test Cases:
- 0 → ✅ Pass
- 50 → ✅ Pass
- -1 → ❌ Fail
- 51 → ❌ Fail
Covers: Min/max validation
```

#### SCENARIO: Work Experience Array Validation
```
Input:
- Empty array → ❌ Fail (min 1 required)
- Array with 1 item → ✅ Pass
- Array with 100 items → ✅ Pass
Covers: Array constraints
```

#### SCENARIO: Optional Fields Can Be Undefined
```
Input: { Certifications: undefined, Education: undefined }
Expected: ✅ Pass (optional fields allowed)
Covers: Optional field handling
```

#### SCENARIO: Backward Compatibility (Legacy Flags)
```
Input: Using old `features` object instead of new `sections`
Expected: Deserialize correctly, use flags as fallback
Covers: Schema evolution
```

#### SCENARIO: Type Inference Works
```
Test: Portfolio type extracts correctly
const p: Portfolio = {...}
p.Intro.FirstName → 'string' type (no any)
Covers: TypeScript integration
```

---

### 2B. STORAGE OPERATIONS TESTS (src/lib/storage.ts)

#### SCENARIO: Save Portfolio to Redis
```
Input: Valid Portfolio object
Action: savePortfolio(portfolio)
Expected:
- Redis.set() called with correct key: `portfolio:{slug}`
- Value is JSON stringified
- Slug added to set via SADD
- No errors thrown
Covers: Write operations
```

#### SCENARIO: Retrieve Portfolio from Redis
```
Input: Slug name
Action: getPortfolio("sahilahuja1729")
Expected: Returns Portfolio object (parsed JSON)
Covers: Read operations
```

#### SCENARIO: Portfolio Not Found Returns Null
```
Input: Slug that doesn't exist
Action: getPortfolio("nonexistent")
Expected: Returns null (not error)
Covers: Graceful handling
```

#### SCENARIO: Slug Uniqueness Check
```
Test Cases:
- Slug in set → isSlugTaken() returns true
- Slug not in set → returns false
Covers: Set membership
```

#### SCENARIO: Rate Limiting Works
```
Action: checkRateLimit("192.168.1.1") called 3 times
Expected:
- First call: { allowed: true, remaining: 2 }
- Second call: { allowed: true, remaining: 1 }
- Third call: { allowed: true, remaining: 0 }
- Fourth call: { allowed: false, remaining: 0 }
Covers: Counter enforcement
```

#### SCENARIO: Rate Limit Resets After TTL
```
Action: Call checkRateLimit(), wait for TTL, call again
Expected: Counter reset (remaining: 3)
Covers: TTL handling
```

#### SCENARIO: View Counter Increments
```
Action: incrementViews("slug") called multiple times
Expected: Returns incrementing numbers (1, 2, 3, ...)
Covers: Analytics
```

#### SCENARIO: Get Views for Portfolio
```
Action: getViews("slug") after incrementing 5 times
Expected: Returns 5
Covers: Counter retrieval
```

#### SCENARIO: Views Default to 0
```
Input: Slug with no views
Action: getViews("newslug")
Expected: Returns 0
Covers: Default handling
```

#### SCENARIO: Redis Not Configured Degrades Gracefully
```
Setup: No UPSTASH_REDIS_REST_URL env var
Action: getRedis() called
Expected: Returns null, all operations return safe defaults
Covers: Missing dependency handling
```

#### SCENARIO: Slug Generation
```
Input: firstName="Sahil", lastName="Ahuja"
Action: generateSlug(firstName, lastName)
Expected:
- Returns lowercase slug
- Contains "sahilahuja" (first + last)
- Includes random suffix (4 chars)
- Matches /^[a-z0-9-]{7,34}$/
Covers: Slug generation
```

---

### 2C. FORM VALIDATION TESTS (src/lib/formValidation.ts)

#### SCENARIO: All Valid Form Data Passes
```
Input: Complete PortfolioFormData with all required fields
Expected: validateForm() returns empty errors object
Covers: Happy path
```

#### SCENARIO: Missing First Name
```
Input: { firstName: "" }
Expected: errors.firstName = "First name is required"
Covers: Required field validation
```

#### SCENARIO: Intro Too Short
```
Input: { oneLinerIntro: "12345" } (< 10 chars)
Expected: errors.oneLinerIntro = "Intro must be at least 10 characters"
Covers: Min length validation
```

#### SCENARIO: Invalid Email
```
Test Cases:
- "not-email" → Error
- "missing@domain" → Error
- "user@domain.com" → ✅ Pass
- "user+tag@domain.co.uk" → ✅ Pass
Covers: Email format validation
```

#### SCENARIO: Slug Validation with Status
```
Test Cases:
- Slug invalid format + status='invalid' → Error
- Slug valid format + status='taken' → Error
- Slug valid format + status='available' → ✅ Pass
Covers: Slug status integration
```

#### SCENARIO: Work Experience Required
```
Input: workExperiences = []
Expected: Error saying "at least 1 item required"
Covers: Array minimum validation
```

#### SCENARIO: Work Experience Fields
```
Input: Work item with missing company/title
Expected: errors like "work_company_0", "work_title_0"
Covers: Nested field validation
```

#### SCENARIO: Skills Required
```
Input: skills = []
Expected: Error: "Select at least one skill"
Covers: Multi-select validation
```

#### SCENARIO: Education is Optional
```
Input: education = []
Expected: No error
Covers: Optional array handling
```

#### SCENARIO: Certification Optional But Fields Required If Present
```
Input: certifications = [{ name: "", organization: "Udemy" }]
Expected: errors.cert_name_0
Covers: Conditional validation
```

#### SCENARIO: No Errors Function
```
Input: Valid form
Action: hasErrors(errors)
Expected: Returns false
Covers: Helper function
```

#### SCENARIO: Scroll to First Error
```
Setup: Add [data-error="true"] to DOM element
Action: scrollToFirstError()
Expected: Element.scrollIntoView() called
Covers: DOM side effect
```

---

### 2D. UTILITY FUNCTION TESTS (src/lib/utils.ts)

#### SCENARIO: Calculate Years of Experience
```
Test Cases:
- No work history → Returns 0
- 1 job for 5 years → Returns 5
- 2 jobs, 2.5 years each (no overlap) → Returns 5
- 2 jobs, overlapping 1 year → Returns ~3 (merged)
- Current job (no end date) → Includes up to today
Covers: Complex date math
```

#### SCENARIO: Years Display With Decimals
```
Input: 5.3 years calculated
Expected: Displays "5.3" (not "5.0")
Covers: Formatting
```

#### SCENARIO: classNameMerge (cn utility)
```
Input: cn("p-4", "p-8") // Tailwind conflict
Expected: "p-8" (merge wins, not both)
Covers: Tailwind conflict resolution
```

#### SCENARIO: Get Section Visibility
```
Input: Portfolio with sections and features
Expected: Returns visibility flags for each section
Covers: Legacy compatibility
```

---

### 2E. HOOK TESTS

#### 2E1: useFormArray

**SCENARIO: Add Item to Array**
```
Initial: [item1, item2]
Action: add(item3)
Expected: [item1, item2, item3]
Covers: Array immutability
```

**SCENARIO: Remove Item by Index**
```
Initial: [item1, item2, item3]
Action: remove(1)
Expected: [item1, item3]
Covers: Index-based deletion
```

**SCENARIO: Update Item Field**
```
Initial: [{ company: "Old" }, ...]
Action: update(0, 'company', 'New')
Expected: [{ company: "New" }, ...]
Covers: Immutable update
```

**SCENARIO: Cannot Mutate Directly**
```
Action: items[0] = newItem (direct mutation)
Expected: Changes don't trigger re-render
Covers: Immutability enforcement
```

#### 2E2: useSlugValidation

**SCENARIO: Debounce Slug Checking**
```
Action: Call checkSlug() rapidly (5 times in 100ms)
Expected: Only 1 API call after 500ms delay
Covers: Debounce mechanism
```

**SCENARIO: Slug Format Validation**
```
Input: "Invalid_Slug"
Expected: Immediately sets status='invalid' (no API call)
Covers: Client-side validation
```

**SCENARIO: Slug Sanitization**
```
Input: "MySlug@123"
Expected: Converts to "myslug123" (lowercase, remove @)
Covers: Input normalization
```

**SCENARIO: Available Status**
```
Setup: API returns { available: true }
Expected: Status changes to 'available'
Covers: Status update
```

**SCENARIO: Taken Status**
```
Setup: API returns { available: false }
Expected: Status changes to 'taken'
Covers: Collision detection
```

**SCENARIO: Cleanup on Unmount**
```
Action: Component unmounts while debounce pending
Expected: debounceRef.current cleared, no pending calls
Covers: Memory leak prevention
```

#### 2E3: useScrollAnimation

**SCENARIO: Animation Triggers on Scroll**
```
Setup: Element visible in viewport (threshold 15%)
Expected: visible=true, opacity-100 class applied
Covers: Happy path animation
```

**SCENARIO: Animation Doesn't Fire Again**
```
Setup: Element animated once
Action: Scroll in/out of view
Expected: observer.disconnect() called, only 1 animation
Covers: One-time animation
```

**SCENARIO: No Animation If Element Out of View**
```
Setup: Element below fold
Expected: visible=false, opacity-0 class applied
Covers: Initial state
```

**SCENARIO: Cleanup Removes Observer**
```
Action: Component unmounts
Expected: observer.disconnect() called
Covers: Resource cleanup
```

#### 2E4: useTypingEffect

**SCENARIO: Text Types Character by Character**
```
Input: "Hello" with 50ms delay
Expected: "" → "H" → "He" → "Hel" → "Hell" → "Hello"
Covers: Streaming text effect
```

**SCENARIO: Typing Completes in ~250ms**
```
Input: "Hello" (5 chars * 50ms)
Expected: Completes in ~250ms
Covers: Timing accuracy
```

---

### 2F: COMPONENT TESTS

#### 2F1: UserForm Component

**SCENARIO: Form Renders with Initial State**
```
Expected:
- Form fields visible (firstName, lastName, etc.)
- Empty inputs
- No errors shown
Covers: Rendering
```

**SCENARIO: User Fills Form Successfully**
```
Actions:
1. Type "Sahil" in firstName
2. Type "Ahuja" in lastName
3. Form auto-generates slug
4. Type email
5. Click submit
Expected:
- State updates
- Slug validation called
- No validation errors
- API called
- Redirect triggered
Covers: Happy path
```

**SCENARIO: Validation Errors Show**
```
Action: Click submit with empty firstName
Expected:
- Error message appears: "First name is required"
- Element with data-error=true focused
- Form doesn't submit
Covers: Validation UX
```

**SCENARIO: Slug Validation Real-Time**
```
Action: Type slug "test-slug"
Expected:
- After 500ms: API called
- Response: "available" → Shows green checkmark
- Type "taken-slug" → Shows red X
Covers: Real-time validation
```

**SCENARIO: Add Work Experience**
```
Actions:
1. Click "Add Work" button
2. New empty work item added
3. Fill in fields
4. Remove middle item
Expected: Array managed correctly
Covers: Array manipulation
```

**SCENARIO: Form State Persists on Error**
```
Actions:
1. Fill form partially
2. Trigger validation error
3. Fix error and submit
Expected: Previous data retained
Covers: State preservation
```

**SCENARIO: Theme Toggle Works**
```
Action: Click theme toggle
Expected:
- localStorage updated
- HTML class changed (dark/light)
- Components re-render
Covers: Theme state
```

#### 2F2: FormComponents (Input Atoms)

**SCENARIO: FieldError Renders Message**
```
Input: { fieldName: "firstName", error: "Required" }
Expected: Displays error message, highlights field
Covers: Error display
```

**SCENARIO: MultiSelect Skills**
```
Actions:
1. Click skill checkbox (react)
2. Check another (typescript)
Expected:
- Selected array includes both
- UI shows checked state
Covers: Multi-select
```

#### 2F3: ContactForm

**SCENARIO: Email Submission Success**
```
Actions:
1. Fill form (name, email, message)
2. Click Send
Expected:
- sendMail() called with correct data
- Toast shows "Email sent successfully"
- Form resets
- Button disabled during loading
Covers: Email flow
```

**SCENARIO: Email Submission Failure**
```
Setup: sendMail() throws error
Expected:
- Toast shows error
- Button re-enabled
- Form data retained
Covers: Error handling
```

#### 2F4: BuildPortfolio Showcase

**SCENARIO: Loads Recent Portfolios**
```
Setup: Fetch /api/portfolio/list returns 3 portfolios
Expected:
- Component fetches on mount
- Displays 3 user avatars
- Links to /user/[slug]
Covers: Data loading
```

**SCENARIO: Graceful Failure**
```
Setup: /api/portfolio/list fails
Expected:
- No error thrown
- Shows legacy users only
- No infinite loading
Covers: Error resilience
```

---

### 2G: API ROUTE TESTS

#### 2G1: POST /api/portfolio

**SCENARIO: Valid Submission Creates Portfolio**
```
Request:
POST /api/portfolio
{ slug: "newuser1", Intro: {...} }

Expected:
- 201 Created
- Response: { success: true, slug, url, remaining }
- Redis.set() called
- Slug added to set
Covers: Happy path
```

**SCENARIO: Rate Limit Enforced**
```
Setup: Same IP created 3 portfolios already
Request: 4th request from same IP
Expected:
- 429 Too Many Requests
- Response: { error: "Try again tomorrow" }
- Redis counter untouched
Covers: Rate limiting
```

**SCENARIO: Validation Fails**
```
Request: { slug: "x" } (missing required fields)
Expected:
- 422 Unprocessable Entity
- Response: { error, issues: { slug: [...], firstName: [...] } }
- Nothing saved to Redis
Covers: Input validation
```

**SCENARIO: Slug Already Taken**
```
Setup: "myslug" exists in Redis
Request: { slug: "myslug", ... }
Expected:
- 409 Conflict
- Response: { error: "URL already taken" }
- No new portfolio saved
Covers: Uniqueness enforcement
```

**SCENARIO: Redis Not Configured**
```
Setup: UPSTASH_REDIS_REST_URL undefined
Request: Valid portfolio data
Expected:
- 503 Service Unavailable
- Response: { error: "Storage not configured..." }
Covers: Missing dependency
```

**SCENARIO: Invalid JSON**
```
Request: Malformed JSON body
Expected:
- 400 Bad Request
- Response: { error: "Invalid JSON body" }
Covers: Malformed input
```

#### 2G2: GET /api/portfolio/check-slug

**SCENARIO: Slug Available**
```
Request: GET /api/portfolio/check-slug?slug=newslug
Expected:
- 200 OK
- Response: { available: true }
Covers: Happy path
```

**SCENARIO: Slug Taken**
```
Setup: Slug exists in Redis
Request: GET /api/portfolio/check-slug?slug=existingslug
Expected:
- 200 OK
- Response: { available: false }
Covers: Collision detection
```

**SCENARIO: Invalid Slug Format**
```
Request: GET /api/portfolio/check-slug?slug=Invalid_123
Expected:
- 200 OK
- Response: { available: false, reason: "invalid_format" }
Covers: Format validation
```

**SCENARIO: Missing Slug Parameter**
```
Request: GET /api/portfolio/check-slug
Expected:
- 400 Bad Request
- Response: { error: "slug param required" }
Covers: Required parameter validation
```

#### 2G3: POST /api/sendEmail

**SCENARIO: Email Sends Successfully**
```
Request:
POST /api/sendEmail
{ email: "user@example.com", sendTo: "owner@example.com", subject: "Hi", text: "Message" }

Expected:
- 200 OK
- Response: { messageId, response: "250 OK" }
- Nodemailer.transporter.sendMail() called
Covers: Happy path
```

**SCENARIO: Invalid Recipient Email**
```
Request: { sendTo: "not-an-email" }
Expected:
- 400 Bad Request or email still sent (depends on validation)
- Shows error or sends anyway
Covers: Email validation gap (security issue)
```

**SCENARIO: SMTP Connection Fails**
```
Setup: SMTP_SERVER_PASSWORD wrong
Request: Valid email data
Expected:
- 500 Internal Server Error
- Response: { error: "Email failed" }
- Error logged
Covers: SMTP failure
```

#### 2G4: GET /api/portfolio/list

**SCENARIO: Returns Recent Portfolios**
```
Setup: 6+ portfolios in Redis
Request: GET /api/portfolio/list
Expected:
- 200 OK
- Response: { slugs: [{ slug, firstName, lastName, ... }] }
- Max 6 portfolios
Covers: List endpoint
```

**SCENARIO: Empty List**
```
Setup: No portfolios in Redis
Request: GET /api/portfolio/list
Expected:
- 200 OK
- Response: { slugs: [] }
Covers: Empty state
```

---

### 2H: INTEGRATION TESTS

#### 2H1: Form Submission → Storage → Display

**SCENARIO: End-to-End Portfolio Creation**
```
Steps:
1. User opens /user/create
2. Fills entire form
3. Clicks submit
4. Observes redirect to /user/[slug]
5. New portfolio displays

Verifications:
- Form data in Redis
- Correct rendering
- View counter initialized
- Portfolio accessible
Covers: Full flow
```

#### 2H2: Concurrent Portfolio Creation

**SCENARIO: Race Condition Prevention**
```
Setup: 2 users try to create portfolio with same slug
Expected:
- First succeeds (slot taken)
- Second gets 409 Conflict
- No duplicate in Redis
Covers: Concurrency safety
```

#### 2H3: Portfolio Access (Upstash First, Fallback)

**SCENARIO: Render New User Portfolio**
```
Request: /user/newswimmer
Expected:
- Query Upstash for portfolio:newswimmer
- Found → render
- View counter increments
Covers: Happy path
```

**SCENARIO: Render Legacy User Portfolio**
```
Request: /user/sahilahuja1729
Expected:
- Query Upstash (empty)
- Fallback to import src/data/SahilAhuja.ts
- Render with legacy data
Covers: Backward compatibility
```

**SCENARIO: Portfolio Not Found → 404**
```
Request: /user/nonexistent
Expected:
- Query Upstash (empty)
- No legacy fallback
- notFound() called → 404 page
Covers: Error case
```

---

## STEP 3: TEST IMPLEMENTATION

**(Full test files follow in separate sections below)**

---

## Test Configuration

### jest.config.js (Create at root)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Change to 'jsdom' for component tests
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.ts'],
};
```

### package.json (Update scripts)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest src/__tests__/lib src/__tests__/hooks",
    "test:components": "jest src/__tests__/components",
    "test:api": "jest src/__tests__/api",
    "test:integration": "jest src/__tests__/integration"
  }
}
```

---

## BUGS AND ANTI-PATTERNS FOUND

### 🔴 CRITICAL - Must Fix

1. **Race Condition in Slug Uniqueness (src/app/api/portfolio/route.ts)**
   ```
   Issue: Check slug uniqueness → Save portfolio is NOT atomic
   
   Current code:
   const taken = await isSlugTaken(portfolio.slug);  // Line 1
   if (taken) return error;                            // Line 2
   await savePortfolio(portfolio);                    // Line 3
   
   Problem:
   - Between Line 1 & 3, another request could save same slug
   - Result: Duplicate portfolios with same slug
   
   Fix: Use Redis SETNX (set if not exists) or Lua script
   ```

2. **Email Recipient Redirection Vulnerability (src/pages/api/sendEmail.ts)**
   ```
   Issue: Any email can be sent to any recipient
   
   Current:
   const response = await transporter.sendMail({
     from: email,           // User-controlled
     to: sendTo || SITE_MAIL_RECIEVER, // Can override
     ...
   });
   
   Problem:
   - ContactForm can pass any sendTo email
   - Attacker sends emails to arbitrary addresses
   
   Fix: Always use SITE_MAIL_RECIEVER, never expose to client
   ```

3. **No Input Sanitization on Email (XSS/Header Injection)**
   ```
   Issue: User-controlled email used as email header
   
   Risk:
   - Email header injection: "sender@test.com\nBCC: attacker@evil.com"
   - Message manipulation
   
   Fix: Validate/sanitize email before sending
   ```

4. **Unbounded API Calls to Gemini (Cost Explosion)**
   ```
   Issue: No rate limiting on POST /api/ai endpoint
   
   Current:
   // No check before calling Gemini
   const response = await fetchGeminiHidden(prompt);
   
   Problem:
   - Attacker calls endpoint 1000x → expensive API bills
   - No per-user/IP limit
   
   Fix: Implement rate limiting on AI endpoint
   ```

5. **Silent Failure in View Counter (Fire-and-Forget)**
   ```
   Issue: incrementViews(id).catch(() => {})
   
   Problem:
   - Errors silently ignored
   - Views never tracked
   - No logging
   
   Fix: Log critical errors, consider retry logic
   ```

### 🟡 MODERATE - Should Fix

6. **Inconsistent Error Handling**
   ```
   Pattern 1: Graceful degradation
   if (!redis) return null;
   
   Pattern 2: Throw error
   if (!redis) throw new Error("REDIS_NOT_CONFIGURED");
   
   Pattern 3: Try-catch
   try { ... } catch(e) { console.error }
   
   Better: Consistent pattern across all utilities
   ```

7. **Magic Numbers Throughout Codebase**
   ```
   Examples:
   - 86400 (seconds in day) — RATE_LIMIT_WINDOW
   - 3 — RATE_LIMIT_MAX
   - 500 — SLUG_DEBOUNCE_MS
   - 256 — length checks
   - 40 — slug max length
   
   Better: Define constants at module top
   ```

8. **useSlugValidation Memory Leak**
   ```
   Issue: debounceRef not always cleaned up correctly
   
   Current:
   useEffect(() => {
     return () => {
       if (debounceRef.current) clearTimeout(debounceRef.current);
     };
   }, []); // Only runs once, not on every state change
   
   Better: Improved cleanup logic
   ```

9. **No Loading/Disabled State During Email Send**
   ```
   Current: Button disabled only during pending state
   
   Problem: If state update is slow, user might click twice
   
   Better: Disable button immediately, use optimistic UI
   ```

10. **Form Doesn't Prevent Navigation**
    ```
    Issue: User fills form, navigates away, data lost
    
    Better: Warn user on unsaved changes
    ```

---

## Test Execution Plan

1. **Install dependencies**
   ```bash
   npm install --save-dev jest ts-jest @testing-library/react @testing-library/jest-dom @types/jest jest-mock-extended
   ```

2. **Create test setup files** (provided below)

3. **Run tests**
   ```bash
   npm test                 # All tests
   npm run test:coverage    # With coverage report
   npm run test:watch      # Watch mode for development
   ```

4. **CI/CD Integration**
   ```yaml
   # .github/workflows/test.yml
   - run: npm run test:coverage
   - run: npm run test:ci # Exit 1 if <80% coverage
   ```

---

**Next:** Full test implementation files follow in next sections.

