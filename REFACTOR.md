# ShelfControl Landing Page Refactoring Plan

## Overview
Transform the current index.html to match the redesigned mockup (new-index-mockup.html), while **keeping the existing color scheme** from styles.css and updating the calculator to use a **date picker instead of days input**.

---

## Key Principles

1. **Keep existing color palette** from styles.css
2. **Use date picker** in calculator (not "days until deadline")
3. **Preserve web3forms integration** for form submission
4. **Add new interactive features** (calculator, carousel)
5. **Reorder and restructure** content based on mockup

---

## Color Scheme (From Existing styles.css)

**IMPORTANT: Keep these existing colors throughout**

```css
--navy: #2B3D4F
--lavender: #B8A9D9
--peach: #E8B4A0 (also blush)
--rose: #E8B4B8
--dark-purple: #4b2e83
--cream: #F5F1EA
--gold: #D4A574
--white: #FFFFFF
```

**Button Colors:**
- Primary CTA: `--dark-purple` (#4b2e83)
- Hover states: Use existing transition styles

**Color Indicators (for calculator and features):**
- Comfortable: `--lavender` (#B8A9D9)
- Tight: `--peach` (#E8B4A0)
- Unrealistic: `--rose` (#E8B4B8)

---

## New Page Structure (Order)

1. Navigation (existing)
2. Hero (updated)
3. Problem Section (drastically reduced)
4. **Calculator Demo** (NEW)
5. Features (reduced from 6 to 3)
6. **Comparison Table** (NEW)
7. **FAQ** (moved up from near-bottom)
8. Testimonials (converted to carousel)
9. Setup (add visual walkthrough)
10. Waitlist (keep existing)
11. Footer (keep existing)
12. **Mobile Sticky CTA** (NEW)

---

## Section-by-Section Changes

### 1. Hero Section

**Changes:**
- Headline: "From drowning to breathing."
- Subheadline: "Know which ARCs you can actually finish."
- Add social proof: "150+ ARC reviewers tracking deadlines"
- CTA button text: "Get Early Access"
- Replace screenshot with placeholder (requirements included in mockup)

**Structure:**
```html
<section class="hero">
  <div class="hero-text">
    <h1>From drowning to breathing.</h1>
    <h2>Know which ARCs you can actually finish.</h2>
    <div class="social-proof">
      <span class="user-count">150+ ARC reviewers tracking deadlines</span>
    </div>
    <button class="cta-primary">Get Early Access</button>
  </div>
  <div class="hero-visual">
    <!-- Screenshot placeholder with requirements -->
  </div>
</section>
```

**Keep:** Existing background gradient, existing button colors

---

### 2. Problem Section

**Current:** 4 paragraphs (98 words)

**New:** 2 sentences + illustration
```html
<section class="problem-visual">
  <div class="problem-text">
    <h2>You're drowning in ARCs.</h2>
    <p>Spreadsheets show what's due. ShelfControl shows what's possible at your reading speed.</p>
  </div>
  <div class="problem-illustration">
    <!-- Illustration placeholder -->
  </div>
</section>
```

**Remove:** All 4 current paragraphs

**Add:** Two-column grid layout, illustration placeholder

---

### 3. Interactive Calculator Demo (NEW SECTION)

**Add this entirely new section between Problem and Features**

**Structure:**
```html
<section class="calculator-demo">
  <div class="demo-content">
    <h2>See How It Works</h2>
    <p>Try the calculator that's helping 150+ ARC reviewers</p>

    <div class="demo-calculator">
      <div class="demo-input-group">
        <label>Book pages</label>
        <input type="number" id="demo-pages" placeholder="e.g., 384" min="1">
      </div>

      <div class="demo-input-group">
        <label>Deadline date</label>
        <input type="date" id="demo-deadline">
      </div>

      <button class="demo-calculate" onclick="calculateDemo()">Calculate</button>

      <div class="demo-result hidden">
        <p class="demo-number-display">
          You'd need to read <span class="demo-number">47</span> pages per day
        </p>
        <div class="demo-color-indicator comfortable">
          <span class="indicator-dot"></span>
          <span>Comfortable pace at your reading speed</span>
        </div>
      </div>
    </div>
  </div>

  <div class="demo-preview">
    <!-- Screenshot placeholder -->
    <p class="demo-caption">This is what you'll see for every ARC</p>
  </div>

  <p class="demo-cta">Want this for all your ARCs? <a href="#waitlist">Join the waitlist</a></p>
</section>
```

**JavaScript Function:**
```javascript
function calculateDemo() {
  const pages = parseInt(document.getElementById('demo-pages').value);
  const deadlineDate = new Date(document.getElementById('demo-deadline').value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day

  const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

  if (pages && daysUntil > 0) {
    const pagesPerDay = Math.ceil(pages / daysUntil);
    const resultElement = document.querySelector('.demo-result');
    const numberElement = document.querySelector('.demo-number');
    const colorIndicator = document.querySelector('.demo-color-indicator');

    numberElement.textContent = pagesPerDay;

    // Assume average reading speed of 50 pages/day
    if (pagesPerDay <= 50) {
      colorIndicator.className = 'demo-color-indicator comfortable';
      colorIndicator.querySelector('span:last-child').textContent =
        'Comfortable pace at your reading speed';
    } else if (pagesPerDay <= 75) {
      colorIndicator.className = 'demo-color-indicator tight';
      colorIndicator.querySelector('span:last-child').textContent =
        'Tight but doable - extra effort needed';
    } else {
      colorIndicator.className = 'demo-color-indicator unrealistic';
      colorIndicator.querySelector('span:last-child').textContent =
        'Not possible at your current reading speed';
    }

    resultElement.classList.remove('hidden');
  }
}
```

**Color Classes (use existing variables):**
- `.demo-color-indicator.comfortable` → background: var(--lavender)
- `.demo-color-indicator.tight` → background: var(--peach)
- `.demo-color-indicator.unrealistic` → background: var(--rose)

---

### 4. Features Section - Reduce from 6 to 3

**Remove these 3 features:**
- Review tracking
- Quick progress
- Book notes

**Keep these 3 features with enhancements:**

1. **Pages-per-day on every book** (📊)
   - Add screenshot placeholder

2. **Widget decision helper** (⚡)
   - Add screenshot placeholder

3. **Calendar view** (📅)
   - Add screenshot placeholder

**New section title:** "ShelfControl Gives You Instant Answers"

**Structure:**
```html
<section class="features-grid">
  <h2>ShelfControl Gives You Instant Answers</h2>
  <div class="features">
    <div class="feature-card">
      <div class="feature-icon">📊</div>
      <h3>Pages-per-day on every book</h3>
      <p>Color-coded for comfortable, tight, or unrealistic pacing. Know immediately what's sustainable.</p>
      <!-- Screenshot placeholder -->
    </div>
    <!-- Repeat for other 2 features -->
  </div>
</section>
```

**Layout:** 3-column grid (existing grid system can be used)

---

### 5. Comparison Table (NEW SECTION)

**Add after Features section**

**Structure:**
```html
<section class="comparison">
  <h2>What Makes ShelfControl Different</h2>
  <div class="comparison-table-wrapper">
    <table class="comparison-table">
      <thead>
        <tr>
          <th></th>
          <th>Spreadsheets</th>
          <th>Notes Apps</th>
          <th class="highlight">ShelfControl</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Shows what's due</td>
          <td><span class="check">✓</span></td>
          <td><span class="check">✓</span></td>
          <td><span class="check highlight">✓</span></td>
        </tr>
        <tr>
          <td>Shows what's possible</td>
          <td><span class="cross">✗</span></td>
          <td><span class="cross">✗</span></td>
          <td><span class="check highlight">✓</span></td>
        </tr>
        <tr>
          <td>Widget decision help</td>
          <td><span class="cross">✗</span></td>
          <td><span class="cross">✗</span></td>
          <td><span class="check highlight">✓</span></td>
        </tr>
        <tr>
          <td>Learns your reading speed</td>
          <td><span class="cross">✗</span></td>
          <td><span class="cross">✗</span></td>
          <td><span class="check highlight">✓</span></td>
        </tr>
        <tr>
          <td>Mobile-optimized</td>
          <td><span class="cross">✗</span></td>
          <td><span class="partial">~</span></td>
          <td><span class="check highlight">✓</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

**Styling:**
- Highlighted column: background using var(--lavender)
- Check marks: green (#4CAF50)
- Cross marks: light gray (#CCC)
- Partial: orange (#FFA726)
- Mobile: horizontal scroll, ShelfControl column sticky

---

### 6. FAQ Section - Move & Reduce

**Current position:** Near bottom (after testimonials and setup)

**New position:** Before Testimonials (after Comparison Table)

**Reduce from 7 to 4 questions:**

**KEEP:**
1. How does ShelfControl know my reading speed?
2. How does the daily reading goal work across multiple books?
3. What if I'm already behind on a deadline?
4. Will this help improve my NetGalley ratio?

**REMOVE:**
5. Can I use this for library books or book club reads?
6. What devices does ShelfControl work on?
7. When does this launch?

**Update title:** Change "quick answers" to "Quick Answers" (capitalize)

**Keep existing:** FAQ accordion functionality

---

### 7. Testimonials - Convert to Carousel

**Current:** Static 3-card grid, all visible at once

**New:** Interactive carousel showing one at a time

**Structure:**
```html
<section class="testimonials-carousel">
  <h2>What ARC Reviewers Say</h2>

  <div class="carousel-wrapper">
    <div class="testimonial-slide active">
      <div class="testimonial-avatar">
        <div class="avatar-placeholder">C</div>
      </div>
      <blockquote>"Your app is basically better than what I have"</blockquote>
      <p class="testimonial-name">Caroline, ARC reviewer</p>
      <p class="testimonial-context">...</p>
    </div>
    <!-- Slides 2 and 3 (not active by default) -->
  </div>

  <div class="carousel-controls">
    <button class="carousel-prev" onclick="changeSlide(-1)">←</button>
    <div class="carousel-dots">
      <span class="dot active" onclick="currentSlide(1)"></span>
      <span class="dot" onclick="currentSlide(2)"></span>
      <span class="dot" onclick="currentSlide(3)"></span>
    </div>
    <button class="carousel-next" onclick="changeSlide(1)">→</button>
  </div>
</section>
```

**JavaScript Functions:**
```javascript
let currentSlideIndex = 1;
showSlide(currentSlideIndex);

function changeSlide(n) {
  showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
  showSlide(currentSlideIndex = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');

  if (n > slides.length) { currentSlideIndex = 1 }
  if (n < 1) { currentSlideIndex = slides.length }

  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[currentSlideIndex - 1].classList.add('active');
  dots[currentSlideIndex - 1].classList.add('active');
}

// Auto-rotate every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);
```

**Styling:**
- Avatar circles: background var(--lavender)
- Control buttons: background var(--lavender)
- Active dot: background var(--lavender)
- Only `.active` slide is `display: block`, others are `display: none`

---

### 8. Setup Section - Add Visual Walkthrough

**Current:** Text-only steps (4 paragraph-style steps)

**New:** Video/GIF placeholder + step indicators

**Structure:**
```html
<section class="setup-visual">
  <h2>Simple to Start Using</h2>

  <div class="setup-animation-container">
    <!-- Video/GIF placeholder with requirements -->
  </div>

  <div class="setup-steps-visual">
    <div class="step-indicator active">
      <span class="step-number">1</span>
      <p>Search your book</p>
    </div>
    <div class="step-indicator">
      <span class="step-number">2</span>
      <p>Set deadline</p>
    </div>
    <div class="step-indicator">
      <span class="step-number">3</span>
      <p>Log pages</p>
    </div>
    <div class="step-indicator">
      <span class="step-number">4</span>
      <p>Everything updates</p>
    </div>
  </div>

  <p class="setup-cta">No complicated setup. Start tracking in under 60 seconds.</p>
</section>
```

**Remove:** Old text-based steps

**Add:** 4 numbered step indicators, video placeholder, tagline

---

### 9. Waitlist Section

**Keep:**
- Existing form structure
- Web3forms integration (action and access_key)
- Email input
- Optional fields (challenge, book_count)
- Form submission JavaScript
- Success message

**Minor style updates** to match new layout (but keep functionality intact)

---

### 10. Mobile Sticky CTA (NEW)

**Add at end of body, before closing tag:**

```html
<!-- Mobile Sticky CTA -->
<div class="mobile-cta-bar">
  <button class="mobile-cta">Join Waitlist</button>
</div>
```

**CSS (add to styles.css):**
```css
@media (max-width: 768px) {
  .mobile-cta-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: white;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .mobile-cta {
    width: 100%;
    background: var(--dark-purple);
    color: white;
    border: none;
    padding: 14px;
    border-radius: var(--border-radius);
    font-size: 16px;
    font-weight: 600;
  }
}
```

**Behavior:** Only shows on mobile (<768px), fixed to bottom, scrolls to waitlist section on click

---

## CSS Strategy

### Approach
1. **Keep existing styles.css file**
2. **Add new styles for new sections** (calculator, comparison, carousel, etc.)
3. **Update existing section styles** as needed
4. **Maintain existing color variables** throughout

### New CSS Needed

**Calculator Demo:**
```css
.calculator-demo { /* styles */ }
.demo-calculator { /* styles */ }
.demo-input-group { /* styles */ }
.demo-result { /* styles */ }
.demo-color-indicator { /* styles */ }
.demo-color-indicator.comfortable { background: var(--lavender); }
.demo-color-indicator.tight { background: var(--peach); }
.demo-color-indicator.unrealistic { background: var(--rose); }
```

**Comparison Table:**
```css
.comparison { /* styles */ }
.comparison-table { /* styles */ }
.comparison-table th.highlight { background: var(--lavender); }
.check { color: #4CAF50; }
.cross { color: #CCC; }
.partial { color: #FFA726; }
```

**Testimonial Carousel:**
```css
.testimonials-carousel { /* styles */ }
.carousel-wrapper { /* styles */ }
.testimonial-slide { display: none; }
.testimonial-slide.active { display: block; }
.testimonial-avatar { /* styles */ }
.avatar-placeholder { background: var(--lavender); }
.carousel-controls { /* styles */ }
.carousel-prev, .carousel-next { background: var(--lavender); }
.dot { background: #CCC; }
.dot.active { background: var(--lavender); }
```

**Setup Visual:**
```css
.setup-visual { /* styles */ }
.setup-steps-visual { /* 4-column grid */ }
.step-indicator { /* styles */ }
.step-number { /* styles */ }
.step-indicator.active .step-number { background: var(--lavender); }
```

---

## JavaScript Changes

### New Functions to Add

1. **calculateDemo()** - Calculator with date picker logic
2. **changeSlide(n)** - Carousel navigation
3. **currentSlide(n)** - Carousel direct navigation
4. **showSlide(n)** - Carousel display logic
5. **Auto-rotate interval** - 5-second carousel rotation

### Keep Existing

1. FAQ accordion functionality
2. Form submission handler
3. Form success display
4. Any existing animations

---

## Implementation Checklist

- [ ] Update Hero section (headline, subheadline, social proof, CTA text)
- [ ] Reduce Problem section to 2 sentences + illustration placeholder
- [ ] Add Calculator Demo section (with date picker)
- [ ] Add calculator JavaScript function
- [ ] Reduce Features from 6 to 3, add screenshot placeholders
- [ ] Add Comparison Table section
- [ ] Move FAQ section before Testimonials
- [ ] Reduce FAQ from 7 to 4 questions
- [ ] Convert Testimonials to carousel
- [ ] Add carousel JavaScript functions
- [ ] Update Setup section with visual walkthrough placeholder
- [ ] Add Mobile Sticky CTA
- [ ] Add all new CSS for new sections
- [ ] Update existing CSS to match new layouts
- [ ] Ensure all colors use existing variables
- [ ] Test calculator functionality
- [ ] Test carousel functionality
- [ ] Test FAQ accordion
- [ ] Test form submission
- [ ] Test mobile responsive layout
- [ ] Verify screenshot placeholders have requirement text

---

## Screenshot Placeholders Required

All placeholders should include detailed requirement text (as shown in mockup):

1. **Hero screenshot** - Dashboard with 5-8 books, pages-per-day, color indicators
2. **Problem illustration** - Overwhelmed reader with books
3. **Calculator screenshot** - Book detail view with calculation
4. **Feature 1 screenshot** - Pages-per-day book list
5. **Feature 2 screenshot** - Widget decision helper
6. **Feature 3 screenshot** - Calendar view
7. **Setup video/GIF** - 15-20s walkthrough

---

## Notes

- This is a substantial refactoring but maintains existing color scheme and working functionality
- All new interactive features are progressive enhancements
- Mobile responsiveness maintained throughout
- Performance should remain good (no heavy libraries added)
- Web3forms integration preserved
- All animations kept lightweight
