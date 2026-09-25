/**
 * ==========================================================================
 * LEM COFFEE HÀ NỘI — MAIN INTERACTION & CONVERSION SCRIPT
 * Form validation • Tracking dataLayer hooks • Sticky CTA • Accordion • Lightbox
 * ==========================================================================
 */

// Initialize DataLayer for Google Tag Manager & Google Ads
window.dataLayer = window.dataLayer || [];

/**
 * Track conversion events to dataLayer & optional gtag
 * Placeholders:
 * - Google Tag Manager ID: [GTM-ID]
 * - Google Ads Conversion ID: [GOOGLE-ADS-ID]
 * - Google Ads Conversion Label: [CONVERSION-LABEL]
 */
function trackEvent(eventName, eventParams = {}) {
  const payload = {
    event: eventName,
    event_timestamp: new Date().toISOString(),
    ...eventParams
  };

  window.dataLayer.push(payload);

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  // Developer feedback in console
  console.log(`🎯 [Google Ads / GA4 Event]: ${eventName}`, payload);
}

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DYNAMIC DATE PICKER MINIMUM VALUE (TODAY)
  // --------------------------------------------------------------------------
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }

  // --------------------------------------------------------------------------
  // 2. LEAD FORM INTERACTION & CONVERSION LOGIC
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('booking-form');
  const leadCard = document.getElementById('lead-card');
  const successCard = document.getElementById('booking-success-card');
  const nameInput = document.getElementById('fullname');
  const phoneInput = document.getElementById('phone');
  const timeSelect = document.getElementById('booking-time');
  const noteInput = document.getElementById('booking-note');
  const consentCheckbox = document.getElementById('consent-check');

  let formStarted = false;

  // Track 'form_start' on first interaction
  if (bookingForm) {
    const formFields = bookingForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      field.addEventListener('focus', () => {
        if (!formStarted) {
          formStarted = true;
          trackEvent('form_start', {
            form_name: 'lead_reservation_form',
            form_id: 'booking-form'
          });
        }
      }, { once: false });
    });
  }

  // Vietnamese Phone Validation Regex
  // Matches: 03x, 05x, 07x, 08x, 09x followed by 7 digits or +84 format
  const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

  function validateField(input, isValid, errorMsg) {
    const group = input.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error-msg') : null;

    if (!isValid) {
      input.classList.add('is-invalid');
      if (group) group.classList.add('has-error');
      if (errorEl && errorMsg) errorEl.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (group) group.classList.remove('has-error');
      return true;
    }
  }

  // Real-time error removal on input
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        validateField(nameInput, true);
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const sanitizedPhone = phoneInput.value.trim().replace(/[\s.-]/g, '');
      if (vnPhoneRegex.test(sanitizedPhone)) {
        validateField(phoneInput, true);
      }
    });
  }

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;

      // 1. Validate Fullname
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        validateField(nameInput, false, 'Vui lòng nhập họ và tên của bạn (tối thiểu 2 ký tự)');
        isFormValid = false;
      } else {
        validateField(nameInput, true);
      }

      // 2. Validate Vietnamese Phone Number
      const phoneVal = phoneInput ? phoneInput.value.trim().replace(/[\s.-]/g, '') : '';
      if (!phoneVal) {
        validateField(phoneInput, false, 'Vui lòng nhập số điện thoại');
        isFormValid = false;
      } else if (!vnPhoneRegex.test(phoneVal)) {
        validateField(phoneInput, false, 'Số điện thoại không hợp lệ (VD: 0912345678)');
        isFormValid = false;
      } else {
        validateField(phoneInput, true);
      }

      // 3. Validate Privacy Consent
      if (consentCheckbox && !consentCheckbox.checked) {
        alert('Vui lòng đồng ý để quán có thể liên hệ xác nhận bàn cho bạn nhé!');
        consentCheckbox.focus();
        isFormValid = false;
      }

      if (!isFormValid) {
        // Focus on first invalid input
        const firstInvalid = bookingForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Gather form data
      const selectedGuests = bookingForm.querySelector('input[name="guests"]:checked');
      const guestsVal = selectedGuests ? selectedGuests.value : '2 người';
      const dateVal = dateInput ? dateInput.value : '';
      const timeVal = timeSelect ? timeSelect.value : 'Khung giờ linh hoạt';
      const noteVal = noteInput ? noteInput.value.trim() : '';

      const submitBtn = bookingForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.innerHTML;

      // Show loading UI on button
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Đang gửi thông tin... 🐱</span>`;

      // Simulate instantaneous processing & backup saving
      setTimeout(() => {
        // Track 'form_submit' conversion event with details
        trackEvent('form_submit', {
          form_name: 'lead_reservation_form',
          guest_count: guestsVal,
          booking_date: dateVal,
          booking_time: timeVal,
          has_note: Boolean(noteVal),
          google_ads_conversion_id: '[GOOGLE-ADS-ID]',
          google_ads_conversion_label: '[CONVERSION-LABEL]'
        });

        // Populate success card recap
        const recapName = document.getElementById('recap-name');
        const recapPhone = document.getElementById('recap-phone');
        const recapGuests = document.getElementById('recap-guests');
        const recapTime = document.getElementById('recap-time');

        if (recapName) recapName.textContent = nameVal;
        if (recapPhone) recapPhone.textContent = phoneVal;
        if (recapGuests) recapGuests.textContent = guestsVal;
        if (recapTime) recapTime.textContent = `${dateVal} • ${timeVal}`;

        // Swap cards
        bookingForm.style.display = 'none';
        if (successCard) {
          successCard.classList.add('active');
        }

        // Scroll into card view smoothly
        leadCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 450);
    });
  }

  // Reset booking form button from success state
  const resetBtn = document.getElementById('btn-reset-booking');
  if (resetBtn && bookingForm && successCard) {
    resetBtn.addEventListener('click', () => {
      bookingForm.reset();
      formStarted = false;
      successCard.classList.remove('active');
      bookingForm.style.display = 'flex';
      nameInput.focus();
    });
  }

  // --------------------------------------------------------------------------
  // 3. CTA BUTTONS CLICK TRACKING & SMOOTH SCROLLING
  // --------------------------------------------------------------------------
  const bookingCTAs = document.querySelectorAll('[data-cta="book"]');
  bookingCTAs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('href') || '#dat-cho';
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          if (nameInput) {
            setTimeout(() => nameInput.focus(), 400);
          }
        }
      }

      trackEvent('click_booking_cta', {
        cta_text: btn.innerText.trim(),
        cta_location: btn.dataset.location || 'page_body'
      });
    });
  });

  // Track phone call clicks
  const callButtons = document.querySelectorAll('a[href^="tel:"]');
  callButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('click_call', {
        phone_number: btn.getAttribute('href').replace('tel:', ''),
        location: btn.dataset.location || 'unknown'
      });
    });
  });

  // Track direction clicks
  const directionButtons = document.querySelectorAll('[data-cta="directions"]');
  directionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('click_directions', {
        location: 'location_section'
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. STICKY MOBILE CTA BAR VISIBILITY CONTROLLER
  // --------------------------------------------------------------------------
  const stickyMobileBar = document.getElementById('sticky-mobile-bar');
  if (stickyMobileBar && leadCard) {
    // Hide sticky bar when user is looking directly at the lead form
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyMobileBar.classList.add('hidden');
        } else {
          stickyMobileBar.classList.remove('hidden');
        }
      });
    }, {
      root: null,
      threshold: 0.15
    });

    observer.observe(leadCard);
  }

  // --------------------------------------------------------------------------
  // 5. FAQ ACCORDION INTERACTIVITY
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Close other open items for cleaner viewing
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question-btn');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle clicked item
        if (isExpanded) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    }
  });

  // Open first FAQ question by default for great UX
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstBtn = firstItem.querySelector('.faq-question-btn');
    const firstAns = firstItem.querySelector('.faq-answer');
    if (firstBtn && firstAns) {
      firstItem.classList.add('active');
      firstBtn.setAttribute('aria-expanded', 'true');
      firstAns.style.maxHeight = `${firstAns.scrollHeight}px`;
    }
  }

  // --------------------------------------------------------------------------
  // 6. GALLERY LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryItems.length > 0 && lightboxModal && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Lem Coffee Hải Phòng';
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. PRIVACY POLICY MODAL
  // --------------------------------------------------------------------------
  const privacyModal = document.getElementById('privacy-modal');
  const privacyLinks = document.querySelectorAll('[data-action="privacy-policy"]');
  const privacyCloseBtn = document.getElementById('privacy-close-btn');

  if (privacyModal && privacyLinks.length > 0) {
    privacyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closePrivacy = () => {
      privacyModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (privacyCloseBtn) {
      privacyCloseBtn.addEventListener('click', closePrivacy);
    }

    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) {
        closePrivacy();
      }
    });
  }
});
