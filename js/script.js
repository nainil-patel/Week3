console.log("Script loaded");

const landing = document.getElementById('landing');
const dot = document.getElementById('landingDot');
const rewatch = document.getElementById('landingRewatch');
const tagline = document.getElementById('landingTagline');
const content = document.getElementById('content');

const vh = window.innerHeight;

// --- Phase 1 thresholds (in pixels) ---
const T1 = vh * 1.0;  // Dot expansion: 0 to T1
const T2 = vh * 1.5;  // "Rewatch" slides in: T1 to T2
const T3 = vh * 1.8;  // Tagline appears: T2 to T3

// --- Phase 2: Horizontal Transition ---
const H_range = vh * 2.0;  // Horizontal transition: T3 to T4
const T4 = T3 + H_range;

// --- Phase 3: Content Reveal ---
const C_range = vh * 1.0;  // Content reveal: T4 to T5
const T5 = T4 + C_range;

// Calculate maximum scale for the dot (initial diameter = 20px)
const diag = Math.sqrt(window.innerWidth ** 2 + vh ** 2);
const requiredScale = diag / 20;
const maxScale = requiredScale * 1.05;  // extra 5%

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Change body background: white in Phase 1, then black.
  if (scrollY <= T3) {
    document.body.style.backgroundColor = 'white';
  } else {
    document.body.style.backgroundColor = 'black';
  }
  
  // --- PHASE 1: Landing Animation (scrollY ≤ T3) ---
  if (scrollY <= T3) {
    // Ensure landing container is full-screen and white.
    landing.style.display = 'block';
    landing.style.width = '100%';
    landing.style.left = '0';
    landing.style.backgroundColor = 'white';
    // Hide main content.
    content.style.opacity = 0;
    content.style.display = 'none';
    
    if (scrollY <= T1) {
      // Stage 1: Dot expansion.
      const progress = scrollY / T1;  // 0 to 1
      const currentScale = 1 + (maxScale - 1) * progress;
      dot.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
      rewatch.style.opacity = 0;
      tagline.style.opacity = 0;
    } else if (scrollY > T1 && scrollY <= T2) {
      // Stage 2: "Rewatch" slides in.
      dot.style.transform = `translate(-50%, -50%) scale(${maxScale})`;
      const progress = (scrollY - T1) / (T2 - T1);
      const startTop = -100;  // off-screen above
      const endTop = vh / 2;    // center of viewport
      const newTop = startTop + (endTop - startTop) * progress;
      rewatch.style.top = newTop + "px";
      rewatch.style.opacity = progress;
      tagline.style.opacity = 0;
    } else if (scrollY > T2 && scrollY <= T3) {
      // Stage 3: Tagline appears.
      dot.style.transform = `translate(-50%, -50%) scale(${maxScale})`;
      rewatch.style.top = (vh / 2) + "px";
      rewatch.style.opacity = 1;
      const progress = (scrollY - T2) / (T3 - T2);
      const startTagTop = (vh / 2) + 50;
      const endTagTop = (vh / 2) + 100;
      const newTagTop = startTagTop + (endTagTop - startTagTop) * progress;
      tagline.style.top = newTagTop + "px";
      tagline.style.opacity = progress;
    }
  }
  // --- PHASE 2: Horizontal Transition (T3 < scrollY ≤ T4) ---
  else if (scrollY > T3 && scrollY <= T4) {
    // Keep landing container visible; set its background to black.
    landing.style.display = 'block';
    landing.style.backgroundColor = 'black';
    // Keep main content hidden.
    content.style.display = 'none';
    
    const progressH = (scrollY - T3) / H_range;  // 0 to 1
    // Animate "Rewatch" horizontally from center (50% left) to left-half center (25% left)
    const newLeft = 50 - (25 * progressH);
    rewatch.style.left = newLeft + '%';
    tagline.style.left = newLeft + '%';
    // Also scale down "Rewatch" from scale 1 to 0.8.
    const newScale = 1 - 0.2 * progressH;
    rewatch.style.transform = `translate(-50%, -50%) scale(${newScale})`;
    rewatch.style.top = (vh / 2) + "px";
    rewatch.style.opacity = 1;
    // Fade out tagline gradually.
    tagline.style.opacity = 1 - progressH;
  }
  // --- PHASE 3: Content Reveal (T4 < scrollY ≤ T5) ---
  else if (scrollY > T4 && scrollY <= T5) {
    // Adjust landing container to occupy left half.
    landing.style.width = '50%';
    landing.style.left = '0';
    landing.style.backgroundColor = 'black';
    landing.style.zIndex = '100';
    
    // "Rewatch" remains fixed on the left half.
    rewatch.style.left = '25%';
    rewatch.style.transform = 'translate(-50%, -50%) scale(0.8)';
    rewatch.style.top = (vh / 2) + "px";
    rewatch.style.opacity = 1;
    tagline.style.opacity = 0;
    
    // Reveal the content container on the right half.
    // In this phase, we leave content as position: relative (from CSS) so that it flows normally.
    content.style.display = 'block';
    const progressC = (scrollY - T4) / C_range;  // 0 to 1
    content.style.transform = `translateY(${50 * (1 - progressC)}px)`;
    content.style.opacity = progressC;
  }
  // --- AFTER T5: Final State ---
  else {
    landing.style.width = '50%';
    landing.style.left = '0';
    landing.style.backgroundColor = 'black';
    landing.style.zIndex = '100';
    rewatch.style.left = '25%';
    rewatch.style.transform = 'translate(-50%, -50%) scale(0.8)';
    rewatch.style.top = (vh / 2) + "px";
    rewatch.style.opacity = 1;
    tagline.style.opacity = 0;
    
    // Content fully revealed and scrolling naturally on the right half.
    content.style.transform = 'translateY(0px)';
    content.style.opacity = 1;
  }
});
