const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    if (menuBtnIcon) {
      menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    }
  });
}

if (navLinks) {
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      if (menuBtnIcon) {
        menuBtnIcon.setAttribute("class", "ri-menu-line");
      }
    }
  });
}

// Swiper Initialization
const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
});

/* ================= AUTHENTICATION LOGIC ================= */
const authScreen = document.getElementById("auth-screen");
const mainWebsite = document.getElementById("main-website");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const logoutBtn = document.getElementById("logout-btn");

const googleAuthBtn = document.getElementById("google-auth-btn");
const facebookAuthBtn = document.getElementById("facebook-auth-btn");

const socialNameModal = document.getElementById("social-name-modal");
const socialNameForm = document.getElementById("social-name-form");
const socialUserNameInput = document.getElementById("social-user-name");
const socialModalClose = document.getElementById("social-modal-close");
const socialModalTitle = document.getElementById("social-modal-title");
let currentSocialProvider = "Social";

const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");

const logoutModal = document.getElementById("logout-modal");
const logoutConfirmBtn = document.getElementById("logout-confirm-btn");
const logoutCancelBtn = document.getElementById("logout-cancel-btn");

// Helper Form Switch Functions
function showLoginForm() {
  if (signupForm) signupForm.classList.remove("active");
  if (loginForm) loginForm.classList.add("active");
}

function showSignupForm() {
  if (loginForm) loginForm.classList.remove("active");
  if (signupForm) signupForm.classList.add("active");
}

// Display Registered User's Name
function updateUserNameDisplay() {
  const userNameElement = document.getElementById("user-display-name");
  const user = JSON.parse(localStorage.getItem("logged_in_user"));
  if (userNameElement) {
    userNameElement.textContent = user && user.name ? user.name : "Julian Roger Nebres";
  }
}

// Validate Email (@gmail.com) or Phone (09... 11 digits total)
function isValidIdentifier(identifier) {
  const isGmail = identifier.toLowerCase().endsWith("@gmail.com") && identifier.indexOf("@gmail.com") > 0;
  const isPhone = /^09\d{9}$/.test(identifier);

  return isGmail || isPhone;
}

// Verify access instantly on page load
function verifyAccess() {
  const user = JSON.parse(localStorage.getItem("logged_in_user"));
  if (user) {
    updateUserNameDisplay();
    if (authScreen) authScreen.classList.add("hidden");
    if (mainWebsite) mainWebsite.classList.remove("hidden");
  } else {
    if (authScreen) authScreen.classList.remove("hidden");
    if (mainWebsite) mainWebsite.classList.add("hidden");
  }
}

// Password Typing Visibility
const passwordInputs = document.querySelectorAll("#login-password, #signup-password");

passwordInputs.forEach((input) => {
  let typingTimer;

  input.addEventListener("input", () => {
    const icon = input.parentElement.querySelector(".toggle-password");
    const isManuallyRevealed = icon && icon.classList.contains("ri-eye-off-line");

    if (!isManuallyRevealed) {
      input.type = "text";
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (!icon.classList.contains("ri-eye-off-line")) {
          input.type = "password";
        }
      }, 700);
    }
  });

  input.addEventListener("blur", () => {
    const icon = input.parentElement.querySelector(".toggle-password");
    if (icon && !icon.classList.contains("ri-eye-off-line")) {
      input.type = "password";
    }
  });
});

// Manual Eye Icon Toggle Logic
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetInput = document.getElementById(icon.dataset.target);
    if (!targetInput) return;
    const isPassword = targetInput.type === "password";

    targetInput.type = isPassword ? "text" : "password";
    icon.classList.toggle("ri-eye-line", !isPassword);
    icon.classList.toggle("ri-eye-off-line", isPassword);
  });
});

// Social Login Name Prompt Handlers
function openSocialNamePrompt(provider) {
  currentSocialProvider = provider;
  if (socialModalTitle) {
    socialModalTitle.textContent = `Continue with ${provider}`;
  }
  if (socialUserNameInput) {
    socialUserNameInput.value = "";
  }
  if (socialNameModal) {
    socialNameModal.classList.add("active");
    if (socialUserNameInput) socialUserNameInput.focus();
  }
}

if (googleAuthBtn) {
  googleAuthBtn.addEventListener("click", () => openSocialNamePrompt("Google"));
}

if (facebookAuthBtn) {
  facebookAuthBtn.addEventListener("click", () => openSocialNamePrompt("Facebook"));
}

if (socialModalClose) {
  socialModalClose.addEventListener("click", () => {
    if (socialNameModal) socialNameModal.classList.remove("active");
  });
}

if (socialNameModal) {
  socialNameModal.addEventListener("click", (e) => {
    if (e.target === socialNameModal) {
      socialNameModal.classList.remove("active");
    }
  });
}

if (socialNameForm) {
  socialNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredName = socialUserNameInput ? socialUserNameInput.value.trim() : "";
    if (!enteredName) return;

    if (socialNameModal) socialNameModal.classList.remove("active");

    const user = {
      name: enteredName,
      identifier: `user@${currentSocialProvider.toLowerCase()}.com`
    };

    localStorage.setItem("logged_in_user", JSON.stringify(user));
    updateUserNameDisplay();

    if (authScreen) authScreen.classList.add("fade-out");

    setTimeout(() => {
      if (authScreen) {
        authScreen.classList.add("hidden");
        authScreen.classList.remove("fade-out");
      }

      if (mainWebsite) {
        mainWebsite.classList.remove("hidden");
        mainWebsite.classList.add("fade-in");
      }
    }, 450);
  });
}

// Link Switch Handlers
if (switchToSignup) {
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    showSignupForm();
  });
}

if (switchToLogin) {
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });
}

// Handle Sign Up
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const identifier = document.getElementById("signup-identifier").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!isValidIdentifier(identifier)) {
      alert('BAWAL NGANII ANG WALANG "@gmail.com" O "09"');
      return;
    }

    const users = JSON.parse(localStorage.getItem("pet_users") || "[]");
    const existingUser = users.find((user) => user.identifier === identifier);

    if (existingUser) {
      alert("An account with this Gmail/Phone Number already exists. Please Log In.");
      signupForm.reset();
      if (loginForm) loginForm.reset();
      showLoginForm();
      const loginIdInput = document.getElementById("login-identifier");
      const loginPassInput = document.getElementById("login-password");
      if (loginIdInput) loginIdInput.value = identifier;
      if (loginPassInput) loginPassInput.focus();
      return;
    }

    const newUser = { name, identifier, password };
    users.push(newUser);
    localStorage.setItem("pet_users", JSON.stringify(users));

    alert("Account created successfully!");

    signupForm.reset();
    if (loginForm) loginForm.reset();
    showLoginForm();
  });
}

// Handle Log In
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const identifier = document.getElementById("login-identifier").value.trim();
    const password = document.getElementById("login-password").value;

    if (!isValidIdentifier(identifier)) {
      alert('BAWAL NGANII ANG WALANG "@gmail.com" O "09"');
      return;
    }

    const users = JSON.parse(localStorage.getItem("pet_users") || "[]");
    const user = users.find(
      (u) => u.identifier === identifier && u.password === password
    );

    if (user) {
      localStorage.setItem("logged_in_user", JSON.stringify(user));
      updateUserNameDisplay();

      if (authScreen) authScreen.classList.add("fade-out");

      setTimeout(() => {
        if (authScreen) {
          authScreen.classList.add("hidden");
          authScreen.classList.remove("fade-out");
        }

        if (mainWebsite) {
          mainWebsite.classList.remove("hidden");
          mainWebsite.classList.add("fade-in");
        }

        loginForm.reset();
      }, 450);
    } else {
      alert("Invalid Email/Phone Number or Password mo, TIGNAN MO MABUTI HEHE.");
    }
  });
}

// Open Log Out Confirmation Pop-up
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (logoutModal) logoutModal.classList.add("active");
  });
}

// Close Pop-up when clicking "X"
if (logoutCancelBtn) {
  logoutCancelBtn.addEventListener("click", () => {
    if (logoutModal) logoutModal.classList.remove("active");
  });
}

// Close Pop-up when clicking outside the box
if (logoutModal) {
  logoutModal.addEventListener("click", (e) => {
    if (e.target === logoutModal) {
      logoutModal.classList.remove("active");
    }
  });
}

// Confirm Log Out -> Return smoothly to Log In Screen
if (logoutConfirmBtn) {
  logoutConfirmBtn.addEventListener("click", () => {
    if (logoutModal) logoutModal.classList.remove("active");
    localStorage.removeItem("logged_in_user");
    updateUserNameDisplay();

    if (mainWebsite) mainWebsite.classList.add("fade-out");

    setTimeout(() => {
      if (mainWebsite) {
        mainWebsite.classList.add("hidden");
        mainWebsite.classList.remove("fade-out", "fade-in");
      }

      if (authScreen) {
        authScreen.classList.remove("hidden");
        authScreen.classList.add("fade-in");
      }

      showLoginForm();
    }, 450);
  });
}

// Run verification on initial load
window.addEventListener("DOMContentLoaded", verifyAccess);

/* ================= INSTAGRAM LIGHTBOX ZOOM ================= */
document.addEventListener("DOMContentLoaded", () => {
  const instagramImages = document.querySelectorAll(".instagram__grid img");
  const imageModal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeModalBtn = document.getElementById("modal-close");

  if (imageModal && modalImg && instagramImages.length > 0) {
    instagramImages.forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        imageModal.classList.add("active");
      });
    });

    const closeLightbox = () => {
      imageModal.classList.remove("active");
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeLightbox);
    }

    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && imageModal.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
});

/* ================= NEWSLETTER POP-UP HANDLER ================= */
function showNewsletterPopup(event) {
  if (event) event.preventDefault();

  const emailInput = document.getElementById("newsletter-email-input");
  const modal = document.getElementById("newsletter-modal");

  if (emailInput && emailInput.value.trim() !== "") {
    if (modal) {
      modal.classList.add("active");
    }
    emailInput.value = "";
  }
}

function closeNewsletterPopup() {
  const modal = document.getElementById("newsletter-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

/* ================= MEMBER PROFILE MODAL HANDLER ================= */
function showMemberModal(name, imgSrc, role = 'Group Member') {
  const modalName = document.getElementById('member-modal-name');
  const modalImg = document.getElementById('member-modal-img');
  const modalRole = document.getElementById('member-modal-role');
  const modal = document.getElementById('member-modal');

  if (modalName) modalName.innerText = name;
  if (modalImg) modalImg.src = imgSrc;
  if (modalRole) modalRole.innerText = role;
  if (modal) modal.classList.add('active');
}

function closeMemberModal() {
  const modal = document.getElementById("member-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function closeMemberModalOnOverlay(event) {
  const modal = document.getElementById("member-modal");
  if (event.target === modal) {
    modal.classList.remove("active");
  }
}

/* ================= BOTTOM NAV ACTIVE SWITCHER ================= */
const bottomNavLinks = document.querySelectorAll(".bottom__nav-link");

bottomNavLinks.forEach((link) => {
  link.addEventListener("click", function () {
    bottomNavLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// Dynamic Active Highlight for Floating Bottom Navigation
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("header[id], section[id], footer[id]");
  const bottomNavLinks = document.querySelectorAll(".bottom__nav-link");

  window.addEventListener("scroll", () => {
    let currentSection = "";
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    bottomNavLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
});