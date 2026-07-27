/*
 * common.js
 * ---------------------------------------------------------------------------
 * Shared helpers used by every page: the navigation bar, alert messages,
 * simple validation utilities and HTML escaping.
 *
 * Keeping these in one file avoids duplicating the same markup and logic
 * across the five HTML pages.
 * ---------------------------------------------------------------------------
 */

/* Master lists used by the drop-down menus on the forms. Declared once here
 * so donor.js and recipient.js share the same options. */
var BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
var ORGANS = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea', 'Bone Marrow', 'Skin'];
var GENDERS = ['Male', 'Female', 'Other'];

/**
 * Build the shared navigation bar and insert it into the element with
 * id="mainNav". The link matching `activePage` is highlighted.
 *
 * @param {string} activePage - one of: dashboard, donors, recipients,
 *                              search, about
 */
function renderNavbar(activePage) {
  var links = [
    { key: 'dashboard', label: 'Dashboard', href: 'index.html' },
    { key: 'donors', label: 'Donors', href: 'donors.html' },
    { key: 'recipients', label: 'Recipients', href: 'recipients.html' },
    { key: 'search', label: 'Search', href: 'search.html' },
    { key: 'about', label: 'About', href: 'about.html' }
  ];

  var items = links.map(function (link) {
    var activeClass = link.key === activePage ? ' active' : '';
    var ariaCurrent = link.key === activePage ? ' aria-current="page"' : '';
    return '<li class="nav-item">' +
      '<a class="nav-link' + activeClass + '"' + ariaCurrent + ' href="' + link.href + '">' +
      link.label + '</a></li>';
  }).join('');

  var html =
    '<nav class="navbar navbar-expand-lg navbar-dark bg-primary">' +
      '<div class="container">' +
        '<a class="navbar-brand d-flex align-items-center" href="index.html">' +
          '<img src="assets/logo.png" alt="Logo" width="32" height="32" class="me-2">' +
          '<span>Organ Donor Registry</span>' +
        '</a>' +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" ' +
          'data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" ' +
          'aria-label="Toggle navigation">' +
          '<span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="navMenu">' +
          '<ul class="navbar-nav ms-auto mb-2 mb-lg-0">' + items + '</ul>' +
        '</div>' +
      '</div>' +
    '</nav>';

  var container = document.getElementById('mainNav');
  if (container) {
    container.innerHTML = html;
  }
}

/**
 * Show a dismissible Bootstrap alert inside the given container element.
 *
 * @param {string} containerId - id of the element to place the alert in
 * @param {string} message     - text to display
 * @param {string} type        - Bootstrap contextual type: success, danger, ...
 */
function showAlert(containerId, message, type) {
  var container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML =
    '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
      escapeHtml(message) +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
}

/** Remove any alert currently shown in the given container. */
function clearAlert(containerId) {
  var container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
}

/**
 * Escape a value so it can be safely placed inside HTML. Prevents broken
 * markup (and basic injection) when a record contains characters like < or &.
 */
function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* -------------------------------------------------------------------------
 * Validation helpers
 * ---------------------------------------------------------------------- */

/** True when a value is not empty after trimming whitespace. */
function isNotEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/** True when the trimmed value is a positive whole number (used for age). */
function isValidAge(value) {
  var text = String(value).trim();
  return /^\d+$/.test(text) && Number(text) > 0 && Number(text) <= 120;
}

/** True when the trimmed value contains digits only (used for phone). */
function isDigitsOnly(value) {
  return /^\d+$/.test(String(value).trim());
}

/**
 * Fill a <select> element with <option> tags built from an array of strings.
 *
 * @param {string} selectId      - id of the select element
 * @param {string[]} options     - option values / labels
 * @param {string} placeholder   - text for the disabled first option
 */
function populateSelect(selectId, options, placeholder) {
  var select = document.getElementById(selectId);
  if (!select) {
    return;
  }
  var html = '<option value="" selected disabled>' + escapeHtml(placeholder) + '</option>';
  html += options.map(function (option) {
    return '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</option>';
  }).join('');
  select.innerHTML = html;
}
