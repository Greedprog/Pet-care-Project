/* ================= GLOBAL & NAV INITIALIZATION ================= */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

// Default SVG Data URI for Anonymous Profile Avatar
const DEFAULT_ANONYMOUS_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237052ff'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 6zm0 14a7.93 7.93 0 0 1-5.6-2.3 8 8 0 0 1 11.2 0A7.93 7.93 0 0 1 12 20z'/></svg>";

/* Dynamic Body Scroll Lock Handler */
function setScrollLock(locked) {
  if (locked) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
}

/* Mobile Navigation Toggle */
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
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

/* Swiper Initialization */
let swiper;
if (typeof Swiper !== "undefined") {
  swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

/* DOM Elements */
const authScreen = document.getElementById("auth-screen");
const authScreenClose = document.getElementById("auth-screen-close");
const getStartedScreen = document.getElementById("get-started-screen");
const getStartedBtn = document.getElementById("get-started-btn");
const mainWebsite = document.getElementById("main-website");

const loginNavBtn = document.getElementById("login-nav-btn");
const userProfileGroup = document.getElementById("user-profile-group");

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

const avatarModal = document.getElementById("avatar-modal");
const avatarModalForm = document.getElementById("avatar-modal-form");
const avatarModalClose = document.getElementById("avatar-modal-close");
const avatarRemoveBtn = document.getElementById("avatar-remove-btn");
const userDisplayAvatar = document.getElementById("user-display-avatar");
const userDisplayName = document.getElementById("user-display-name");

const logoutModal = document.getElementById("logout-modal");
const logoutConfirmBtn = document.getElementById("logout-confirm-btn");
const logoutCancelBtn = document.getElementById("logout-cancel-btn");

let currentSocialProvider = "Social";

/* Read File as Base64 */
function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function showLoginForm() {
  if (signupForm) signupForm.classList.remove("active");
  if (loginForm) loginForm.classList.add("active");
}

function showSignupForm() {
  if (loginForm) loginForm.classList.remove("active");
  if (signupForm) signupForm.classList.add("active");
}

/* Update Display Name & Social Provider UI Badges */
function updateUserNameDisplay() {
  const user = JSON.parse(localStorage.getItem("logged_in_user"));

  // 1. Update Display Name
  if (userDisplayName) {
    userDisplayName.textContent = user && user.name ? user.name : "User";
  }

  // 2. Update Social Provider Badge on UI Navbar
  const socialProviderBadge = document.getElementById("social-provider-badge");
  if (socialProviderBadge) {
    if (user && user.provider) {
      const provider = user.provider.toLowerCase();
      let iconClass = "ri-user-3-fill";
      let badgeBg = "#7052ff";

      if (provider === "google" || provider === "gmail") {
        iconClass = "ri-google-fill";
        badgeBg = "#ea4335";
      } else if (provider === "facebook") {
        iconClass = "ri-facebook-fill";
        badgeBg = "#1877f2";
      }
      
      socialProviderBadge.innerHTML = `<i class="${iconClass}"></i> ${user.provider}`;
      socialProviderBadge.style.backgroundColor = badgeBg;
      socialProviderBadge.classList.remove("hidden");
    } else {
      socialProviderBadge.classList.add("hidden");
    }
  }

  // 3. Display Welcome Banner for Login
  const welcomeBanner = document.getElementById("social-welcome-banner");
  const bannerText = document.getElementById("social-banner-text");
  const bannerIcon = document.getElementById("social-banner-icon");

  if (welcomeBanner && bannerText && bannerIcon && user) {
    const provider = (user.provider || "Account").toLowerCase();
    let bannerClass = "standard-banner";
    let iconClass = "ri-checkbox-circle-fill";

    if (provider === "google" || provider === "gmail") {
      bannerClass = "google-banner";
      iconClass = "ri-google-fill";
    } else if (provider === "facebook") {
      bannerClass = "facebook-banner";
      iconClass = "ri-facebook-fill";
    }

    bannerText.textContent = `Welcome, ${user.name}! Logged in using ${user.provider || "Account"}`;
    bannerIcon.className = iconClass;
    
    welcomeBanner.className = `social-welcome-banner ${bannerClass}`;
    welcomeBanner.classList.remove("hidden");

    // Auto-hide welcome banner after 4.5 seconds
    setTimeout(() => {
      welcomeBanner.classList.add("hidden");
    }, 4500);
  }

  // 4. Update User ID inside Profile Modal
  const userDisplayId = document.getElementById("user-display-id");
  if (userDisplayId) {
    if (user && user.id) {
      userDisplayId.textContent = `User ID: ${user.id}`;
    } else if (user && user.identifier) {
      userDisplayId.textContent = `User ID: ${user.identifier}`;
    } else {
      userDisplayId.textContent = "User ID: N/A";
    }
  }
  
  // 5. Update Avatar Picture
  if (userDisplayAvatar) {
    if (user && user.avatar && user.avatar.trim() !== "") {
      userDisplayAvatar.src = user.avatar;
    } else {
      userDisplayAvatar.src = DEFAULT_ANONYMOUS_AVATAR;
    }
  }

  const reportEmailInput = document.getElementById("report-email-input");
  const activeEmail = getActiveClientEmail();
  if (reportEmailInput && activeEmail) {
    reportEmailInput.value = activeEmail;
  }

  checkReportSubmissionStatus();
}

function isValidIdentifier(identifier) {
  const isGmail = identifier.toLowerCase().endsWith("@gmail.com") && identifier.indexOf("@gmail.com") > 0;
  const isPhone = /^09\d{9}$/.test(identifier);
  return isGmail || isPhone;
}

function getActiveClientEmail() {
  const user = JSON.parse(localStorage.getItem("logged_in_user"));
  if (user && user.identifier && user.identifier.includes("@")) {
    return user.identifier;
  }
  return localStorage.getItem("active_client_email") || "";
}

/* Check if Client Has Already Emailed a Report */
function checkReportSubmissionStatus() {
  const activeEmail = getActiveClientEmail();
  const formContainer = document.getElementById("report-form-container");
  const noticeBox = document.getElementById("report-submitted-notice");

  if (!formContainer || !noticeBox) return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  const hasSubmitted = activeEmail && reports.some(
    (r) => r.email && r.email.toLowerCase() === activeEmail.toLowerCase()
  );

  if (hasSubmitted) {
    formContainer.classList.add("hidden");
    noticeBox.classList.remove("hidden");
  } else {
    formContainer.classList.remove("hidden");
    noticeBox.classList.add("hidden");
  }
}

/* Access & Session Verification */
function verifyAccess() {
  const user = JSON.parse(localStorage.getItem("logged_in_user"));

  // Main website is always visible for viewing
  if (mainWebsite) mainWebsite.classList.remove("hidden");

  if (user) {
    updateUserNameDisplay();
    if (loginNavBtn) loginNavBtn.classList.add("hidden");
    if (userProfileGroup) userProfileGroup.classList.remove("hidden");
    if (getStartedScreen) getStartedScreen.classList.add("hidden");
    if (authScreen) authScreen.classList.add("hidden");
  } else {
    sessionStorage.removeItem("has_clicked_get_start");
    if (authScreen) authScreen.classList.add("hidden");
    if (getStartedScreen) getStartedScreen.classList.add("hidden");

    if (loginNavBtn) loginNavBtn.classList.remove("hidden");
    if (userProfileGroup) userProfileGroup.classList.add("hidden");
  }

  // Check if any overlay modal is currently active
  const isOverlayActive = (getStartedScreen && !getStartedScreen.classList.contains("hidden")) ||
                          (authScreen && !authScreen.classList.contains("hidden"));
  setScrollLock(isOverlayActive);

  syncAndRenderClientChat();
}

/* Initialize Page State on Load & Setup Real-Time Listeners */
document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("has_clicked_get_start");
  verifyAccess();

  // Polling check for admin responses every 1.5 seconds
  setInterval(syncAndRenderClientChat, 1500);

  // Sync when admin modifies localStorage in another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "pet_emergency_reports") {
      syncAndRenderClientChat();
      checkReportSubmissionStatus();
    }
  });
});

/* Open Auth Screen on Navbar Login Button Click */
if (loginNavBtn) {
  loginNavBtn.addEventListener("click", () => {
    showLoginForm();
    if (authScreen) authScreen.classList.remove("hidden");
    setScrollLock(true);
  });
}

/* Close Auth Screen Modal */
if (authScreenClose) {
  authScreenClose.addEventListener("click", () => {
    if (authScreen) authScreen.classList.add("hidden");
    setScrollLock(false);
  });
}

if (logoutConfirmBtn) {
  logoutConfirmBtn.addEventListener("click", () => {
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("active_client_email");
    sessionStorage.removeItem("has_clicked_get_start");
    if (logoutModal) logoutModal.classList.remove("active");
    verifyAccess();
    setScrollLock(false);
  });
}

/* Password Eye Toggle */
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

/* Form Switch Event Handlers */
const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");

if (switchToSignup) switchToSignup.addEventListener("click", (e) => { e.preventDefault(); showSignupForm(); });
if (switchToLogin) switchToLogin.addEventListener("click", (e) => { e.preventDefault(); showLoginForm(); });

/* Auth Submissions */

// 1. LOG IN FORM SUBMISSION
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const identifierInput = document.getElementById("login-identifier");
    const passwordInput = document.getElementById("login-password");

    const identifier = identifierInput ? identifierInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!isValidIdentifier(identifier)) {
      alert("Please enter a valid Gmail address (@gmail.com) or phone number (e.g., 09123456789).");
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("registered_users")) || [];
    let matchedUser = registeredUsers.find(u => u.identifier.toLowerCase() === identifier);

    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }
    } else {
      // If no account found, create new account session
      const nameSlug = identifier.split("@")[0].replace(/[^a-z0-9]/g, "");
      const isGmail = identifier.endsWith("@gmail.com");
      matchedUser = {
        id: `user_${nameSlug}_${Date.now()}`,
        name: identifier.includes("@") ? identifier.split("@")[0] : "User",
        identifier: identifier,
        password: password,
        avatar: "",
        provider: isGmail ? "Gmail" : "Account"
      };
      registeredUsers.push(matchedUser);
      localStorage.setItem("registered_users", JSON.stringify(registeredUsers));
    }

    // Set Logged In Session
    localStorage.setItem("logged_in_user", JSON.stringify(matchedUser));
    if (identifier.includes("@")) {
      localStorage.setItem("active_client_email", identifier);
    }

    verifyAccess();

    if (authScreen) authScreen.classList.add("fade-out");
    setTimeout(() => {
      if (authScreen) { 
        authScreen.classList.add("hidden"); 
        authScreen.classList.remove("fade-out"); 
      }
      if (getStartedScreen) { 
        getStartedScreen.classList.add("hidden"); 
      }
      if (mainWebsite) {
        mainWebsite.classList.remove("hidden");
      }
      setScrollLock(false);
      loginForm.reset();
    }, 400);
  });
}

// 2. SIGN UP FORM SUBMISSION
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("signup-name");
    const identifierInput = document.getElementById("signup-identifier");
    const passwordInput = document.getElementById("signup-password");
    const avatarInput = document.getElementById("signup-avatar");

    const name = nameInput ? nameInput.value.trim() : "";
    const identifier = identifierInput ? identifierInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";
    const avatarFile = avatarInput && avatarInput.files[0] ? avatarInput.files[0] : null;

    if (!isValidIdentifier(identifier)) {
      alert("Please enter a valid Gmail address (@gmail.com) or phone number (e.g., 09123456789).");
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("registered_users")) || [];
    const existingUser = registeredUsers.find(u => u.identifier.toLowerCase() === identifier);

    if (existingUser) {
      alert("An account with this Gmail/Phone Number already exists! Please log in instead.");
      showLoginForm();
      const loginIdentifier = document.getElementById("login-identifier");
      if (loginIdentifier) loginIdentifier.value = identifier;
      return;
    }

    const avatarData = await readFileAsDataURL(avatarFile);
    const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const isGmail = identifier.endsWith("@gmail.com");

    const newUser = { 
      id: `user_${nameSlug}_${Date.now()}`,
      name, 
      identifier, 
      password,
      avatar: avatarData,
      provider: isGmail ? "Gmail" : "Account"
    };

    registeredUsers.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(registeredUsers));

    alert("Account created successfully! Please log in using your newly created account.");

    signupForm.reset();

    showLoginForm();
    const loginIdentifier = document.getElementById("login-identifier");
    if (loginIdentifier) loginIdentifier.value = identifier;
  });
}

/* Social Login Modal Handler */
function openSocialNamePrompt(provider) {
  currentSocialProvider = provider;
  if (socialModalTitle) socialModalTitle.textContent = `Continue with ${provider}`;
  if (socialUserNameInput) socialUserNameInput.value = "";
  
  if (authScreen) authScreen.classList.add("hidden");
  if (socialNameModal) socialNameModal.classList.add("active");
  setScrollLock(true);
}

if (googleAuthBtn) googleAuthBtn.addEventListener("click", () => openSocialNamePrompt("Google"));
if (facebookAuthBtn) facebookAuthBtn.addEventListener("click", () => openSocialNamePrompt("Facebook"));

if (socialModalClose) {
  socialModalClose.addEventListener("click", () => {
    if (socialNameModal) socialNameModal.classList.remove("active");
    if (authScreen) authScreen.classList.remove("hidden");
    setScrollLock(true);
  });
}

if (socialNameForm) {
  socialNameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredName = socialUserNameInput ? socialUserNameInput.value.trim() : "";
    if (!enteredName) return;

    const socialAvatarInput = document.getElementById("social-user-avatar");
    const avatarFile = socialAvatarInput && socialAvatarInput.files[0] ? socialAvatarInput.files[0] : null;
    const avatarData = await readFileAsDataURL(avatarFile);

    const nameSlug = enteredName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const uniqueUserId = `user_${nameSlug}_${Date.now()}`;
    const uniqueEmail = `${nameSlug}.${currentSocialProvider.toLowerCase()}_${Date.now()}@gmail.com`;

    const user = {
      id: uniqueUserId,
      name: enteredName,
      identifier: uniqueEmail,
      avatar: avatarData,
      provider: currentSocialProvider
    };

    const registeredUsers = JSON.parse(localStorage.getItem("registered_users")) || [];
    registeredUsers.push(user);
    localStorage.setItem("registered_users", JSON.stringify(registeredUsers));

    localStorage.setItem("logged_in_user", JSON.stringify(user));
    localStorage.setItem("active_client_email", user.identifier);

    verifyAccess();

    if (socialNameModal) socialNameModal.classList.remove("active");
    if (getStartedScreen) getStartedScreen.classList.add("hidden");
    if (mainWebsite) mainWebsite.classList.remove("hidden");

    setScrollLock(false);
    socialNameForm.reset();
  });
}

/* Get Started Button Action */
if (getStartedBtn) {
  getStartedBtn.addEventListener("click", () => {
    sessionStorage.setItem("has_clicked_get_start", "true");
    if (getStartedScreen) getStartedScreen.classList.add("fade-out");
    setTimeout(() => {
      if (getStartedScreen) {
        getStartedScreen.classList.add("hidden");
        getStartedScreen.classList.remove("fade-out");
      }
      if (mainWebsite) {
        mainWebsite.classList.remove("hidden");
        mainWebsite.classList.add("fade-in");
      }
      setScrollLock(false);
    }, 300);
  });
}

/* Logout Actions */
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (logoutModal) logoutModal.classList.add("active");
  });
}

if (logoutCancelBtn) {
  logoutCancelBtn.addEventListener("click", () => {
    if (logoutModal) logoutModal.classList.remove("active");
  });
}

/* Profile Picture Modal Handlers */
if (userDisplayAvatar) {
  userDisplayAvatar.addEventListener("click", () => {
    if (avatarModal) avatarModal.classList.add("active");
  });
}

if (userDisplayName) {
  userDisplayName.addEventListener("click", () => {
    if (avatarModal) avatarModal.classList.add("active");
  });
}

if (avatarModalClose) {
  avatarModalClose.addEventListener("click", () => {
    if (avatarModal) avatarModal.classList.remove("active");
  });
}

if (avatarModalForm) {
  avatarModalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const avatarFileInput = document.getElementById("avatar-modal-file");
    const avatarFile = avatarFileInput && avatarFileInput.files[0] ? avatarFileInput.files[0] : null;

    if (avatarFile) {
      const avatarData = await readFileAsDataURL(avatarFile);
      const user = JSON.parse(localStorage.getItem("logged_in_user")) || {};
      user.avatar = avatarData;
      localStorage.setItem("logged_in_user", JSON.stringify(user));
      updateUserNameDisplay();
    }

    if (avatarModal) avatarModal.classList.remove("active");
    avatarModalForm.reset();
  });
}

if (avatarRemoveBtn) {
  avatarRemoveBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("logged_in_user")) || {};
    user.avatar = "";
    localStorage.setItem("logged_in_user", JSON.stringify(user));
    updateUserNameDisplay();
    if (avatarModal) avatarModal.classList.remove("active");
  });
}

/* Global Inline Event Functions Referenced in HTML */
function showMemberModal(name, imgSrc, role) {
  const modal = document.getElementById("member-modal");
  const modalName = document.getElementById("member-modal-name");
  const modalImg = document.getElementById("member-modal-img");
  const modalRole = document.getElementById("member-modal-role");

  if (modalName) modalName.textContent = name;
  if (modalImg) modalImg.src = imgSrc;
  if (modalRole) modalRole.textContent = role || "Group Member";

  if (modal) modal.classList.add("active");
}

function closeMemberModal() {
  const modal = document.getElementById("member-modal");
  if (modal) modal.classList.remove("active");
}

function closeMemberModalOnOverlay(event) {
  if (event && event.target && event.target.id === "member-modal") {
    closeMemberModal();
  }
}

function handleReportSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById("report-email-input");
  const messageInput = document.getElementById("report-message-input");

  const email = emailInput ? emailInput.value.trim() : "";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!email || !message) return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  const alreadySubmitted = reports.some((r) => r.email && r.email.toLowerCase() === email.toLowerCase());

  if (alreadySubmitted) {
    alert("You have already submitted an emergency report. Please use the floating chat button on the bottom right to continue messaging.");
    checkReportSubmissionStatus();
    return;
  }

  const timestamp = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  const newReport = {
    id: "report_" + Date.now(),
    email: email,
    message: message,
    date: timestamp,
    status: "Pending",
    unreadForAdmin: true,
    unreadForClient: false,
    replies: [
      {
        sender: "client",
        text: message,
        time: timestamp
      }
    ]
  };

  reports.push(newReport);
  localStorage.setItem("pet_emergency_reports", JSON.stringify(reports));

  const previewEmail = document.getElementById("preview-report-email");
  const previewDate = document.getElementById("preview-report-date");
  const previewMessage = document.getElementById("preview-report-message");

  if (previewEmail) previewEmail.textContent = email;
  if (previewDate) previewDate.textContent = timestamp;
  if (previewMessage) previewMessage.textContent = message;

  const reportModal = document.getElementById("report-modal");
  if (reportModal) reportModal.classList.add("active");

  const reportForm = document.getElementById("report-form");
  if (reportForm) reportForm.reset();

  checkReportSubmissionStatus();
  syncAndRenderClientChat();
}

function closeReportPopup() {
  const reportModal = document.getElementById("report-modal");
  if (reportModal) reportModal.classList.remove("active");
}

function toggleClientChatModal() {
  const chatModal = document.getElementById("client-reply-modal");

  if (chatModal) {
    chatModal.classList.toggle("active");
    if (chatModal.classList.contains("active")) {
      markAdminMessagesAsRead();
    }
  }
  syncAndRenderClientChat();
}

function closeClientReplyModal() {
  const chatModal = document.getElementById("client-reply-modal");
  if (chatModal) chatModal.classList.remove("active");
}

function markAdminMessagesAsRead() {
  const activeEmail = getActiveClientEmail();
  if (!activeEmail) return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  let updated = false;

  reports.forEach((r) => {
    if (r.email.toLowerCase() === activeEmail.toLowerCase() && r.unreadForClient) {
      r.unreadForClient = false;
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem("pet_emergency_reports", JSON.stringify(reports));
  }
}

function handleClientReply(event) {
  event.preventDefault();
  const input = document.getElementById("client-reply-input");

  if (!input) return;
  const messageText = input.value.trim();
  if (!messageText) return;

  const activeEmail = getActiveClientEmail();
  if (activeEmail) {
    const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
    const activeReport = reports.slice().reverse().find(
      (r) => r.email.toLowerCase() === activeEmail.toLowerCase() && r.status !== "Resolved"
    );

    if (activeReport) {
      const timestamp = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
      activeReport.replies.push({ sender: "client", text: messageText, time: timestamp });
      activeReport.status = "Pending";
      activeReport.unreadForAdmin = true;
      localStorage.setItem("pet_emergency_reports", JSON.stringify(reports));
    }
  }

  input.value = "";
  syncAndRenderClientChat();
}

/* Feedback Form Submission & Delete Handler */
const feedbackForm = document.getElementById("feedback-form");
if (feedbackForm) {
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const jobInput = document.getElementById("feedback-job-input");
    const feedbackInput = document.getElementById("feedback-input");

    const job = jobInput && jobInput.value.trim() ? jobInput.value.trim() : "Pet Owner";
    const feedback = feedbackInput ? feedbackInput.value.trim() : "";
    const user = JSON.parse(localStorage.getItem("logged_in_user")) || {};
    const name = user.name || "Anonymous User";
    const identifier = user.id || user.identifier || name;
    const avatar = user.avatar || DEFAULT_ANONYMOUS_AVATAR;

    if (swiper) {
      const newSlide = `
        <div class="swiper-slide">
          <div class="client__card" style="position: relative;" data-author-identifier="${identifier}" data-author-name="${name.toLowerCase()}">
            <button class="delete-feedback-btn" title="Delete Feedback" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #ff4d4d; font-size: 1.25rem; cursor: pointer; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
              <i class="ri-delete-bin-line"></i>
            </button>
            <div class="client__details">
              <img src="${avatar}" alt="${name}" />
              <div>
                <h4>${name}</h4>
                <h5>${job}</h5>
              </div>
            </div>
            <p>${feedback}</p>
          </div>
        </div>
      `;
      swiper.appendSlide(newSlide);
      swiper.slideTo(swiper.slides.length - 1);
    }

    feedbackForm.reset();
  });
}

/* Event Delegation for Authorized Deleting of Feedback */
const swiperContainer = document.querySelector(".swiper");
if (swiperContainer) {
  swiperContainer.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-feedback-btn");
    if (!deleteBtn) return;

    const card = deleteBtn.closest(".client__card");
    const authorIdentifier = card ? card.dataset.authorIdentifier : null;
    const authorName = card ? card.dataset.authorName : null;

    const currentUser = JSON.parse(localStorage.getItem("logged_in_user")) || {};
    const currentIdentifier = currentUser.id || currentUser.identifier || currentUser.name || "";
    const currentUserName = (currentUser.name || "").toLowerCase();

    const isSameAccount = authorIdentifier && authorIdentifier === currentIdentifier;
    const isSameName = authorName && authorName === currentUserName;

    if (!isSameAccount || !isSameName) {
      alert("You can only delete feedback posted by your specific account and name.");
      return;
    }

    const slide = deleteBtn.closest(".swiper-slide");
    if (slide && swiper) {
      const slideIndex = Array.from(swiper.slides).indexOf(slide);
      if (slideIndex !== -1) {
        swiper.removeSlide(slideIndex);
        swiper.update();
      }
    }
  });
}

/* Instagram Modal Zoom */
document.querySelectorAll(".instagram__grid img").forEach((img) => {
  img.addEventListener("click", () => {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    if (modal && modalImg) {
      modalImg.src = img.src;
      modal.classList.add("active");
    }
  });
});

const modalClose = document.getElementById("modal-close");
if (modalClose) {
  modalClose.addEventListener("click", () => {
    const modal = document.getElementById("image-modal");
    if (modal) modal.classList.remove("active");
  });
}

/* Chat Rendering Logic */
function syncAndRenderClientChat() {
  const activeEmail = getActiveClientEmail();
  const unreadBadge = document.getElementById("client-unread-badge");
  const floatingBtn = document.getElementById("client-chat-trigger");
  const chatBody = document.getElementById("client-chat-messages");
  const chatModal = document.getElementById("client-reply-modal");

  if (!activeEmail) return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  const userReports = reports.filter((r) => r.email && r.email.toLowerCase() === activeEmail.toLowerCase());

  const hasUnread = userReports.some((r) => r.unreadForClient === true);

  if (floatingBtn) {
    if (hasUnread) {
      floatingBtn.style.color = "#ff4d4d";
      floatingBtn.style.borderColor = "#ff4d4d";
      floatingBtn.classList.add("has-unread");
    } else {
      floatingBtn.style.color = "";
      floatingBtn.style.borderColor = "";
      floatingBtn.classList.remove("has-unread");
    }
  }

  if (unreadBadge) {
    if (hasUnread) {
      unreadBadge.classList.remove("hidden");
      unreadBadge.style.backgroundColor = "#ff4d4d";
    } else {
      unreadBadge.classList.add("hidden");
    }
  }

  if (chatModal && chatModal.classList.contains("active") && chatBody) {
    chatBody.style.display = "flex";
    chatBody.style.flexDirection = "column";
    chatBody.style.gap = "0.75rem";
    chatBody.style.padding = "1rem";
    chatBody.style.maxHeight = "380px";
    chatBody.style.overflowY = "auto";

    let fullChatHTML = "";

    userReports.forEach((report) => {
      if (report.replies && report.replies.length > 0) {
        report.replies.forEach((msg) => {
          const isClient = msg.sender === "client";
          
          const alignSelf = isClient ? "flex-end" : "flex-start";
          const bgColor = isClient ? "#6c47ff" : "#f2efff";
          const textColor = isClient ? "#ffffff" : "#2b2640";
          const labelColor = isClient ? "#e0d7ff" : "#6c47ff";
          const timeColor = isClient ? "#d2c6ff" : "#827c9e";
          const border = isClient ? "none" : "1px solid #e1d9ff";
          const borderRadius = isClient ? "16px 16px 4px 16px" : "16px 16px 16px 4px";
          const senderLabel = isClient ? "YOU" : "ADMIN / OWNER";

          fullChatHTML += `
            <div style="
              align-self: ${alignSelf};
              max-width: 80%;
              background-color: ${bgColor};
              color: ${textColor};
              padding: 0.75rem 1rem;
              border-radius: ${borderRadius};
              border: ${border};
              box-shadow: 0 2px 6px rgba(0,0,0,0.05);
              word-break: break-word;
            ">
              <div style="font-size: 0.7rem; font-weight: 700; color: ${labelColor}; margin-bottom: 4px; letter-spacing: 0.5px;">
                ${senderLabel}
              </div>
              <div style="font-size: 0.88rem; line-height: 1.4;">${msg.text}</div>
              <div style="font-size: 0.65rem; color: ${timeColor}; text-align: right; margin-top: 5px;">${msg.time}</div>
            </div>
          `;
        });
      }
    });

    if (fullChatHTML !== "") {
      chatBody.innerHTML = fullChatHTML;
      chatBody.scrollTop = chatBody.scrollHeight;
    } else {
      chatBody.innerHTML = `<div style="text-align: center; color: #827c9e; font-size: 0.88rem; padding: 2rem 0;">No messages found.</div>`;
    }
  }
}