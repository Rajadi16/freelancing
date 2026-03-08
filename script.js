const CLINIC_INFO = {
  name: "Dr Harsha Dermatology & Skin Laser Clinic",
  doctor: "Dr. Harshavardhan Gowda H",
  title: "MBBS, MD DVL",
  phone: "+918050404377",
  website: "https://site.dgtechsoln.com/dr-harshas-skin-care-cosmetology-centre/",
  map: "https://goo.gl/maps/WtDzHtQndskutmgf6"
};

const THIRD_PARTY_CONFIG = {
  gtmId: "GTM-XXXXXXX",
  embedScript: ""
};

const toastElement = document.getElementById("toast");

function showToast(message) {
  if (!toastElement) {
    return;
  }

  toastElement.textContent = message;
  toastElement.classList.add("show");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2200);
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupSaveContact() {
  const button = document.getElementById("save-contact");
  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${CLINIC_INFO.doctor}`,
      `ORG:${CLINIC_INFO.name}`,
      "TITLE:Dermatologist",
      `NOTE:${CLINIC_INFO.title}`,
      `TEL;TYPE=CELL:${CLINIC_INFO.phone}`,
      `URL:${CLINIC_INFO.website}`,
      "END:VCARD"
    ].join("\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dr-harsha-contact.vcf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Contact file downloaded");
  });
}

function setupShare() {
  const shareButton = document.getElementById("share-profile");
  if (!shareButton) {
    return;
  }

  const shareData = {
    title: CLINIC_INFO.name,
    text: `Consult dermatologist ${CLINIC_INFO.doctor} (${CLINIC_INFO.title})`,
    url: window.location.href
  };

  shareButton.addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      showToast("Page link copied");
    } catch (error) {
      showToast("Unable to share right now");
    }
  });
}

function setupServiceSearch() {
  const input = document.getElementById("service-search");
  const cards = Array.from(document.querySelectorAll("[data-service-card]"));
  const treatmentCards = Array.from(document.querySelectorAll(".treatment-photo-card"));
  const emptyState = document.getElementById("service-empty");
  if (!input || cards.length === 0 || !emptyState) {
    return;
  }

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    let visibleCount = 0;
    let visibleTreatmentCount = 0;

    cards.forEach((card) => {
      const visible = card.textContent.toLowerCase().includes(term);
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    treatmentCards.forEach((card) => {
      const visible = card.textContent.toLowerCase().includes(term);
      card.hidden = !visible;
      if (visible) {
        visibleTreatmentCount += 1;
      }
    });

    emptyState.hidden = visibleCount + visibleTreatmentCount > 0;
  });
}

function setupAppointmentForm() {
  const form = document.getElementById("appointment-form");
  const dateInput = document.getElementById("preferred-date");
  if (!form || !dateInput) {
    return;
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const concern = String(formData.get("concern") || "").trim();

    const message = [
      `Hello Doctor, I would like to book an appointment at ${CLINIC_INFO.name}.`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Preferred Date: ${date}`,
      `Concern: ${concern}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/${CLINIC_INFO.phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    showToast("Opening WhatsApp...");
    form.reset();
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  });
}

function setupFaqAccordion() {
  const questions = Array.from(document.querySelectorAll(".faq-question"));
  if (questions.length === 0) {
    return;
  }

  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      if (!item) {
        return;
      }

      const answer = item.querySelector(".faq-answer");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      questions.forEach((otherButton) => {
        otherButton.setAttribute("aria-expanded", "false");
        const otherAnswer = otherButton.closest(".faq-item")?.querySelector(".faq-answer");
        if (otherAnswer) {
          otherAnswer.hidden = true;
        }
      });

      if (answer && !isExpanded) {
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });
}

function setupReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupDeferredThirdParty() {
  // Delay third-party JS so the initial render remains fast.
  const gtmId = THIRD_PARTY_CONFIG.gtmId;
  if (!gtmId || gtmId === "GTM-XXXXXXX") {
    return;
  }

  let loaded = false;
  const loadGtm = () => {
    if (loaded) {
      return;
    }

    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);

    if (THIRD_PARTY_CONFIG.embedScript) {
      const embed = document.createElement("script");
      embed.defer = true;
      embed.src = THIRD_PARTY_CONFIG.embedScript;
      document.body.appendChild(embed);
    }
  };

  const triggerEvents = ["pointerdown", "touchstart", "keydown", "scroll"];
  triggerEvents.forEach((eventName) => {
    window.addEventListener(eventName, loadGtm, { once: true, passive: true });
  });

  window.setTimeout(loadGtm, 4000);
}

setupMobileNav();
setupSaveContact();
setupShare();
setupServiceSearch();
setupAppointmentForm();
setupFaqAccordion();
setupReveal();
setupDeferredThirdParty();
