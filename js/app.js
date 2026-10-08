/**
 * Tooth Fairy Dental Care - Dr. Najumudeen (Velachery, Chennai)
 * Interactive Application Engine
 * Impeccable Logic, UX Enhancements, and Conversions
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initThemeEngine();
  initClinicStatusTracker();
  initBeforeAfterSlider();
  initTreatmentsFilter();
  initSymptomChecker();
  initCostEstimator();
  initBookingEngine();
  initReviewsFilter();
  initFaqAccordion();
  initMobileNav();
  initScrollSpy();
});

let lenis = null;

/* ==========================================================================
   0. Ultra-Smooth Inertia & Momentum Scroll Engine (Atelier / Bryant Standard)
   ========================================================================== */
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Intercept all internal anchor links for buttery-smooth offset gliding
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();

        // Close mobile nav menu if open
        const navMenu = document.getElementById('navMenu');
        const toggleBtn = document.getElementById('mobileNavToggle');
        if (navMenu && navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
          if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.innerHTML = '<svg class="clinical-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
          }
        }

        const offset = -85;
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: offset, duration: 1.25 });
        } else {
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }

        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

/* ==========================================================================
   1. Theme Switcher Engine (Light / Dark / Dental Comfort)
   ========================================================================== */
function initThemeEngine() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const themes = ['light', 'dark', 'calm'];
  const savedTheme = localStorage.getItem('tf_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextIndex = (themes.indexOf(current) + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('tf_theme', nextTheme);
    updateThemeIcon(nextTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  if (theme === 'dark') {
    themeBtn.innerHTML = '<svg class="clinical-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeBtn.setAttribute('title', 'Switch to Dental Comfort Mode');
  } else if (theme === 'calm') {
    themeBtn.innerHTML = '<svg class="clinical-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>';
    themeBtn.setAttribute('title', 'Switch to Modern Light Mode');
  } else {
    themeBtn.innerHTML = '<svg class="clinical-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    themeBtn.setAttribute('title', 'Switch to Midnight Dark Mode');
  }
}

/* ==========================================================================
   2. Real-Time Clinic Open/Close Status Indicator
   Hours: Mon-Sat 11:00 AM - 3:00 PM & 6:00 PM - 9:00 PM | Sun: Emergencies
   ========================================================================== */
function initClinicStatusTracker() {
  const statusBadge = document.getElementById('clinicLiveStatus');
  const statusTime = document.getElementById('clinicStatusTime');
  if (!statusBadge || !statusTime) return;

  function updateStatus() {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));

    const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentMinuteOfDay = (hours * 60) + minutes;

    const isSunday = (day === 0);

    // Shifts in minutes:
    // Morning: 11:00 AM (660 min) to 3:00 PM (900 min)
    // Evening: 6:00 PM (1080 min) to 9:00 PM (1260 min)
    const morningStart = 11 * 60;
    const morningEnd = 15 * 60;
    const eveningStart = 18 * 60;
    const eveningEnd = 21 * 60;

    let isOpen = false;
    let message = "";

    if (isSunday) {
      statusBadge.innerHTML = '<span class="status-dot" style="background-color: #f59e0b; box-shadow: 0 0 8px #f59e0b;"></span> Sunday: Prior Appointments Only';
      statusTime.textContent = 'Regular timings resume Monday 11:00 AM';
      return;
    }

    if (currentMinuteOfDay >= morningStart && currentMinuteOfDay < morningEnd) {
      isOpen = true;
      message = "Open Now (Morning Shift till 3:00 PM)";
    } else if (currentMinuteOfDay >= eveningStart && currentMinuteOfDay < eveningEnd) {
      isOpen = true;
      message = "Open Now (Evening Shift till 9:00 PM)";
    } else if (currentMinuteOfDay < morningStart) {
      isOpen = false;
      message = "Opens Today at 11:00 AM";
    } else if (currentMinuteOfDay >= morningEnd && currentMinuteOfDay < eveningStart) {
      isOpen = false;
      message = "Afternoon Break • Reopens 6:00 PM";
    } else {
      isOpen = false;
      message = "Closed for the day • Opens tomorrow 11:00 AM";
    }

    if (isOpen) {
      statusBadge.innerHTML = '<span class="status-dot"></span> Clinic Open Now in Velachery';
    } else {
      statusBadge.innerHTML = '<span class="status-dot" style="background-color: #f59e0b; box-shadow: 0 0 8px #f59e0b;"></span> Clinic Currently Closed';
    }
    statusTime.textContent = message;
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   3. Interactive Before & After Smile Transformation Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderFrame');
  const afterWrap = document.getElementById('baAfterWrap');
  const handle = document.getElementById('baHandle');
  if (!container || !afterWrap || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;

    if (position < 0) position = 0;
    if (position > 100) position = 100;

    afterWrap.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
    afterWrap.style.webkitClipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
    handle.style.left = `${position}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });
}

/* ==========================================================================
   3b. Specialized Treatments Category Filter Engine
   ========================================================================== */
function initTreatmentsFilter() {
  const filterBtns = document.querySelectorAll('.treatment-filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.dataset.treatment;

      serviceCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Dental Symptom Checker / Triage Engine
   ========================================================================== */
const SYMPTOMS_DATA = {
  toothache: {
    title: "Deep Throbbing Toothache / Decay",
    urgency: "urgent",
    urgencyText: "Needs Attention in 24-48 Hours",
    treatment: "Rotary Root Canal Treatment (Painless RCT) & Zirconia Crown",
    explanation: "Continuous sharp or throbbing pain typically indicates bacterial decay has reached the dental pulp and nerve canal. Dr. Najumudeen uses advanced rotary endodontics to eliminate infection in a single or 2-sitting painless visit, followed by crown protection.",
    procedureCode: "rct"
  },
  gums: {
    title: "Bleeding, Swollen or Receding Gums",
    urgency: "moderate",
    urgencyText: "Early Periodontal Evaluation Recommended",
    treatment: "Ultrasonic Deep Scaling & Laser Periodontal Therapy",
    explanation: "Bleeding when brushing and gum tenderness are hallmark signs of gingivitis or periodontitis. As an MDS Periodontist, Dr. Najumudeen specializes in gentle subgingival scaling, laser pocket disinfection, and gum regeneration.",
    procedureCode: "scaling"
  },
  missing: {
    title: "Missing Tooth or Broken Enamel",
    urgency: "routine",
    urgencyText: "Prevent Bone Loss & Bite Drift",
    treatment: "Permanent Titanium Dental Implant & Bio-Crown",
    explanation: "Leaving a gap can cause adjacent teeth to shift and cause jawbone recession. An immediate or delayed dental implant acts as a permanent artificial titanium root topped with a custom shade-matched ceramic tooth.",
    procedureCode: "implants"
  },
  stained: {
    title: "Discolored, Yellow or Stained Teeth",
    urgency: "cosmetic",
    urgencyText: "Elective Smile Enhancement",
    treatment: "Advanced In-Office Laser Whitening & Porcelain Veneers",
    explanation: "Surface stains from coffee, tea, or natural aging can be safely lifted by up to 5-8 shades in a 45-minute clinic whitening session using enamel-safe peroxide gels and cold LED light.",
    procedureCode: "whitening"
  },
  wisdom: {
    title: "Wisdom Tooth Pressure & Swelling",
    urgency: "urgent",
    urgencyText: "Evaluation Before Infection Spreads",
    treatment: "Surgical Wisdom Impaction Extraction",
    explanation: "Partially erupted or horizontally impacted third molars cause pericoronitis and damage neighboring molars. Dr. Najumudeen performs atraumatic, painless extractions with modern local anesthetics.",
    procedureCode: "wisdom"
  },
  align: {
    title: "Crooked Teeth, Gaps or Crowding",
    urgency: "routine",
    urgencyText: "Orthodontic Smile Assessment",
    treatment: "Clear Aligners (Invisible Braces) & Gap Closure",
    explanation: "Fix alignment, spacing, or overlapping teeth comfortably without metallic brackets. Custom transparent aligners gently straighten teeth with minimal lifestyle disruption.",
    procedureCode: "aligners"
  }
};

function initSymptomChecker() {
  const cards = document.querySelectorAll('.symptom-choice-card');
  const resultPanel = document.getElementById('symptomResultPanel');
  if (!cards.length || !resultPanel) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const symptomKey = card.getAttribute('data-symptom');
      const data = SYMPTOMS_DATA[symptomKey];
      if (!data) return;

      let urgencyClass = 'urgency-routine';
      if (data.urgency === 'urgent') urgencyClass = 'urgency-high';
      else if (data.urgency === 'moderate') urgencyClass = 'urgency-medium';

      resultPanel.innerHTML = `
        <div class="symptom-result-header">
          <span class="symptom-urgency-pill ${urgencyClass}">${data.urgencyText}</span>
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Recommended by Dr. Najumudeen (MDS)</span>
        </div>
        <h3 class="symptom-treatment-title">${data.treatment}</h3>
        <p class="symptom-treatment-explanation">${data.explanation}</p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="quickSelectTreatment('${data.procedureCode}')">
            <span>Book Appointment for This Treatment</span>
            <svg class="clinical-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <a href="https://wa.me/919994373918?text=Hello%20Dr.%20Najumudeen,%20I%20checked%20my%20symptoms%20for%20${encodeURIComponent(data.title)}%20and%20would%20like%20a%20consultation." target="_blank" class="btn btn-secondary">
            <svg class="clinical-icon-xs" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      `;
    });
  });
}

window.quickSelectTreatment = function(procedureCode) {
  const procedureSelect = document.getElementById('bookingProcedure');
  const bookingSection = document.getElementById('book-appointment');
  if (procedureSelect) {
    procedureSelect.value = procedureCode;
  }
  if (bookingSection) {
    if (lenis) {
      lenis.scrollTo(bookingSection, { offset: -85, duration: 1.25 });
    } else {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

/* ==========================================================================
   5. Interactive Cost & Treatment Estimator
   ========================================================================== */
function initCostEstimator() {
  const checkboxes = document.querySelectorAll('.estimator-checkbox');
  const totalDisplay = document.getElementById('estimateTotal');
  const emiDisplay = document.getElementById('estimateEmi');
  const selectedCountDisplay = document.getElementById('selectedItemsCount');
  const transferToBookingBtn = document.getElementById('estimateBookBtn');

  if (!checkboxes.length || !totalDisplay) return;

  function calculateEstimate() {
    let minTotal = 0;
    let maxTotal = 0;
    let selectedCount = 0;

    checkboxes.forEach(cb => {
      const label = cb.closest('.treatment-checkbox-label');
      if (cb.checked) {
        label.classList.add('checked');
        minTotal += parseInt(cb.dataset.min || '0', 10);
        maxTotal += parseInt(cb.dataset.max || '0', 10);
        selectedCount++;
      } else {
        label.classList.remove('checked');
      }
    });

    if (selectedCountDisplay) {
      selectedCountDisplay.textContent = `${selectedCount} procedure${selectedCount === 1 ? '' : 's'} selected`;
    }

    if (minTotal === maxTotal) {
      totalDisplay.textContent = `₹${minTotal.toLocaleString('en-IN')}`;
    } else {
      totalDisplay.textContent = `₹${minTotal.toLocaleString('en-IN')} - ₹${maxTotal.toLocaleString('en-IN')}`;
    }

    // Sync mobile floating recap strip
    const mobileRecapCount = document.getElementById('mobileRecapCount');
    const mobileRecapTotal = document.getElementById('mobileRecapTotal');
    if (mobileRecapCount) {
      mobileRecapCount.textContent = `${selectedCount} procedure${selectedCount === 1 ? '' : 's'} selected`;
    }
    if (mobileRecapTotal) {
      mobileRecapTotal.textContent = totalDisplay.textContent;
    }

    // Rough 6-month EMI ballpark for higher treatments
    if (minTotal > 10000 && emiDisplay) {
      const emiApprox = Math.round(minTotal / 6);
      emiDisplay.textContent = `Estimated 0% Interest EMI: ~₹${emiApprox.toLocaleString('en-IN')}/mo (6 months)`;
      emiDisplay.style.display = 'block';
    } else if (emiDisplay) {
      emiDisplay.style.display = 'none';
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  if (transferToBookingBtn) {
    transferToBookingBtn.addEventListener('click', () => {
      const bookingSection = document.getElementById('book-appointment');
      if (bookingSection) {
        if (lenis) {
          lenis.scrollTo(bookingSection, { offset: -85, duration: 1.25 });
        } else {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  calculateEstimate();
}

/* ==========================================================================
   6. Appointment Booking Engine & WhatsApp Sync
   ========================================================================== */
function initBookingEngine() {
  const form = document.getElementById('appointmentForm');
  const dateInput = document.getElementById('bookingDate');
  const slotChips = document.querySelectorAll('.slot-chip');
  const slotHiddenInput = document.getElementById('bookingSlot');
  const modal = document.getElementById('bookingConfirmationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const whatsappSendBtn = document.getElementById('whatsappConfirmBtn');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Time Slot Selection
  slotChips.forEach(chip => {
    chip.addEventListener('click', () => {
      slotChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      if (slotHiddenInput) {
        slotHiddenInput.value = chip.dataset.slot;
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const procedure = document.getElementById('bookingProcedure').value;
      const procedureText = document.getElementById('bookingProcedure').options[document.getElementById('bookingProcedure').selectedIndex].text;
      const date = document.getElementById('bookingDate').value;
      const slot = slotHiddenInput ? slotHiddenInput.value : '11:00 AM';
      const notes = document.getElementById('bookingNotes').value.trim();

      if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
      }

      // Generate booking reference
      const bookingId = 'TF-' + Math.floor(100000 + Math.random() * 900000);

      // Populate Modal
      document.getElementById('modalPatientName').textContent = name;
      document.getElementById('modalProcedure').textContent = procedureText;
      document.getElementById('modalDateTime').textContent = `${date} at ${slot}`;
      document.getElementById('modalBookingId').textContent = bookingId;

      // Prepare WhatsApp link
      const waMessage = `Hello Dr. Najumudeen (Tooth Fairy Dental Care),\n\nI would like to confirm my dental appointment:\n- Booking ID: ${bookingId}\n- Name: ${name}\n- Phone: ${phone}\n- Treatment: ${procedureText}\n- Date & Slot: ${date} at ${slot}${notes ? '\n- Notes: ' + notes : ''}\n\nPlease confirm availability. Thank you!`;
      
      if (whatsappSendBtn) {
        whatsappSendBtn.href = `https://wa.me/919994373918?text=${encodeURIComponent(waMessage)}`;
      }

      // Show Modal
      if (modal) {
        modal.classList.add('active');
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (modalDoneBtn) {
    modalDoneBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  // Close modal on escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   7. Reviews & Ratings Category Filter
   ========================================================================== */
function initReviewsFilter() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!filterBtns.length || !reviewCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      reviewCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Searchable FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-trigger').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-content').textContent.toLowerCase();

        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   9. Mobile Menu & Smooth Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const hamburgerSvg = '<svg class="clinical-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const closeSvg = '<svg class="clinical-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const isExpanded = navMenu.classList.contains('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    toggleBtn.innerHTML = isExpanded ? closeSvg : hamburgerSvg;
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      toggleBtn.innerHTML = hamburgerSvg;
    });
  });

  const drawerBtns = document.querySelectorAll('.mobile-drawer-btn');
  drawerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      toggleBtn.innerHTML = hamburgerSvg;
    });
  });
}

/* ==========================================================================
   10. ScrollSpy & Sticky Header Styling
   ========================================================================== */
function initScrollSpy() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateSpy() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    let currentSectionId = '';
    const scrollPos = scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateSpy, { passive: true });
  if (lenis) {
    lenis.on('scroll', updateSpy);
  }
}
