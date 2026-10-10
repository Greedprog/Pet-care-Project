// Define the admin password
const ADMIN_PASSWORD = "admin123";

let currentActiveReportId = null;

// Authentication Handlers
function checkAuthStatus() {
  const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";
  const authOverlay = document.getElementById("admin-auth-overlay");
  
  if (authOverlay) {
    if (isAuthenticated) {
      authOverlay.classList.add("hidden");
    } else {
      authOverlay.classList.remove("hidden");
      const passwordInput = document.getElementById("admin-password-input");
      if (passwordInput) passwordInput.focus();
    }
  }
}

function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const passwordInput = document.getElementById("admin-password-input");
  const errorMsg = document.getElementById("auth-error-msg");
  const enteredPassword = passwordInput ? passwordInput.value : "";

  if (enteredPassword === ADMIN_PASSWORD) {
    sessionStorage.setItem("admin_authenticated", "true");
    if (errorMsg) errorMsg.classList.add("hidden");
    if (passwordInput) passwordInput.value = "";
    checkAuthStatus();
  } else {
    if (errorMsg) errorMsg.classList.remove("hidden");
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.focus();
    }
  }
}

// Logout Confirmation Modal Handlers
function openLogoutModal() {
  const modal = document.getElementById("logout-confirm-modal");
  if (modal) modal.classList.add("active");
}

function closeLogoutModal() {
  const modal = document.getElementById("logout-confirm-modal");
  if (modal) modal.classList.remove("active");
}

function confirmAdminLogout() {
  closeLogoutModal();
  sessionStorage.removeItem("admin_authenticated");
  checkAuthStatus();
}

// Generate or retrieve formatted Report ID (e.g. #REP-78900)
function getFormattedReportId(report) {
  if (!report) return "#REP-0000";
  if (report.reportCode) return report.reportCode;
  if (report.id) {
    const numPart = report.id.replace(/\D/g, "");
    if (numPart.length >= 4) {
      return `#REP-${numPart.slice(-5)}`;
    }
  }
  return "#REP-1001";
}

function renderAdminDashboard() {
  if (sessionStorage.getItem("admin_authenticated") !== "true") return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === "Pending").length;
  const repliedCount = reports.filter(r => r.status === "Replied").length;

  const statTotal = document.getElementById("stat-total");
  const statPending = document.getElementById("stat-pending");
  const statReplied = document.getElementById("stat-replied");

  if (statTotal) statTotal.textContent = totalCount;
  if (statPending) statPending.textContent = pendingCount;
  if (statReplied) statReplied.textContent = repliedCount;

  filterReports();
}

function filterReports() {
  if (sessionStorage.getItem("admin_authenticated") !== "true") return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  const searchInput = document.getElementById("report-search");
  const filterSelect = document.getElementById("report-filter");
  const tableBody = document.getElementById("reports-table-body");
  const emptyState = document.getElementById("no-reports-msg");

  if (!tableBody) return;

  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const filterStatus = filterSelect ? filterSelect.value : "ALL";

  tableBody.innerHTML = "";

  const filtered = reports.filter((report) => {
    const reportIdStr = getFormattedReportId(report).toLowerCase();
    const emailStr = (report.email || "").toLowerCase();
    const msgStr = (report.message || "").toLowerCase();

    const matchesSearch = reportIdStr.includes(searchQuery) || 
                          emailStr.includes(searchQuery) || 
                          msgStr.includes(searchQuery);
    const matchesStatus = filterStatus === "ALL" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  } else {
    if (emptyState) emptyState.classList.add("hidden");
  }

  filtered.slice().reverse().forEach((report) => {
    const tr = document.createElement("tr");
    if (report.unreadForAdmin) tr.classList.add("unread-row");

    let statusBadgeClass = "badge-pending";
    if (report.status === "Replied") statusBadgeClass = "badge-replied";

    const displayReportId = getFormattedReportId(report);

    tr.innerHTML = `
      <td>
        <span style="font-weight: 700; color: #6c47ff; background: #f0ebff; padding: 4px 8px; border-radius: 6px; font-size: 0.82rem; letter-spacing: 0.5px;">
          ${displayReportId}
        </span>
      </td>
      <td style="white-space: nowrap;">${report.date}</td>
      <td><strong>${report.email}</strong></td>
      <td style="max-width: 280px; word-break: break-word;">${report.message}</td>
      <td><span class="badge-status ${statusBadgeClass}">${report.status}</span></td>
      <td>
        <div class="action-btns">
          <button onclick="openAdminReplyModal('${report.id}')" class="btn-action btn-action--reply">
            <i class="ri-chat-3-line"></i> View & Reply
          </button>
          <button onclick="deleteReport('${report.id}')" class="btn-action btn-action--delete">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function openAdminReplyModal(reportId) {
  currentActiveReportId = reportId;
  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  const report = reports.find(r => r.id === reportId);

  if (!report) return;

  report.unreadForAdmin = false;
  localStorage.setItem("pet_emergency_reports", JSON.stringify(reports));

  const modal = document.getElementById("admin-reply-modal");
  const subtitle = document.getElementById("admin-modal-subtitle");
  const displayReportId = getFormattedReportId(report);

  if (subtitle) subtitle.textContent = `Report ID: ${displayReportId} | Sender: ${report.email}`;
  
  renderAdminChatMessages(report, true);
  if (modal) modal.classList.add("active");
  renderAdminDashboard();
}

function closeAdminReplyModal() {
  const modal = document.getElementById("admin-reply-modal");
  if (modal) modal.classList.remove("active");
  currentActiveReportId = null;
}

function renderAdminChatMessages(report, isInitialOpen = false) {
  const chatBody = document.getElementById("admin-chat-messages");
  if (!chatBody) return;

  const threshold = 80;
  const distanceFromBottom = chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight;
  const isUserAtBottom = distanceFromBottom <= threshold;
  const previousScrollTop = chatBody.scrollTop;

  chatBody.innerHTML = "";

  if (report && report.replies) {
    report.replies.forEach((reply) => {
      const isOwner = reply.sender === "owner" || reply.sender === "admin";
      const bubble = document.createElement("div");
      bubble.className = `chat__bubble ${isOwner ? 'chat__bubble--owner' : 'chat__bubble--client'}`;

      const bg = isOwner ? '#6c47ff' : '#f2efff';
      const textColor = isOwner ? '#ffffff' : '#2b2640';
      const labelColor = isOwner ? '#e0d7ff' : '#6246ea';
      const timeColor = isOwner ? '#d2c6ff' : '#827c9e';
      const border = isOwner ? 'none' : '1px solid #e1d9ff';

      bubble.style.cssText = `
        max-width: 85%;
        padding: 0.75rem 1rem;
        border-radius: 14px;
        margin-bottom: 0.65rem;
        word-break: break-word;
        align-self: ${isOwner ? 'flex-end' : 'flex-start'};
        background-color: ${bg};
        color: ${textColor};
        border: ${border};
        box-shadow: 0 2px 5px rgba(0,0,0,0.03);
      `;

      bubble.innerHTML = `
        <div style="font-size: 0.72rem; font-weight: 700; color: ${labelColor}; margin-bottom: 3px;">
          ${isOwner ? 'You (Admin)' : report.email}
        </div>
        <div style="font-size: 0.88rem; line-height: 1.4;">${reply.text}</div>
        <div style="font-size: 0.68rem; color: ${timeColor}; text-align: right; margin-top: 4px;">${reply.time}</div>
      `;
      chatBody.appendChild(bubble);
    });
  }

  if (isInitialOpen || isUserAtBottom) {
    chatBody.scrollTop = chatBody.scrollHeight;
  } else {
    chatBody.scrollTop = previousScrollTop;
  }
}

function handleAdminReplySubmit(e) {
  if (e) e.preventDefault();
  const textarea = document.getElementById("admin-reply-input");
  const replyText = textarea ? textarea.value.trim() : "";

  if (!replyText || !currentActiveReportId) return;

  const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  const report = reports.find(r => r.id === currentActiveReportId);

  if (report) {
    const timestamp = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    report.replies.push({ sender: "owner", text: replyText, time: timestamp });
    report.status = "Replied";
    
    report.unreadForClient = true;
    report.unreadForAdmin = false;

    localStorage.setItem("pet_emergency_reports", JSON.stringify(reports));
    textarea.value = "";
    
    renderAdminChatMessages(report, true);
    renderAdminDashboard();
  }
}

function deleteReport(reportId) {
  if (!confirm("Are you sure you want to delete this emergency report?")) return;
  let reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
  reports = reports.filter(r => r.id !== reportId);
  localStorage.setItem("pet_emergency_reports", JSON.stringify(reports));
  renderAdminDashboard();
}

function triggerLiveSync() {
  renderAdminDashboard();

  if (currentActiveReportId) {
    const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
    const report = reports.find(r => r.id === currentActiveReportId);
    if (report) {
      renderAdminChatMessages(report, false);
    }
  }

  const syncBtn = document.getElementById("live-sync-btn");
  if (syncBtn) {
    const originalHTML = syncBtn.innerHTML;
    syncBtn.innerHTML = `<i class="ri-check-line"></i>`;
    syncBtn.style.transform = "scale(0.96)";
    
    setTimeout(() => {
      syncBtn.innerHTML = originalHTML;
      syncBtn.style.transform = "scale(1)";
    }, 1200);
  }
}

setInterval(() => {
  if (sessionStorage.getItem("admin_authenticated") === "true") {
    renderAdminDashboard();
    if (currentActiveReportId) {
      const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
      const report = reports.find(r => r.id === currentActiveReportId);
      if (report) renderAdminChatMessages(report, false);
    }
  }
}, 1500);

window.addEventListener("storage", (e) => {
  if (e.key === "pet_emergency_reports") {
    renderAdminDashboard();
    if (currentActiveReportId) {
      const reports = JSON.parse(localStorage.getItem("pet_emergency_reports")) || [];
      const report = reports.find(r => r.id === currentActiveReportId);
      if (report) renderAdminChatMessages(report, false);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  renderAdminDashboard();
});