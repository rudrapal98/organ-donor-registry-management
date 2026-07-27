/*
 * storage.js
 * ---------------------------------------------------------------------------
 * Data-access layer for the Organ Donor Registry Management System.
 *
 * This module is the ONLY place that talks to the browser localStorage.
 * Every other script (donor.js, recipient.js, search.js) works through the
 * functions exposed here so that the storage details live in a single file.
 *
 * Two collections are persisted:
 *   - donors      -> localStorage key "odr_donors"
 *   - recipients  -> localStorage key "odr_recipients"
 *
 * Auto-incrementing counters are kept so that IDs stay unique even after a
 * record is deleted.
 * ---------------------------------------------------------------------------
 */

// Keys used inside localStorage. Prefixed with "odr_" (Organ Donor Registry)
// to avoid clashing with anything else stored by the browser for this origin.
const STORAGE_KEYS = {
  DONORS: 'odr_donors',
  RECIPIENTS: 'odr_recipients',
  DONOR_SEQ: 'odr_donor_seq',
  RECIPIENT_SEQ: 'odr_recipient_seq'
};

/**
 * Read an array-based collection from localStorage.
 * Returns an empty array when the key is missing or the stored value is
 * corrupt, so callers never have to guard against null / parse errors.
 */
function readCollection(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // If the data cannot be parsed we fall back to an empty list instead of
    // breaking the whole page.
    return [];
  }
}

/** Persist an array-based collection back into localStorage. */
function writeCollection(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

/* -------------------------------------------------------------------------
 * Donor collection
 * ---------------------------------------------------------------------- */

/** Return the full list of donor records. */
function getDonors() {
  return readCollection(STORAGE_KEYS.DONORS);
}

/** Save the full list of donor records. */
function saveDonors(donors) {
  writeCollection(STORAGE_KEYS.DONORS, donors);
}

/**
 * Generate the next donor ID in the form "DNR-0001".
 * A dedicated sequence counter guarantees uniqueness across deletions.
 */
function generateDonorId() {
  const next = Number(localStorage.getItem(STORAGE_KEYS.DONOR_SEQ) || '0') + 1;
  localStorage.setItem(STORAGE_KEYS.DONOR_SEQ, String(next));
  return 'DNR-' + String(next).padStart(4, '0');
}

/** Add a new donor record and return it. */
function addDonor(donor) {
  const donors = getDonors();
  donor.id = generateDonorId();
  donors.push(donor);
  saveDonors(donors);
  return donor;
}

/** Update an existing donor (matched by id). Returns true when found. */
function updateDonor(id, updatedFields) {
  const donors = getDonors();
  const index = donors.findIndex(function (d) { return d.id === id; });
  if (index === -1) {
    return false;
  }
  donors[index] = Object.assign({}, donors[index], updatedFields, { id: id });
  saveDonors(donors);
  return true;
}

/** Delete a donor by id. Returns true when a record was removed. */
function deleteDonor(id) {
  const donors = getDonors();
  const remaining = donors.filter(function (d) { return d.id !== id; });
  saveDonors(remaining);
  return remaining.length !== donors.length;
}

/** Look up a single donor by id (or undefined). */
function getDonorById(id) {
  return getDonors().find(function (d) { return d.id === id; });
}

/* -------------------------------------------------------------------------
 * Recipient collection
 * ---------------------------------------------------------------------- */

/** Return the full list of recipient records. */
function getRecipients() {
  return readCollection(STORAGE_KEYS.RECIPIENTS);
}

/** Save the full list of recipient records. */
function saveRecipients(recipients) {
  writeCollection(STORAGE_KEYS.RECIPIENTS, recipients);
}

/** Generate the next recipient ID in the form "RCP-0001". */
function generateRecipientId() {
  const next = Number(localStorage.getItem(STORAGE_KEYS.RECIPIENT_SEQ) || '0') + 1;
  localStorage.setItem(STORAGE_KEYS.RECIPIENT_SEQ, String(next));
  return 'RCP-' + String(next).padStart(4, '0');
}

/** Add a new recipient record and return it. */
function addRecipient(recipient) {
  const recipients = getRecipients();
  recipient.id = generateRecipientId();
  recipients.push(recipient);
  saveRecipients(recipients);
  return recipient;
}

/** Update an existing recipient (matched by id). Returns true when found. */
function updateRecipient(id, updatedFields) {
  const recipients = getRecipients();
  const index = recipients.findIndex(function (r) { return r.id === id; });
  if (index === -1) {
    return false;
  }
  recipients[index] = Object.assign({}, recipients[index], updatedFields, { id: id });
  saveRecipients(recipients);
  return true;
}

/** Delete a recipient by id. Returns true when a record was removed. */
function deleteRecipient(id) {
  const recipients = getRecipients();
  const remaining = recipients.filter(function (r) { return r.id !== id; });
  saveRecipients(remaining);
  return remaining.length !== recipients.length;
}

/** Look up a single recipient by id (or undefined). */
function getRecipientById(id) {
  return getRecipients().find(function (r) { return r.id === id; });
}
