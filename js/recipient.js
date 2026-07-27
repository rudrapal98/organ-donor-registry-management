/*
 * recipient.js
 * ---------------------------------------------------------------------------
 * Page logic for recipients.html: registering, listing, editing and deleting
 * organ recipients. Persistence goes through storage.js; UI helpers come from
 * common.js.
 * ---------------------------------------------------------------------------
 */

// Id of the recipient currently being edited, or null in "add new" mode.
var editingRecipientId = null;

/** Wire up the page once the DOM is ready. */
function initRecipientPage() {
  renderNavbar('recipients');
  populateSelect('recipientGender', GENDERS, 'Select gender');
  populateSelect('recipientBloodGroup', BLOOD_GROUPS, 'Select blood group');
  populateSelect('recipientOrgan', ORGANS, 'Select required organ');

  document.getElementById('recipientForm').addEventListener('submit', handleRecipientSubmit);
  document.getElementById('recipientForm').addEventListener('reset', handleRecipientReset);

  renderRecipientTable();
}

/** Read the form, validate it, then create or update a recipient record. */
function handleRecipientSubmit(event) {
  event.preventDefault();

  var recipient = {
    name: document.getElementById('recipientName').value.trim(),
    age: document.getElementById('recipientAge').value.trim(),
    gender: document.getElementById('recipientGender').value,
    bloodGroup: document.getElementById('recipientBloodGroup').value,
    organ: document.getElementById('recipientOrgan').value,
    hospital: document.getElementById('recipientHospital').value.trim()
  };

  var error = validateRecipient(recipient);
  if (error) {
    showAlert('recipientAlert', error, 'danger');
    return;
  }

  var message;
  if (editingRecipientId) {
    updateRecipient(editingRecipientId, recipient);
    message = 'Recipient ' + editingRecipientId + ' updated successfully.';
  } else {
    var saved = addRecipient(recipient);
    message = 'Recipient registered successfully with ID ' + saved.id + '.';
  }

  // Reset the form first (its reset event clears the alert area) and only then
  // show the success message so the confirmation is not wiped out.
  resetRecipientForm();
  renderRecipientTable();
  showAlert('recipientAlert', message, 'success');
}

/**
 * Validate a recipient object. Returns an error message string, or null when
 * the record is valid. Every field is required.
 */
function validateRecipient(recipient) {
  if (!isNotEmpty(recipient.name)) {
    return 'Full Name is required.';
  }
  if (!isNotEmpty(recipient.age)) {
    return 'Age is required.';
  }
  if (!isValidAge(recipient.age)) {
    return 'Age must be a number between 1 and 120.';
  }
  if (!isNotEmpty(recipient.gender)) {
    return 'Please select a gender.';
  }
  if (!isNotEmpty(recipient.bloodGroup)) {
    return 'Please select a blood group.';
  }
  if (!isNotEmpty(recipient.organ)) {
    return 'Please select a required organ.';
  }
  if (!isNotEmpty(recipient.hospital)) {
    return 'Hospital Name is required.';
  }
  return null;
}

/** Draw the table of registered recipients below the form. */
function renderRecipientTable() {
  var recipients = getRecipients();
  var tbody = document.getElementById('recipientTableBody');
  var emptyMessage = document.getElementById('recipientEmpty');
  var countBadge = document.getElementById('recipientCount');

  if (countBadge) {
    countBadge.textContent = recipients.length;
  }

  if (recipients.length === 0) {
    tbody.innerHTML = '';
    emptyMessage.classList.remove('d-none');
    return;
  }
  emptyMessage.classList.add('d-none');

  tbody.innerHTML = recipients.map(function (recipient) {
    return '<tr>' +
      '<td>' + escapeHtml(recipient.id) + '</td>' +
      '<td>' + escapeHtml(recipient.name) + '</td>' +
      '<td>' + escapeHtml(recipient.age) + '</td>' +
      '<td>' + escapeHtml(recipient.gender) + '</td>' +
      '<td>' + escapeHtml(recipient.bloodGroup) + '</td>' +
      '<td>' + escapeHtml(recipient.organ) + '</td>' +
      '<td>' + escapeHtml(recipient.hospital) + '</td>' +
      '<td class="text-nowrap">' +
        '<button class="btn btn-sm btn-outline-primary me-1" onclick="startEditRecipient(\'' + recipient.id + '\')">Edit</button>' +
        '<button class="btn btn-sm btn-outline-danger" onclick="removeRecipient(\'' + recipient.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

/** Load a recipient's values back into the form for editing. */
function startEditRecipient(id) {
  var recipient = getRecipientById(id);
  if (!recipient) {
    return;
  }
  editingRecipientId = id;

  document.getElementById('recipientId').value = recipient.id;
  document.getElementById('recipientName').value = recipient.name;
  document.getElementById('recipientAge').value = recipient.age;
  document.getElementById('recipientGender').value = recipient.gender;
  document.getElementById('recipientBloodGroup').value = recipient.bloodGroup;
  document.getElementById('recipientOrgan').value = recipient.organ;
  document.getElementById('recipientHospital').value = recipient.hospital;

  document.getElementById('recipientSubmitBtn').textContent = 'Update';
  showAlert('recipientAlert', 'Editing recipient ' + id + '. Make changes and click Update.', 'info');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Delete a recipient after confirmation and refresh the table. */
function removeRecipient(id) {
  if (!window.confirm('Delete recipient ' + id + '? This cannot be undone.')) {
    return;
  }
  deleteRecipient(id);
  if (editingRecipientId === id) {
    resetRecipientForm();
  }
  showAlert('recipientAlert', 'Recipient ' + id + ' deleted.', 'success');
  renderRecipientTable();
}

/** Handle the native form reset button (also leaves edit mode). */
function handleRecipientReset() {
  editingRecipientId = null;
  document.getElementById('recipientId').value = 'Auto Generated';
  document.getElementById('recipientSubmitBtn').textContent = 'Save';
  clearAlert('recipientAlert');
}

/** Clear the form fields and return to "add new" mode. */
function resetRecipientForm() {
  document.getElementById('recipientForm').reset();
  editingRecipientId = null;
  document.getElementById('recipientId').value = 'Auto Generated';
  document.getElementById('recipientSubmitBtn').textContent = 'Save';
}

document.addEventListener('DOMContentLoaded', initRecipientPage);
