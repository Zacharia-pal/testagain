// ============================================
// AZ Khonnect Client Portal — auth.js
// Authentication + i18n + GDPR
// ============================================

// ---------- Portal Translations ----------
var portalI18n = {
  en: {
    subtitle: 'Client Portal',
    tabLogin: 'Login',
    tabRegister: 'Register',
    lblEmail: 'Email Address',
    lblPassword: 'Password',
    lblConfirm: 'Confirm Password',
    lblCompany: 'Company Name',
    lblName: 'Contact Name',
    phEmail: 'you@company.com',
    phPassword: 'Enter your password',
    phPasswordMin: 'Min. 8 characters',
    phConfirm: 'Repeat password',
    phCompany: 'Your company name',
    phName: 'Full name',
    btnLogin: 'Login',
    btnRegister: 'Create Account',
    forgot: 'Forgot password?',
    gdpr: 'I consent to AZ Khonnect processing my personal data for the purpose of providing IT services and client communication, in accordance with',
    gdprLink: 'GDPR regulations',
    terms: 'I accept the',
    termsLink: 'General Terms & Conditions',
    pwTitle: 'Password requirements:',
    reqLength: 'Minimum 8 characters',
    reqUpper: 'At least one uppercase letter',
    reqLower: 'At least one lowercase letter',
    reqNumber: 'At least one number',
    reqSpecial: 'At least one special character (!@#$%^&*)',
    successRegister: 'Registration successful! Please check your email to verify your account before logging in.',
    errorMatch: 'Passwords do not match',
    errorWeak: 'Password does not meet the requirements',
    errorGdpr: 'You must accept the privacy policy to register',
    errorTerms: 'You must accept the general terms & conditions',
    errorEmail: 'Please enter your email address first',
    successReset: 'Password reset email sent. Check your inbox.',
    errorNotVerified: 'Please verify your email before logging in. Check your inbox for the verification link.',
    errorLogin: 'Login failed. Please check your credentials or verify your email.',
  },
  nl: {
    subtitle: 'Klantenportaal',
    tabLogin: 'Inloggen',
    tabRegister: 'Registreren',
    lblEmail: 'E-mailadres',
    lblPassword: 'Wachtwoord',
    lblConfirm: 'Bevestig wachtwoord',
    lblCompany: 'Bedrijfsnaam',
    lblName: 'Contactpersoon',
    phEmail: 'u@bedrijf.com',
    phPassword: 'Voer uw wachtwoord in',
    phPasswordMin: 'Min. 8 tekens',
    phConfirm: 'Herhaal wachtwoord',
    phCompany: 'Uw bedrijfsnaam',
    phName: 'Volledige naam',
    btnLogin: 'Inloggen',
    btnRegister: 'Account aanmaken',
    forgot: 'Wachtwoord vergeten?',
    gdpr: 'Ik geef toestemming aan AZ Khonnect om mijn persoonsgegevens te verwerken voor het leveren van IT-diensten en klantcommunicatie, in overeenstemming met de',
    gdprLink: 'AVG-wetgeving',
    terms: 'Ik accepteer de',
    termsLink: 'Algemene Voorwaarden',
    pwTitle: 'Wachtwoordvereisten:',
    reqLength: 'Minimaal 8 tekens',
    reqUpper: 'Minstens een hoofdletter',
    reqLower: 'Minstens een kleine letter',
    reqNumber: 'Minstens een cijfer',
    reqSpecial: 'Minstens een speciaal teken (!@#$%^&*)',
    successRegister: 'Registratie geslaagd! Controleer uw e-mail om uw account te verifiëren voordat u inlogt.',
    errorMatch: 'Wachtwoorden komen niet overeen',
    errorWeak: 'Wachtwoord voldoet niet aan de vereisten',
    errorGdpr: 'U moet het privacybeleid accepteren om te registreren',
    errorTerms: 'U moet de algemene voorwaarden accepteren',
    errorEmail: 'Voer eerst uw e-mailadres in',
    successReset: 'E-mail voor wachtwoordherstel verzonden. Controleer uw inbox.',
    errorNotVerified: 'Verifieer uw e-mailadres voordat u inlogt. Controleer uw inbox voor de verificatielink.',
    errorLogin: 'Inloggen mislukt. Controleer uw gegevens of verifieer uw e-mail.',
  },
  fr: {
    subtitle: 'Portail Client',
    tabLogin: 'Connexion',
    tabRegister: "S'inscrire",
    lblEmail: 'Adresse e-mail',
    lblPassword: 'Mot de passe',
    lblConfirm: 'Confirmer le mot de passe',
    lblCompany: "Nom de l'entreprise",
    lblName: 'Nom du contact',
    phEmail: 'vous@entreprise.com',
    phPassword: 'Entrez votre mot de passe',
    phPasswordMin: 'Min. 8 caractères',
    phConfirm: 'Répétez le mot de passe',
    phCompany: 'Nom de votre entreprise',
    phName: 'Nom complet',
    btnLogin: 'Connexion',
    btnRegister: 'Créer un compte',
    forgot: 'Mot de passe oublié ?',
    gdpr: "Je consens au traitement de mes données personnelles par AZ Khonnect aux fins de prestation de services IT et de communication client, conformément au",
    gdprLink: 'RGPD',
    terms: "J'accepte les",
    termsLink: 'Conditions Générales',
    pwTitle: 'Exigences du mot de passe :',
    reqLength: 'Minimum 8 caractères',
    reqUpper: 'Au moins une lettre majuscule',
    reqLower: 'Au moins une lettre minuscule',
    reqNumber: 'Au moins un chiffre',
    reqSpecial: 'Au moins un caractère spécial (!@#$%^&*)',
    successRegister: 'Inscription réussie ! Veuillez vérifier votre e-mail pour activer votre compte avant de vous connecter.',
    errorMatch: 'Les mots de passe ne correspondent pas',
    errorWeak: 'Le mot de passe ne répond pas aux exigences',
    errorGdpr: 'Vous devez accepter la politique de confidentialité pour vous inscrire',
    errorTerms: 'Vous devez accepter les conditions générales',
    errorEmail: "Veuillez d'abord entrer votre adresse e-mail",
    successReset: 'E-mail de réinitialisation envoyé. Vérifiez votre boîte de réception.',
    errorNotVerified: 'Veuillez vérifier votre e-mail avant de vous connecter. Consultez votre boîte de réception.',
    errorLogin: 'Échec de la connexion. Vérifiez vos identifiants ou confirmez votre e-mail.',
  }
};

var currentPortalLang = localStorage.getItem('portalLang') || localStorage.getItem('language') || 'en';

function setPortalLang(lang) {
  currentPortalLang = lang;
  localStorage.setItem('portalLang', lang);
  applyPortalLang();
}

function applyPortalLang() {
  var t = portalI18n[currentPortalLang] || portalI18n.en;

  // Highlight active lang button
  document.querySelectorAll('.lang-btn').forEach(function(btn) { btn.classList.remove('active'); });
  var activeBtn = document.getElementById('lang-' + currentPortalLang);
  if (activeBtn) activeBtn.classList.add('active');

  // Apply texts
  setText('portal-subtitle', t.subtitle);
  setText('tab-login', t.tabLogin);
  setText('tab-register', t.tabRegister);
  setText('lbl-login-email', t.lblEmail);
  setText('lbl-login-password', t.lblPassword);
  setText('lbl-reg-company', t.lblCompany);
  setText('lbl-reg-name', t.lblName);
  setText('lbl-reg-email', t.lblEmail);
  setText('lbl-reg-password', t.lblPassword);
  setText('lbl-reg-confirm', t.lblConfirm);
  setText('btn-login', t.btnLogin);
  setText('btn-register', t.btnRegister);
  setText('forgot-password-link', t.forgot);
  setText('pw-reqs-title', t.pwTitle);
  setText('req-length', t.reqLength);
  setText('req-upper', t.reqUpper);
  setText('req-lower', t.reqLower);
  setText('req-number', t.reqNumber);
  setText('req-special', t.reqSpecial);

  // Placeholders
  setPlaceholder('login-email', t.phEmail);
  setPlaceholder('login-password', t.phPassword);
  setPlaceholder('reg-company', t.phCompany);
  setPlaceholder('reg-name', t.phName);
  setPlaceholder('reg-email', t.phEmail);
  setPlaceholder('reg-password', t.phPasswordMin);
  setPlaceholder('reg-confirm-password', t.phConfirm);

  // GDPR & Terms labels (contain links, so use innerHTML)
  var gdprLabel = document.getElementById('lbl-gdpr');
  if (gdprLabel) gdprLabel.innerHTML = t.gdpr + ' <a href="#" onclick="showModal(\'gdpr\')">' + t.gdprLink + '</a>.';
  var termsLabel = document.getElementById('lbl-terms');
  if (termsLabel) termsLabel.innerHTML = t.terms + ' <a href="#" onclick="showModal(\'terms\')">' + t.termsLink + '</a>.';
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setPlaceholder(id, text) {
  var el = document.getElementById(id);
  if (el) el.placeholder = text;
}

// ---------- Password Validation ----------
function validatePassword(pw) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)
  };
}

function updatePasswordIndicators(pw) {
  var v = validatePassword(pw);
  setReqClass('req-length', v.length);
  setReqClass('req-upper', v.upper);
  setReqClass('req-lower', v.lower);
  setReqClass('req-number', v.number);
  setReqClass('req-special', v.special);
}

function setReqClass(id, pass) {
  var el = document.getElementById(id);
  if (el) {
    el.className = pass ? 'req-pass' : 'req-fail';
  }
}

function isPasswordStrong(pw) {
  var v = validatePassword(pw);
  return v.length && v.upper && v.lower && v.number && v.special;
}

// ---------- Modal ----------
function showModal(type) {
  var modal = document.getElementById('modal-' + type);
  if (modal) modal.style.display = 'flex';
  return false;
}

function closeModal(type) {
  var modal = document.getElementById('modal-' + type);
  if (modal) modal.style.display = 'none';
}

// ---------- Main Init ----------
document.addEventListener('DOMContentLoaded', async function () {
  // Apply dark mode
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Apply language
  applyPortalLang();

  // Only run auth logic if we're in the /login/ section
  var path = window.location.pathname;
  if (path.indexOf('/login') === -1) return;

  if (!supabase) {
    console.error('Supabase client not initialized. Check CDN and config.');
    // Don't block the page — just disable auth features
    return;
  }

  // Check if user is logged in
  var session = null;
  try {
    var sessionResult = await supabase.auth.getSession();
    session = sessionResult.data ? sessionResult.data.session : null;
  } catch (err) {
    console.error('Session check failed:', err);
  }

  var isLoginPage = path.indexOf('index.html') > -1 || path.endsWith('/login/') || path.endsWith('/login');

  // If logged in and on login page, go to dashboard
  if (session && isLoginPage) {
    window.location.href = 'dashboard.html';
    return;
  }

  // If NOT logged in and on a protected page (not login page), go to login
  if (!session && !isLoginPage) {
    window.location.href = 'index.html';
    return;
  }

  // Password strength indicator
  var regPw = document.getElementById('reg-password');
  if (regPw) {
    regPw.addEventListener('input', function() {
      updatePasswordIndicators(this.value);
    });
  }

  // Setup login form
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var t = portalI18n[currentPortalLang] || portalI18n.en;
      var email = document.getElementById('login-email').value;
      var password = document.getElementById('login-password').value;
      showLoading(true);

      try {
        var result = await supabase.auth.signInWithPassword({ email: email, password: password });
        showLoading(false);

        if (result.error) {
          // Check if it's an email not confirmed error
          var errMsg = result.error.message || '';
          if (errMsg.toLowerCase().indexOf('not confirmed') > -1 || errMsg.toLowerCase().indexOf('email') > -1) {
            showToast(t.errorNotVerified, 'error');
          } else {
            showToast(t.errorLogin + ' (' + errMsg + ')', 'error');
          }
          return;
        }
        window.location.href = 'dashboard.html';
      } catch (err) {
        showLoading(false);
        showToast(t.errorLogin, 'error');
        console.error('Login error:', err);
      }
    });
  }

  // Setup register form
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var t = portalI18n[currentPortalLang] || portalI18n.en;
      var email = document.getElementById('reg-email').value;
      var password = document.getElementById('reg-password').value;
      var confirmPassword = document.getElementById('reg-confirm-password').value;
      var companyName = document.getElementById('reg-company').value;
      var contactName = document.getElementById('reg-name').value;
      var gdprConsent = document.getElementById('reg-gdpr').checked;
      var termsConsent = document.getElementById('reg-terms').checked;

      if (!gdprConsent) {
        showToast(t.errorGdpr, 'error');
        return;
      }

      if (!termsConsent) {
        showToast(t.errorTerms, 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast(t.errorMatch, 'error');
        return;
      }

      if (!isPasswordStrong(password)) {
        showToast(t.errorWeak, 'error');
        return;
      }

      showLoading(true);
      try {
        var result = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              company_name: companyName,
              contact_name: contactName,
              role: 'client',
              gdpr_consent: true,
              gdpr_consent_date: new Date().toISOString(),
              terms_accepted: true,
              terms_accepted_date: new Date().toISOString()
            }
          }
        });
        showLoading(false);

        if (result.error) {
          showToast(result.error.message, 'error');
          return;
        }

        // Show success message
        var successEl = document.getElementById('register-success');
        if (successEl) {
          successEl.textContent = t.successRegister;
          successEl.style.display = 'block';
        }
        showToast(t.successRegister, 'success');

        // Switch to login tab after delay
        setTimeout(function() { switchTab('login'); }, 3000);
      } catch (err) {
        showLoading(false);
        showToast('Registration error: ' + err.message, 'error');
        console.error('Register error:', err);
      }
    });
  }

  // Setup forgot password
  var forgotLink = document.getElementById('forgot-password-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', async function (e) {
      e.preventDefault();
      var t = portalI18n[currentPortalLang] || portalI18n.en;
      var email = document.getElementById('login-email').value;
      if (!email) {
        showToast(t.errorEmail, 'warning');
        return;
      }
      showLoading(true);
      var result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login/dashboard.html'
      });
      showLoading(false);
      if (result.error) {
        showToast(result.error.message, 'error');
      } else {
        showToast(t.successReset, 'success');
      }
    });
  }
});

// ---------- Tab switching ----------
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(function (t) { t.classList.remove('active'); });
  document.querySelectorAll('.auth-form').forEach(function (f) { f.classList.remove('active'); });
  var tabEl = document.querySelector('[data-tab="' + tab + '"]');
  if (tabEl) tabEl.classList.add('active');
  var formEl = document.getElementById(tab + '-form');
  if (formEl) formEl.classList.add('active');
  // Hide success message when switching
  var successEl = document.getElementById('register-success');
  if (successEl) successEl.style.display = 'none';
}

// ---------- Logout ----------
async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// ---------- Toast ----------
function showToast(message, type) {
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'info');
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function () { toast.classList.add('show'); }, 10);
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 300);
  }, 4000);
}

// ---------- Loading ----------
function showLoading(show) {
  var loader = document.getElementById('loading-overlay');
  if (loader) loader.style.display = show ? 'flex' : 'none';
}

// ---------- Dark mode ----------
function toggleDarkMode() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('darkMode', 'false');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkMode', 'true');
  }
}
