/*
 * seed.js
 * ---------------------------------------------------------------------------
 * Loads a few realistic sample records the FIRST time the application is
 * opened, so an evaluator immediately sees the registry populated instead of
 * empty tables. This is purely a demonstration convenience.
 *
 * The seed runs only once: a one-time flag ("odr_seeded") is written after the
 * first run, so the sample data is NOT restored if the user later deletes the
 * records. Seeding also only happens when both registries are empty, so it can
 * never overwrite data the user has already entered.
 *
 * This script must be loaded AFTER storage.js and BEFORE the page scripts.
 * It runs immediately (it only touches localStorage, not the DOM).
 * ---------------------------------------------------------------------------
 */

// Sample donors matching the records shown in the project report screenshots.
var SAMPLE_DONORS = [
  { id: 'DNR-0001', name: 'Rahul Sharma', age: '32', gender: 'Male', bloodGroup: 'O+', phone: '9876500011', address: '12 MG Road, Pune', organ: 'Kidney', medicalCondition: '' },
  { id: 'DNR-0002', name: 'Priya Nair', age: '28', gender: 'Female', bloodGroup: 'A+', phone: '9876500022', address: '45 Anna Salai, Chennai', organ: 'Liver', medicalCondition: 'None' },
  { id: 'DNR-0003', name: 'Amit Verma', age: '41', gender: 'Male', bloodGroup: 'B+', phone: '9876500033', address: '7 Park Street, Kolkata', organ: 'Cornea', medicalCondition: '' },
  { id: 'DNR-0004', name: 'Sneha Patil', age: '35', gender: 'Female', bloodGroup: 'O-', phone: '9876500044', address: '88 FC Road, Pune', organ: 'Kidney', medicalCondition: 'Controlled hypertension' },
  { id: 'DNR-0005', name: 'Imran Khan', age: '46', gender: 'Male', bloodGroup: 'AB+', phone: '9876500055', address: '3 Residency Road, Bengaluru', organ: 'Heart', medicalCondition: '' },
  { id: 'DNR-0006', name: 'Divya Menon', age: '24', gender: 'Female', bloodGroup: 'A-', phone: '9876500066', address: '19 Marine Drive, Kochi', organ: 'Bone Marrow', medicalCondition: '' }
];

// Sample recipients matching the records shown in the project report screenshots.
var SAMPLE_RECIPIENTS = [
  { id: 'RCP-0001', name: 'Anjali Gupta', age: '52', gender: 'Female', bloodGroup: 'O+', organ: 'Kidney', hospital: 'City General Hospital, Pune' },
  { id: 'RCP-0002', name: 'Ramesh Iyer', age: '60', gender: 'Male', bloodGroup: 'A+', organ: 'Liver', hospital: 'Apollo Hospital, Chennai' },
  { id: 'RCP-0003', name: 'Farida Sheikh', age: '38', gender: 'Female', bloodGroup: 'AB+', organ: 'Heart', hospital: 'Fortis Hospital, Bengaluru' },
  { id: 'RCP-0004', name: 'Vikram Rao', age: '47', gender: 'Male', bloodGroup: 'B+', organ: 'Cornea', hospital: 'AIIMS, New Delhi' }
];

/**
 * Populate localStorage with the sample records on the very first run only.
 * Uses the storage.js helpers so the data format stays consistent, and sets
 * the ID sequence counters so newly added records continue from DNR-0007 /
 * RCP-0005.
 */
function seedSampleDataIfFirstRun() {
  // Already seeded once before: do nothing.
  if (localStorage.getItem('odr_seeded') === '1') {
    return;
  }
  // Never overwrite data that already exists.
  if (getDonors().length === 0 && getRecipients().length === 0) {
    saveDonors(SAMPLE_DONORS);
    saveRecipients(SAMPLE_RECIPIENTS);
    // Advance the ID counters so future auto-generated IDs stay unique.
    localStorage.setItem('odr_donor_seq', String(SAMPLE_DONORS.length));
    localStorage.setItem('odr_recipient_seq', String(SAMPLE_RECIPIENTS.length));
  }
  // Mark as seeded so this only ever happens once.
  localStorage.setItem('odr_seeded', '1');
}

// Run immediately at load time (storage.js is already available).
seedSampleDataIfFirstRun();
