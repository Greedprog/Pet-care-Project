const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
  }
});

// Swiper Initialization
const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
});

/* ================= AUTHENTICATION LOGIC ================= */
const authScreen = document.getElementById("auth-screen");
const mainWebsite = document.getElementById("main-website");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const logoutBtn = document.getElementById("logout-btn");

const logoutModal = document.getElementById("logout-modal");
const logoutConfirmBtn = document.getElementById("logout-confirm-btn");
const logoutCancelBtn = document.getElementById("logout-cancel-btn");

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
    authScreen.classList.add("hidden");
    mainWebsite.classList.remove("hidden");
  } else {
    authScreen.classList.remove("hidden");
    mainWebsite.classList.add("hidden");
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
    const isPassword = targetInput.type === "password";

    targetInput.type = isPassword ? "text" : "password";
    icon.classList.toggle("ri-eye-line", !isPassword);
    icon.classList.toggle("ri-eye-off-line", isPassword);
  });
});

// Switch Tabs
tabLogin.addEventListener("click", () => {
  if (tabLogin.classList.contains("active")) return;

  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");

  signupForm.classList.remove("active");
  loginForm.classList.add("active");
});

tabSignup.addEventListener("click", () => {
  if (tabSignup.classList.contains("active")) return;

  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");

  loginForm.classList.remove("active");
  signupForm.classList.add("active");
});

// Handle Sign Up
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const identifier = document.getElementById("signup-identifier").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!isValidIdentifier(identifier)) {
    alert('BAWAL NGANII ANG WALANG "@gmail.com" AT "09"');
    return;
  }

  const users = JSON.parse(localStorage.getItem("pet_users") || "[]");
  const existingUser = users.find((user) => user.identifier === identifier);

  if (existingUser) {
    alert("An account with this Gmail/Phone Number already exists. Please Log In.");
    signupForm.reset();
    loginForm.reset();
    tabLogin.click();
    document.getElementById("login-identifier").value = identifier;
    document.getElementById("login-password").focus();
    return;
  }

  const newUser = { name, identifier, password };
  users.push(newUser);
  localStorage.setItem("pet_users", JSON.stringify(users));

  alert("Account created successfully!");

  signupForm.reset();
  loginForm.reset();
  tabLogin.click();
});

// Handle Log In
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

    authScreen.classList.add("fade-out");

    setTimeout(() => {
      authScreen.classList.add("hidden");
      authScreen.classList.remove("fade-out");

      mainWebsite.classList.remove("hidden");
      mainWebsite.classList.add("fade-in");

      loginForm.reset();
    }, 450);
  } else {
    alert("Invalid Email/Phone Number or Password mo, TIGNAN MO MABUTI HEHE.");
  }
});

// Open Log Out Confirmation Pop-up
logoutBtn.addEventListener("click", () => {
  logoutModal.classList.add("active");
});

// Close Pop-up when clicking "X"
if (logoutCancelBtn) {
  logoutCancelBtn.addEventListener("click", () => {
    logoutModal.classList.remove("active");
  });
}

// Close Pop-up when clicking outside the box
logoutModal.addEventListener("click", (e) => {
  if (e.target === logoutModal) {
    logoutModal.classList.remove("active");
  }
});

// Confirm Log Out -> Return smoothly to Log In Screen
logoutConfirmBtn.addEventListener("click", () => {
  logoutModal.classList.remove("active");
  localStorage.removeItem("logged_in_user");
  updateUserNameDisplay();

  mainWebsite.classList.add("fade-out");

  setTimeout(() => {
    mainWebsite.classList.add("hidden");
    mainWebsite.classList.remove("fade-out", "fade-in");

    authScreen.classList.remove("hidden");
    authScreen.classList.add("fade-in");

    tabLogin.click();
  }, 450);
});

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
  document.getElementById('member-modal-name').innerText = name;
  document.getElementById('member-modal-img').src = imgSrc;
  document.getElementById('member-modal-role').innerText = role;
  document.getElementById('member-modal').classList.add('active');
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