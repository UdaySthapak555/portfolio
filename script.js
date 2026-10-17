const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuToggle = $("#menu-toggle");
const nav = $("#main-nav");
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

// Scroll reveal: elements remain readable if IntersectionObserver is unavailable.
const revealEls = $$(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else revealEls.forEach(el => el.classList.add("visible"));

// Scroll progress and active navigation.
const progressBar = $("#progress-bar");
const navLinks = $$(".nav-link");
const sections = navLinks.map(link => $(link.getAttribute("href"))).filter(Boolean);
let scrollQueued = false;
function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${scrollable > 0 ? window.scrollY / scrollable * 100 : 0}%`;
    let current = sections[0]?.id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 160) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
    scrollQueued = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Gentle pointer-driven sculpture movement on larger screens.
const heroVisual = $("#hero-visual");
const prism = $(".prism");
if (heroVisual && prism && matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVisual.addEventListener("pointermove", event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    prism.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 12}deg) rotate(-12deg)`;
  });
  heroVisual.addEventListener("pointerleave", () => { prism.style.transform = "rotate(-12deg)"; });
}

// Project detail dialog. InterviewAI intentionally has no repository link until it is published.
const projectData = {
  medai: {
    kicker: "01 / AI + HEALTH TECH",
    title: "MEDAI",
    description: "A full-stack educational application built with React and FastAPI. It extracts text from supported medical reports, identifies selected lab markers, and presents rule-based screening with accessible explanations. It is informational and not a medical diagnosis.",
    tags: ["Python", "FastAPI", "React", "scikit-learn", "PDF / OCR"],
    status: "Public repository available.",
    url: "https://github.com/UdaySthapak555/MEDAI",
    linkText: "View MEDAI repository"
  },
  spamshield: {
    kicker: "03 / NLP + CYBER SAFETY",
    title: "SpamShield AI",
    description: "An SMS spam detection application using text preprocessing and TF-IDF features. It compares Multinomial Naive Bayes, Logistic Regression, and Linear SVM, with Linear SVM selected based on evaluation including a 93.66% F1 score. A Streamlit dashboard presents model analytics and confusion-matrix results.",
    tags: ["Python", "NLP", "TF-IDF", "Linear SVM", "Streamlit"],
    status: "Public repository available.",
    url: "https://github.com/UdaySthapak555/spam-sms-detection",
    linkText: "View SpamShield repository"
  },
  cinesense: {
    kicker: "04 / MACHINE LEARNING + NLP",
    title: "CineSense AI",
    description: "A Flask web application that predicts movie genres from plot summaries using NLP preprocessing, TF-IDF vectorization, and Logistic Regression trained on the IMDb Genre Classification Dataset. It returns genre predictions, confidence scores, and top-three results.",
    tags: ["Python", "Flask", "scikit-learn", "TF-IDF", "NLP"],
    status: "Public repository available.",
    url: "https://github.com/UdaySthapak555/CineSense-AI",
    linkText: "View CineSense repository"
  },
  fraud: {
    kicker: "05 / DATA SCIENCE + FINTECH",
    title: "Credit Card Fraud Detection",
    description: "A machine-learning project that compares Logistic Regression, Decision Tree, and Random Forest for transaction fraud classification. The repository describes a Streamlit application and selects Decision Tree based on recall-focused evaluation, with ROC-AUC of 95.43%.",
    tags: ["Python", "scikit-learn", "Pandas", "Decision Tree", "Streamlit"],
    status: "Public repository available.",
    url: "https://github.com/UdaySthapak555/credit-card-fraud-detection-ml",
    linkText: "View fraud detection repository"
  },
  interviewai: {
    kicker: "02 / GENERATIVE AI",
    title: "InterviewAI",
    description: "An AI-powered mock interview platform built with Streamlit and the Google Gemini API. It parses a PDF resume, generates personalized interview questions, evaluates answers, and produces feedback. A few features are still in progress; the project will be linked here once it is published.",
    tags: ["Python", "Streamlit", "Google Gemini API", "Resume parsing"],
    status: "Nearly complete · Repository not public yet.",
    url: null,
    linkText: ""
  }
};
const dialog = $("#project-dialog");
const dialogTitle = $("#dialog-title");
const dialogKicker = $("#dialog-kicker");
const dialogDescription = $("#dialog-description");
const dialogTags = $("#dialog-tags");
const dialogStatus = $("#dialog-status");
const dialogLink = $("#dialog-link");

function openProject(key) {
  const item = projectData[key];
  if (!item || !dialog) return;
  dialogKicker.textContent = item.kicker;
  dialogTitle.textContent = item.title;
  dialogDescription.textContent = item.description;
  dialogStatus.textContent = item.status;
  dialogTags.replaceChildren(...item.tags.map(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    return span;
  }));
  dialogLink.hidden = !item.url;
  if (item.url) {
    dialogLink.href = item.url;
    dialogLink.innerHTML = `${item.linkText} <span>↗</span>`;
  }
  if (typeof dialog.showModal === "function") dialog.showModal();
}
$$("[data-project]").forEach(card => {
  card.addEventListener("click", event => {
    if (event.target.closest("a")) return;
    openProject(card.dataset.project);
  });
  card.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target === card) {
      event.preventDefault();
      openProject(card.dataset.project);
    }
  });
});
$$("[data-open-project]").forEach(button => button.addEventListener("click", event => {
  event.stopPropagation();
  openProject(button.dataset.openProject);
}));
$("#dialog-close")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener("close", () => {
  // Restore focus to the project card when possible.
  const focused = document.activeElement;
  if (focused && focused.matches("[data-open-project]")) focused.blur();
});

$("#year").textContent = new Date().getFullYear();


// Global cursor aura follows the pointer with a smooth spring-like lag.
const cursorAura = $("#cursor-aura");
const finePointer = matchMedia("(pointer:fine)").matches;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (cursorAura && finePointer && !reduceMotion) {
  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
  let currentX = targetX, currentY = targetY;
  let cursorFrame = 0;
  document.body.classList.add("cursor-ready");
  window.addEventListener("pointermove", event => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!cursorFrame) cursorFrame = requestAnimationFrame(animateCursor);
  }, { passive: true });
  function animateCursor() {
    currentX += (targetX - currentX) * 0.19;
    currentY += (targetY - currentY) * 0.19;
    cursorAura.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    if (Math.abs(targetX-currentX) > .3 || Math.abs(targetY-currentY) > .3) {
      cursorFrame = requestAnimationFrame(animateCursor);
    } else cursorFrame = 0;
  }
  document.addEventListener("pointerover", event => {
    if (event.target.closest("a, button, [role='button'], [data-tilt]")) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("pointerout", event => {
    if (event.target.closest("a, button, [role='button'], [data-tilt]")) document.body.classList.remove("cursor-hover");
  });
  document.addEventListener("pointerdown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("pointerup", () => document.body.classList.remove("cursor-click"));
}

// Fine pointer interaction: tilt cards and portrait gently toward the pointer.
if (finePointer && !reduceMotion) {
  $$("[data-tilt]").forEach(element => {
    element.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const max = element.classList.contains("portrait-frame") ? 7 : 3.5;
      const rotateY = (px - .5) * max * 2;
      const rotateX = (.5 - py) * max * 1.5;
      element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });

  // Floating hero chips respond to pointer position without moving the content itself.
  const visual = $("#hero-visual");
  if (visual) {
    visual.addEventListener("pointermove", event => {
      const rect = visual.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - .5;
      const dy = (event.clientY - rect.top) / rect.height - .5;
      visual.querySelectorAll("[data-parallax]").forEach(layer => {
        const depth = Number(layer.dataset.parallax || 1);
        layer.style.translate = `${dx * 18 * depth}px ${dy * 15 * depth}px`;
      });
    });
    visual.addEventListener("pointerleave", () => {
      visual.querySelectorAll("[data-parallax]").forEach(layer => layer.style.translate = "");
    });
  }
}


// Project category filters with accessible selected states and live result count.
const projectCards = $$(".project-card[data-categories]");
const filterButtons = $$(".filter-chip[data-filter]");
const filterResult = $(".filter-result");
filterButtons.forEach(button => button.addEventListener("click", () => {
  const category = button.dataset.filter;
  let visible = 0;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  projectCards.forEach(card => {
    const categories = (card.dataset.categories || "").split(/\s+/);
    const show = category === "all" || categories.includes(category);
    card.hidden = !show;
    if (show) {
      visible++;
      card.classList.remove("visible");
      requestAnimationFrame(() => card.classList.add("visible"));
    }
  });
  if (filterResult) filterResult.innerHTML = `Showing <strong>${visible}</strong> project${visible === 1 ? "" : "s"} <span>— ${category === "all" ? "all categories" : button.textContent.trim()} selected</span>`;
}));

// Card spotlight tracks the pointer inside each project preview.
$$(".project-card").forEach(card => {
  const visual = $(".project-visual", card);
  if (!visual) return;
  visual.addEventListener("pointermove", event => {
    const rect = visual.getBoundingClientRect();
    visual.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    visual.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }, { passive: true });
});

// Gentle magnetic response for primary CTAs on mouse/trackpad.
if (finePointer && !reduceMotion) {
  $$(".hero-cta .btn, .contact-panel .btn, .availability").forEach(button => {
    button.classList.add("magnetic-ready");
    button.addEventListener("pointermove", event => {
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      button.style.transform = `translate(${dx * .09}px, ${dy * .12}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = ""; });
  });
}

// Small click ripple feedback for buttons and category chips.
document.addEventListener("click", event => {
  const target = event.target.closest("button, .btn, .filter-chip");
  if (!target || reduceMotion) return;
  const rect = target.getBoundingClientRect();
  const diameter = Math.max(rect.width, rect.height) * 1.6;
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;
  target.append(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
});

// Back-to-top control appears after the hero and uses smooth scrolling.
const backToTop = $("#back-to-top");
function updateBackToTop() {
  backToTop?.classList.toggle("visible", window.scrollY > window.innerHeight * .65);
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

// Command palette: press Ctrl/⌘ + K, type a section, then press Enter or click.
const commandOverlay = $("#command-overlay");
const commandInput = $("#command-input");
const commandItems = $("#command-items");
let lastCommandFocus = null;
function openCommandPalette() {
  if (!commandOverlay) return;
  lastCommandFocus = document.activeElement;
  commandOverlay.classList.add("open");
  commandOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("command-open");
  commandInput.value = "";
  filterCommandItems("");
  requestAnimationFrame(() => commandInput.focus());
}
function closeCommandPalette() {
  if (!commandOverlay) return;
  commandOverlay.classList.remove("open");
  commandOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("command-open");
  lastCommandFocus?.focus?.();
}
function filterCommandItems(query) {
  if (!commandItems) return;
  const term = query.toLowerCase().trim();
  commandItems.querySelectorAll("button").forEach(item => {
    item.hidden = !item.textContent.toLowerCase().includes(term);
  });
}
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandOverlay?.classList.contains("open") ? closeCommandPalette() : openCommandPalette();
  }
  if (event.key === "Escape" && commandOverlay?.classList.contains("open")) closeCommandPalette();
});
commandInput?.addEventListener("input", () => filterCommandItems(commandInput.value));
commandOverlay?.querySelectorAll("[data-command-close]").forEach(el => el.addEventListener("click", closeCommandPalette));
commandItems?.querySelectorAll("[data-command-target]").forEach(item => {
  item.addEventListener("click", () => {
    const target = $(item.dataset.commandTarget);
    closeCommandPalette();
    target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});
commandInput?.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const first = commandItems?.querySelector("button:not([hidden])");
  first?.click();
});
