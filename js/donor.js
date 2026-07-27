/*
 * donor.js
 * ---------------------------------------------------------------------------
 * Page logic for donors.html: registering, listing, editing and deleting
 * organ donors. All persistence goes through storage.js and all shared UI
 * helpers come from common.js.
 * ---------------------------------------------------------------------------
 */

// Holds the id of the donor currently being edited, or null when the form is
// in "add new" mode.
var editingDonorId = null;

/** Wire up the page once the DOM is ready. */
function initDonorPage() {
  renderNavbar('donors');
  populateSelect('donorGender', GENDERS, 'Select gender');
  populateSelect('donorBloodGroup', BLOOD_GROUPS, 'Select blood group');
  populateSelect('donorOrgan', ORGANS, 'Select organ');

  document.getElementById('donorForm').addEventListener('submit', handleDonorSubmit);
  document.getElementById('donorForm').addEventListener('reset', handleDonorReset);

  renderDonorTable();
}

/** Read the form, validate it, then create or update a donor record. */
function handleDonorSubmit(event) {
  event.preventDefault();

  var donor = {
    name: document.getElementById('donorName').value.trim(),
    age: document.getElementById('donorAge').value.trim(),
    gender: document.getElementById('donorGender').value,
    bloodGroup: document.getElementById('donorBloodGroup').value,
    phone: document.getElementById('donorPhone').value.trim(),
    address: document.getElementById('donorAddress').value.trim(),
    organ: document.getElementById('donorOrgan').value,
    medicalCondition: document.getElementById('donorMedical').value.trim()
  };

  var error = validateDonor(donor);
  if (error) {
    showAlert('donorAlert', error, 'danger');
    return;
  }

  var message;
  if (editingDonorId) {
    updateDonor(editingDonorId, donor);
    message = 'Donor ' + editingDonorId + ' updated successfully.';
  } else {
    var saved = addDonor(donor);
    message = 'Donor registered successfully with ID ' + saved.id + '.';
  }

  // Reset the form first (its reset event clears the alert area) and only then
  // show the success message so the confirmation is not wiped out.
  resetDonorForm();
  renderDonorTable();
  showAlert('donorAlert', message, 'success');
}

/**
 * Validate a donor object. Returns an error message string, or null when the
 * record is valid. Medical condition is optional; every other field required.
 */
function validateDonor(donor) {
  if (!isNotEmpty(donor.name)) {
    return 'Full Name is required.';
  }
  if (!isNotEmpty(donor.age)) {
    return 'Age is required.';
  }
  if (!isValidAge(donor.age)) {
    return 'Age must be a number between 1 and 120.';
  }
  if (!isNotEmpty(donor.gender)) {
    return 'Please select a gender.';
  }
  if (!isNotEmpty(donor.bloodGroup)) {
    return 'Please select a blood group.';
  }
  if (!isNotEmpty(donor.phone)) {
    return 'Phone Number is required.';
  }
  if (!isDigitsOnly(donor.phone)) {
    return 'Phone Number must contain digits only.';
  }
  if (!isNotEmpty(donor.address)) {
    return 'Address is required.';
  }
  if (!isNotEmpty(donor.organ)) {
    return 'Please select an organ to donate.';
  }
  return null;
}

/** Draw the table of registered donors below the form. */
function renderDonorTable() {
  var donors = getDonors();
  var tbody = document.getElementById('donorTableBody');
  var emptyMessage = document.getElementById('donorEmpty');
  var countBadge = document.getElementById('donorCount');

  if (countBadge) {
    countBadge.textContent = donors.length;
  }

  if (donors.length === 0) {
    tbody.innerHTML = '';
    emptyMessage.classList.remove('d-none');
    return;
  }
  emptyMessage.classList.add('d-none');

  tbody.innerHTML = donors.map(function (donor) {
    return '<tr>' +
      '<td>' + escapeHtml(donor.id) + '</td>' +
      '<td>' + escapeHtml(donor.name) + '</td>' +
      '<td>' + escapeHtml(donor.age) + '</td>' +
      '<td>' + escapeHtml(donor.gender) + '</td>' +
      '<td>' + escapeHtml(donor.bloodGroup) + '</td>' +
      '<td>' + escapeHtml(donor.phone) + '</td>' +
      '<td>' + escapeHtml(donor.organ) + '</td>' +
      '<td>' + escapeHtml(donor.medicalCondition || '-') + '</td>' +
      '<td class="text-nowrap">' +
        '<button class="btn btn-sm btn-outline-primary me-1" onclick="startEditDonor(\'' + donor.id + '\')">Edit</button>' +
        '<button class="btn btn-sm btn-outline-danger" onclick="removeDonor(\'' + donor.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

/** Load a donor's values back into the form for editing. */
function startEditDonor(id) {
  var donor = getDonorById(id);
  if (!donor) {
    return;
  }
  editingDonorId = id;

  document.getElementById('donorId').value = donor.id;
  document.getElementById('donorName').value = donor.name;
  document.getElementById('donorAge').value = donor.age;
  document.getElementById('donorGender').value = donor.gender;
  document.getElementById('donorBloodGroup').value = donor.bloodGroup;
  document.getElementById('donorPhone').value = donor.phone;
  document.getElementById('donorAddress').value = donor.address;
  document.getElementById('donorOrgan').value = donor.organ;
  document.getElementById('donorMedical').value = donor.medicalCondition || '';

  document.getElementById('donorSubmitBtn').textContent = 'Update';
  showAlert('donorAlert', 'Editing donor ' + id + '. Make changes and click Update.', 'info');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Delete a donor after confirmation and refresh the table. */
function removeDonor(id) {
  if (!window.confirm('Delete donor ' + id + '? This cannot be undone.')) {
    return;
  }
  deleteDonor(id);
  // If we were editing the record we just deleted, leave edit mode.
  if (editingDonorId === id) {
    resetDonorForm();
  }
  showAlert('donorAlert', 'Donor ' + id + ' deleted.', 'success');
  renderDonorTable();
}

/** Handle the native form reset button (also leaves edit mode). */
function handleDonorReset() {
  editingDonorId = null;
  document.getElementById('donorId').value = 'Auto Generated';
  document.getElementById('donorSubmitBtn').textContent = 'Save';
  clearAlert('donorAlert');
}

/** Clear the form fields and return to "add new" mode. */
function resetDonorForm() {
  document.getElementById('donorForm').reset();
  editingDonorId = null;
  document.getElementById('donorId').value = 'Auto Generated';
  document.getElementById('donorSubmitBtn').textContent = 'Save';
}

document.addEventListener('DOMContentLoaded', initDonorPage);
