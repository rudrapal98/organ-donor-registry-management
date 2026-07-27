# Organ Donor Registry Management System

A minimal, offline **Organ Donor Registry Management System** built as a
college mini project. It lets an operator register organ **donors** and organ
**recipients**, view them in clean tables, edit or delete records, and search
the donor registry by name, blood group or organ. The whole application runs
in the browser and stores its data in the browser's **localStorage** — no
server, database or internet connection is required.

---

## Project Description

The system provides a simple front-end for maintaining two registries:

- **Donors** — people willing to donate an organ, along with their contact and
  medical details.
- **Recipients** — patients awaiting a transplant, along with the organ they
  require and their hospital.

A dashboard shows live totals for both registries and gives quick access to the
registration pages. A dedicated search page helps locate matching donors. All
data is saved locally in the browser, so records persist between visits on the
same device and browser.

---

## Technologies Used

- **HTML5** — page structure and forms
- **CSS3** — custom styling and the blue theme (`css/style.css`)
- **Vanilla JavaScript** — application logic, validation and CRUD
- **Bootstrap 5** — responsive layout and components (bundled locally, no CDN)
- **Browser localStorage** — client-side data storage

No frameworks (React/Angular/Vue), no TypeScript, no build tools, and no
backend of any kind are used.

---

## Folder Structure

```
OrganDonorRegistry/
├── index.html            # Dashboard (open this file to start)
├── donors.html           # Donor registration + list (CRUD)
├── recipients.html       # Recipient registration + list (CRUD)
├── search.html           # Search donors by name / blood group / organ
├── about.html            # Project description, objectives, technologies
├── README.md             # This file
├── CLAUDE.md             # Project specification / source of truth
├── Project_Report.docx   # Full project report (Word)
├── Project_Report.pdf    # Full project report (PDF)
├── css/
│   ├── bootstrap.min.css # Bootstrap 5 (local copy)
│   └── style.css         # Custom styles
├── js/
│   ├── bootstrap.bundle.min.js # Bootstrap 5 JS (local copy)
│   ├── storage.js        # localStorage data-access layer
│   ├── common.js         # Shared navbar, alerts, validation helpers
│   ├── donor.js          # Donor page logic
│   ├── recipient.js      # Recipient page logic
│   └── search.js         # Search page logic
└── assets/
    ├── logo.png          # Application logo
    └── screenshots/      # Screenshots used in the project report
```

---

## Features

- **Dashboard** with live counts of total donors and total recipients.
- **Donor registration** with auto-generated Donor ID (`DNR-0001`, ...) and
  fields for name, age, gender, blood group, phone, address, organ and an
  optional medical condition.
- **Recipient registration** with auto-generated Recipient ID (`RCP-0001`, ...)
  and fields for name, age, gender, blood group, required organ and hospital.
- **Full CRUD** — create, read, update (Edit) and delete records, for both
  donors and recipients.
- **Search** donors by name (partial match), blood group and organ, in any
  combination.
- **Input validation** — required fields cannot be empty, age must be numeric,
  phone number must contain digits only, with friendly on-screen messages.
- **Persistent storage** using the browser's localStorage.
- **Responsive, professional UI** with a blue theme on a white background.
- **Fully offline** — Bootstrap is bundled locally, so no internet is needed.

---

## How to Run

1. Extract the ZIP.
2. Double-click `index.html`.

Done. The application opens in your default web browser and is ready to use.

> Tip: All data you enter is stored in your browser on this device. Using the
> same browser again will show your previously saved records.
