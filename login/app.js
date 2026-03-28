// ============================================
// AZ Khonnect Client Portal — app.js
// Main application logic
// ============================================

// Stage definitions
const STAGES = [
  { id: 1, name: 'Requested', color: '#94a3b8' },
  { id: 2, name: 'Under Review', color: '#f59e0b' },
  { id: 3, name: 'Proposal Sent', color: '#3da5d9' },
  { id: 4, name: 'Accepted', color: '#22c55e' },
  { id: 5, name: 'In Progress', color: '#f97316' },
  { id: 6, name: 'Review', color: '#a855f7' },
  { id: 7, name: 'Delivered', color: '#10b981' },
  { id: 8, name: 'Closed', color: '#6b7280' }
];

const SERVICE_TYPES = [
  'Custom Software Development',
  'CRM Implementation',
  'Data Warehousing & Analytics',
  'Process Optimisation',
  'Warehouse Management Systems',
  'IT Consulting',
  'Website & Web App Development',
  'Support & Maintenance'
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async function () {
  // Apply dark mode if stored
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Detect current page and run corresponding init
  var path = window.location.pathname;

  // Always populate service dropdown even before auth check
  if (path.includes('request.html')) {
    populateServiceDropdown();
  }

  if (!supabase) {
    console.error('Supabase not available in app.js');
    showEmptyState();
    return;
  }

  var session = null;
  try {
    var result = await supabase.auth.getSession();
    session = result.data ? result.data.session : null;
  } catch (err) {
    console.error('Session error in app.js:', err);
  }

  if (!session) {
    showEmptyState();
    return;
  }

  // Set user info on all pages (avatar, welcome)
  await setUserInfo();

  // Setup notification bell
  setupNotifications();

  // Page detection — check for key elements on the page rather than URL
  var hasDashboardStats = document.getElementById('stat-total');
  var hasRequestForm = document.getElementById('request-form');
  var hasDetailView = document.getElementById('progress-steps');
  var hasAdminTable = document.getElementById('admin-table-body');

  if (hasDashboardStats) {
    await initDashboard();
  }
  if (hasRequestForm) {
    initRequestForm();
  }
  if (hasDetailView) {
    await initDetail();
  }
  if (hasAdminTable) {
    await initAdmin();
  }

  var hasSettingsForm = document.getElementById('settings-save');
  if (hasSettingsForm) {
    await initSettings();
  }

  // Setup mobile toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebar-overlay').classList.toggle('show');
    });
  }

  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function () {
      document.getElementById('sidebar').classList.remove('open');
      sidebarOverlay.classList.remove('show');
    });
  }

  // Highlight current nav item
  highlightNav();
});

function highlightNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && path.includes(href)) {
      link.classList.add('active');
    }
  });
}

// ============================================
// USER INFO & NOTIFICATIONS
// ============================================
function getInitials(name) {
  if (!name) return '?';
  var parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

async function setUserInfo() {
  try {
    var result = await supabase.auth.getUser();
    var user = result.data ? result.data.user : null;
    if (!user) return;

    var meta = user.user_metadata || {};
    var displayName = meta.contact_name || meta.company_name || user.email;

    // Welcome message
    var welcomeEl = document.getElementById('welcome-name');
    if (welcomeEl) welcomeEl.textContent = displayName;

    // Avatar with initials
    var avatarEl = document.getElementById('user-avatar');
    if (avatarEl) avatarEl.textContent = getInitials(displayName);

    // Admin link
    var isAdmin = meta.role === 'admin';
    var adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.style.display = isAdmin ? 'flex' : 'none';
  } catch (err) {
    console.error('setUserInfo error:', err);
  }
}

function setupNotifications() {
  var btn = document.getElementById('notification-btn') || document.querySelector('.notification-btn');
  if (!btn) return;

  // Create dropdown
  var dropdown = document.createElement('div');
  dropdown.className = 'notification-dropdown';
  dropdown.id = 'notification-dropdown';
  dropdown.style.display = 'none';
  dropdown.innerHTML = '<div class="notif-header">Notifications</div>' +
    '<div class="notif-empty">No new notifications</div>';
  btn.parentElement.style.position = 'relative';
  btn.parentElement.appendChild(dropdown);

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var dd = document.getElementById('notification-dropdown');
    dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  });

  document.addEventListener('click', function() {
    var dd = document.getElementById('notification-dropdown');
    if (dd) dd.style.display = 'none';
  });
}

function showEmptyState() {
  var container = document.getElementById('requests-list');
  if (container) {
    container.innerHTML = '<div class="empty-state"><p>No service requests yet.</p><a href="request.html" class="btn btn-primary">Submit Your First Request</a></div>';
  }
}

function populateServiceDropdown() {
  var serviceSelect = document.getElementById('req-service');
  if (!serviceSelect) return;
  // Only add if not already populated
  if (serviceSelect.options.length > 1) return;
  SERVICE_TYPES.forEach(function (type) {
    var opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type;
    serviceSelect.appendChild(opt);
  });
}

// ============================================
// DASHBOARD
// ============================================
async function initDashboard() {
  await loadDashboard();
}

async function loadDashboard() {
  try {
    var result = await supabase.auth.getUser();
    var user = result.data ? result.data.user : null;
    if (!user) { showEmptyState(); return; }

    var meta = user.user_metadata || {};
    var isAdmin = meta.role === 'admin';

    // Fetch requests
    var query = supabase.from('service_requests').select('*').order('created_at', { ascending: false });
    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    var response = await query;
    var requests = response.data || [];
    var error = response.error;

    if (error) {
      console.error('Dashboard query error:', error);
      showEmptyState();
      showToast('Error loading requests: ' + error.message, 'error');
      return;
    }

    renderStats(requests);
    renderRequestList(requests);
  } catch (err) {
    console.error('loadDashboard error:', err);
    showEmptyState();
  }
}

// Render stats cards
function renderStats(requests) {
  const total = requests.length;
  const inProgress = requests.filter(function (r) { return r.current_stage >= 4 && r.current_stage <= 6; }).length;
  const pending = requests.filter(function (r) { return r.current_stage <= 3; }).length;
  const completed = requests.filter(function (r) { return r.current_stage >= 7; }).length;

  var el;
  el = document.getElementById('stat-total'); if (el) el.textContent = total;
  el = document.getElementById('stat-progress'); if (el) el.textContent = inProgress;
  el = document.getElementById('stat-pending'); if (el) el.textContent = pending;
  el = document.getElementById('stat-completed'); if (el) el.textContent = completed;
}

// Render request cards
function renderRequestList(requests) {
  const container = document.getElementById('requests-list');
  if (!container) return;

  if (requests.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No service requests yet.</p><a href="request.html" class="btn btn-primary">Submit Your First Request</a></div>';
    return;
  }

  container.innerHTML = requests.map(function (r) {
    const stage = STAGES[r.current_stage - 1] || STAGES[0];
    const progress = ((r.current_stage) / 8) * 100;
    const date = new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const desc = r.description ? (r.description.length > 120 ? r.description.substring(0, 120) + '...' : r.description) : 'No description';
    const shortId = r.id ? r.id.substring(0, 8) : '';
    return '<div class="request-card" onclick="location.href=\'detail.html?id=' + r.id + '\'">' +
      '<div class="request-card-header">' +
        '<span class="service-type">' + escapeHtml(r.service_type) + '</span>' +
        '<span class="status-badge" style="background:' + stage.color + '">' + stage.name + '</span>' +
      '</div>' +
      '<p class="request-desc">' + escapeHtml(desc) + '</p>' +
      '<div class="progress-bar-container">' +
        '<div class="progress-bar" style="width:' + progress + '%;background:' + stage.color + '"></div>' +
      '</div>' +
      '<div class="request-card-footer">' +
        '<span class="request-date">' + date + '</span>' +
        '<span class="request-id">#' + shortId + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ============================================
// NEW REQUEST FORM
// ============================================
function initRequestForm() {
  const form = document.getElementById('request-form');
  if (form) {
    form.addEventListener('submit', submitRequest);
  }

  // Populate service types dropdown
  const serviceSelect = document.getElementById('req-service');
  if (serviceSelect) {
    SERVICE_TYPES.forEach(function (type) {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      serviceSelect.appendChild(opt);
    });
  }
}

async function submitRequest(e) {
  e.preventDefault();

  try {
    var userResult = await supabase.auth.getUser();
    var user = userResult.data ? userResult.data.user : null;
    if (!user) {
      showToast('You must be logged in to submit a request.', 'error');
      return;
    }

    var serviceType = document.getElementById('req-service').value;
    var description = document.getElementById('req-description').value;
    var budget = document.getElementById('req-budget').value;
    var timeline = document.getElementById('req-timeline').value;
    var priority = document.getElementById('req-priority').value;

    if (!serviceType || !description) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    showLoading(true);
    var meta = user.user_metadata || {};

    var insertResult = await supabase.from('service_requests').insert({
      user_id: user.id,
      user_email: user.email,
      company_name: meta.company_name || '',
      contact_name: meta.contact_name || '',
      service_type: serviceType,
      description: description,
      budget_range: budget,
      timeline: timeline,
      priority: priority,
      current_stage: 1
    }).select().single();

    showLoading(false);

    if (insertResult.error) {
      console.error('Insert error:', insertResult.error);
      showToast('Error submitting request: ' + insertResult.error.message, 'error');
      return;
    }

    var data = insertResult.data;
    console.log('Request created:', data);

    // Add first timeline entry
    await supabase.from('request_timeline').insert({
      request_id: data.id,
      stage: 1,
      title: 'Request Submitted',
      description: 'Service request has been submitted and is awaiting review.',
      created_by: user.email
    });

    showToast('Request submitted successfully! Redirecting...', 'success');
    setTimeout(function () { window.location.href = 'dashboard.html'; }, 2000);
  } catch (err) {
    showLoading(false);
    console.error('submitRequest error:', err);
    showToast('Unexpected error: ' + err.message, 'error');
  }
}

// ============================================
// REQUEST DETAIL
// ============================================
var currentRequestId = null;

async function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    window.location.href = 'dashboard.html';
    return;
  }
  currentRequestId = id;
  await loadRequestDetail();

  // Setup message send
  const sendBtn = document.getElementById('send-message-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function () { sendMessage(currentRequestId); });
  }

  const msgInput = document.getElementById('message-input');
  if (msgInput) {
    msgInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(currentRequestId);
      }
    });
  }

  // Admin controls
  const { data: { user } } = await supabase.auth.getUser();
  const meta = user.user_metadata || {};
  const isAdmin = meta.role === 'admin';
  const adminControls = document.getElementById('admin-controls');
  if (adminControls) {
    adminControls.style.display = isAdmin ? 'flex' : 'none';
  }

  const stageSelect = document.getElementById('admin-stage-select');
  if (stageSelect && isAdmin) {
    stageSelect.addEventListener('change', function () {
      const newStage = parseInt(stageSelect.value);
      if (newStage) updateStage(currentRequestId, newStage);
    });
  }
}

async function loadRequestDetail() {
  const { data: request, error } = await supabase.from('service_requests').select('*').eq('id', currentRequestId).single();
  if (error || !request) {
    showToast('Request not found', 'error');
    return;
  }

  renderRequestDetail(request);

  // Load timeline
  const { data: timeline } = await supabase.from('request_timeline').select('*').eq('request_id', currentRequestId).order('created_at', { ascending: true });
  renderTimeline(timeline || []);

  // Load messages
  const { data: messages } = await supabase.from('request_messages').select('*').eq('request_id', currentRequestId).order('created_at', { ascending: true });
  renderMessages(messages || []);
}

function renderRequestDetail(request) {
  const stage = STAGES[request.current_stage - 1] || STAGES[0];

  var el;
  el = document.getElementById('detail-service-type'); if (el) el.textContent = request.service_type;
  el = document.getElementById('detail-status');
  if (el) { el.textContent = stage.name; el.style.background = stage.color; }
  el = document.getElementById('detail-description'); if (el) el.textContent = request.description;
  el = document.getElementById('detail-budget'); if (el) el.textContent = request.budget_range || 'Not specified';
  el = document.getElementById('detail-timeline-pref'); if (el) el.textContent = request.timeline || 'Not specified';
  el = document.getElementById('detail-priority'); if (el) el.textContent = request.priority || 'Normal';
  el = document.getElementById('detail-date'); if (el) el.textContent = new Date(request.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  el = document.getElementById('detail-id'); if (el) el.textContent = request.id;
  el = document.getElementById('detail-company'); if (el) el.textContent = request.company_name || '-';
  el = document.getElementById('detail-contact'); if (el) el.textContent = request.contact_name || '-';

  // Set admin stage selector
  var stageSelect = document.getElementById('admin-stage-select');
  if (stageSelect) stageSelect.value = request.current_stage;

  // Render progress steps
  const stepsContainer = document.getElementById('progress-steps');
  if (stepsContainer) {
    stepsContainer.innerHTML = STAGES.map(function (s, i) {
      const active = i < request.current_stage;
      const current = i === request.current_stage - 1;
      return '<div class="step ' + (active ? 'active' : '') + ' ' + (current ? 'current' : '') + '">' +
        '<div class="step-dot"></div>' +
        '<span class="step-label">' + s.name + '</span>' +
      '</div>';
    }).join('');
  }
}

function renderTimeline(timeline) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  if (timeline.length === 0) {
    container.innerHTML = '<p style="color:var(--color-text-secondary);font-size:0.875rem;">No timeline events yet.</p>';
    return;
  }

  container.innerHTML = timeline.map(function (t) {
    const date = new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return '<div class="timeline-item">' +
      '<div class="timeline-dot"></div>' +
      '<div class="timeline-content">' +
        '<h4>' + escapeHtml(t.title) + '</h4>' +
        '<p>' + escapeHtml(t.description) + '</p>' +
        '<span class="timeline-date">' + date + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderMessages(messages) {
  const container = document.getElementById('messages-container');
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = '<p style="color:var(--color-text-secondary);font-size:0.875rem;text-align:center;padding:2rem 0;">No messages yet. Start a conversation below.</p>';
    return;
  }

  container.innerHTML = messages.map(function (m) {
    const date = new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const isAdmin = m.sender_role === 'admin';
    return '<div class="message ' + (isAdmin ? 'message-admin' : 'message-client') + '">' +
      '<div class="message-header">' +
        '<strong>' + escapeHtml(m.sender_name) + '</strong>' +
        '<span>' + date + '</span>' +
      '</div>' +
      '<p>' + escapeHtml(m.content) + '</p>' +
    '</div>';
  }).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Send message
async function sendMessage(requestId) {
  const input = document.getElementById('message-input');
  const content = input.value.trim();
  if (!content) return;

  const { data: { user } } = await supabase.auth.getUser();
  const meta = user.user_metadata || {};
  const isAdmin = meta.role === 'admin';

  const { error } = await supabase.from('request_messages').insert({
    request_id: requestId,
    sender_id: user.id,
    sender_name: meta.contact_name || user.email,
    sender_role: isAdmin ? 'admin' : 'client',
    content: content
  });

  if (error) {
    showToast('Error sending message', 'error');
    return;
  }
  input.value = '';
  await loadRequestDetail();
}

// Admin: update stage
async function updateStage(requestId, newStage) {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('service_requests').update({
    current_stage: newStage,
    updated_at: new Date().toISOString()
  }).eq('id', requestId);

  if (error) {
    showToast('Error: ' + error.message, 'error');
    return;
  }

  // Add timeline entry
  const stage = STAGES[newStage - 1];
  await supabase.from('request_timeline').insert({
    request_id: requestId,
    stage: newStage,
    title: 'Stage Updated: ' + stage.name,
    description: 'Request moved to ' + stage.name + ' stage.',
    created_by: user.email
  });

  showToast('Stage updated!', 'success');
  await loadRequestDetail();
}

// ============================================
// ADMIN PANEL
// ============================================
var allAdminRequests = [];

async function initAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  const meta = user.user_metadata || {};

  if (meta.role !== 'admin') {
    showToast('Access denied. Admin only.', 'error');
    setTimeout(function () { window.location.href = 'dashboard.html'; }, 1500);
    return;
  }

  await loadAdminRequests();

  // Setup filters
  const statusFilter = document.getElementById('filter-status');
  const serviceFilter = document.getElementById('filter-service');

  if (statusFilter) statusFilter.addEventListener('change', applyAdminFilters);
  if (serviceFilter) serviceFilter.addEventListener('change', applyAdminFilters);

  // Populate service filter
  if (serviceFilter) {
    SERVICE_TYPES.forEach(function (type) {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      serviceFilter.appendChild(opt);
    });
  }
}

async function loadAdminRequests() {
  const { data: requests, error } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });

  if (error) {
    showToast('Error: ' + error.message, 'error');
    return;
  }

  allAdminRequests = requests || [];
  renderAdminTable(allAdminRequests);
  renderAdminStats(allAdminRequests);
}

function applyAdminFilters() {
  const statusVal = document.getElementById('filter-status').value;
  const serviceVal = document.getElementById('filter-service').value;

  var filtered = allAdminRequests;

  if (statusVal) {
    const stageNum = parseInt(statusVal);
    filtered = filtered.filter(function (r) { return r.current_stage === stageNum; });
  }

  if (serviceVal) {
    filtered = filtered.filter(function (r) { return r.service_type === serviceVal; });
  }

  renderAdminTable(filtered);
}

function renderAdminStats(requests) {
  var el;
  el = document.getElementById('admin-stat-total'); if (el) el.textContent = requests.length;
  el = document.getElementById('admin-stat-active');
  if (el) el.textContent = requests.filter(function (r) { return r.current_stage >= 1 && r.current_stage <= 6; }).length;
  el = document.getElementById('admin-stat-completed');
  if (el) el.textContent = requests.filter(function (r) { return r.current_stage >= 7; }).length;
  el = document.getElementById('admin-stat-urgent');
  if (el) el.textContent = requests.filter(function (r) { return r.priority === 'Urgent' || r.priority === 'High'; }).length;
}

function renderAdminTable(requests) {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  if (requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--color-text-secondary);">No requests found.</td></tr>';
    return;
  }

  tbody.innerHTML = requests.map(function (r) {
    const stage = STAGES[r.current_stage - 1] || STAGES[0];
    const date = new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const priorityColor = r.priority === 'Urgent' ? '#ef4444' : r.priority === 'High' ? '#f97316' : r.priority === 'Low' ? '#94a3b8' : '#3da5d9';
    return '<tr onclick="location.href=\'detail.html?id=' + r.id + '\'">' +
      '<td>' + escapeHtml(r.company_name || '-') + '</td>' +
      '<td>' + escapeHtml(r.user_email || '-') + '</td>' +
      '<td>' + escapeHtml(r.service_type) + '</td>' +
      '<td><span class="status-badge" style="background:' + stage.color + '">' + stage.name + '</span></td>' +
      '<td>' + date + '</td>' +
      '<td><span style="color:' + priorityColor + ';font-weight:600;">' + (r.priority || 'Normal') + '</span></td>' +
      '<td><span class="request-id">#' + (r.id ? r.id.substring(0, 8) : '') + '</span></td>' +
    '</tr>';
  }).join('');
}

// ============================================
// SETTINGS
// ============================================
async function initSettings() {
  var result = await supabase.auth.getUser();
  var user = result.data ? result.data.user : null;
  if (!user) return;

  var meta = user.user_metadata || {};

  // Populate fields
  var nameInput = document.getElementById('settings-name');
  var companyInput = document.getElementById('settings-company');
  var emailDisplay = document.getElementById('settings-email');
  var langSelect = document.getElementById('settings-language');
  var avatarPreview = document.getElementById('settings-avatar');
  var colorInputs = document.querySelectorAll('input[name="avatar-color"]');

  if (nameInput) nameInput.value = meta.contact_name || '';
  if (companyInput) companyInput.value = meta.company_name || '';
  if (emailDisplay) emailDisplay.textContent = user.email;
  if (langSelect) langSelect.value = localStorage.getItem('portalLang') || localStorage.getItem('language') || 'en';

  // Avatar preview
  if (avatarPreview) {
    avatarPreview.textContent = getInitials(meta.contact_name || meta.company_name || user.email);
    avatarPreview.style.background = meta.avatar_color || '#3da5d9';
  }

  // Color selection
  colorInputs.forEach(function(input) {
    if (input.value === (meta.avatar_color || '#3da5d9')) input.checked = true;
    input.addEventListener('change', function() {
      if (avatarPreview) avatarPreview.style.background = this.value;
    });
  });

  // Language change
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      localStorage.setItem('portalLang', this.value);
      localStorage.setItem('language', this.value);
    });
  }

  // Dark mode toggle
  var darkToggle = document.getElementById('settings-darkmode');
  if (darkToggle) {
    darkToggle.checked = localStorage.getItem('darkMode') === 'true';
    darkToggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'false');
      }
    });
  }

  // Save button
  var saveBtn = document.getElementById('settings-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      var selectedColor = '#3da5d9';
      colorInputs.forEach(function(input) { if (input.checked) selectedColor = input.value; });

      showLoading(true);
      var result = await supabase.auth.updateUser({
        data: {
          contact_name: nameInput.value,
          company_name: companyInput.value,
          avatar_color: selectedColor,
          preferred_language: langSelect.value
        }
      });
      showLoading(false);

      if (result.error) {
        showToast('Error saving settings: ' + result.error.message, 'error');
      } else {
        showToast('Settings saved successfully!', 'success');
      }
    });
  }
}

// ============================================
// UTILITIES
// ============================================
function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
