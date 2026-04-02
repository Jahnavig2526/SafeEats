const sensitivity = document.getElementById("sensitivity");
const sensitivityValue = document.getElementById("sensitivityValue");
const riskOutput = document.getElementById("riskOutput");
const waitlistForm = document.getElementById("waitlistForm");
const formNote = document.getElementById("formNote");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const suggestedRiskByLevel = {
  1: 12,
  2: 22,
  3: 35,
  4: 48,
  5: 60,
};

function updateRiskUI(level) {
  sensitivityValue.textContent = level;
  riskOutput.textContent = `Suggested max dish risk: ${suggestedRiskByLevel[level]}%`;
}

if (sensitivity) {
  sensitivity.addEventListener("input", (event) => {
    const level = Number(event.target.value);
    updateRiskUI(level);
  });
}

if (waitlistForm) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email");

    if (!email || !email.value.trim()) {
      formNote.textContent = "Please enter a valid email address.";
      return;
    }

    formNote.textContent = `Thanks, ${email.value.trim()} is on the SafeEats waitlist.`;
    waitlistForm.reset();
  });
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => observer.observe(el));
