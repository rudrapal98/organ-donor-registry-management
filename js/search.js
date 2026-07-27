/*
 * search.js
 * ---------------------------------------------------------------------------
 * Page logic for search.html. Lets the user search the donor registry by
 * Name, Blood Group or Organ and shows the matching donors in a table.
 * ---------------------------------------------------------------------------
 */

/** Wire up the search page once the DOM is ready. */
function initSearchPage() {
  renderNavbar('search');
  populateSelect('searchBloodGroup', BLOOD_GROUPS, 'Any blood group');
  populateSelect('searchOrgan', ORGANS, 'Any organ');

  document.getElementById('searchForm').addEventListener('submit', handleSearch);
  document.getElementById('searchForm').addEventListener('reset', handleSearchReset);

  // Show the whole registry initially so the page is not empty on load.
  renderSearchResults(getDonors());
}

/** Filter donors by the chosen criteria and display the results. */
function handleSearch(event) {
  event.preventDefault();

  var nameQuery = document.getElementById('searchName').value.trim().toLowerCase();
  var bloodGroup = document.getElementById('searchBloodGroup').value;
  var organ = document.getElementById('searchOrgan').value;

  var results = getDonors().filter(function (donor) {
    var matchesName = nameQuery === '' ||
      donor.name.toLowerCase().indexOf(nameQuery) !== -1;
    var matchesBlood = bloodGroup === '' || donor.bloodGroup === bloodGroup;
    var matchesOrgan = organ === '' || donor.organ === organ;
    return matchesName && matchesBlood && matchesOrgan;
  });

  renderSearchResults(results);
}

/** Draw the search-result table (or an empty-state message). */
function renderSearchResults(donors) {
  var tbody = document.getElementById('searchTableBody');
  var emptyMessage = document.getElementById('searchEmpty');
  var summary = document.getElementById('searchSummary');

  if (summary) {
    summary.textContent = donors.length +
      (donors.length === 1 ? ' donor found.' : ' donors found.');
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
      '<td>' + escapeHtml(donor.organ) + '</td>' +
      '<td>' + escapeHtml(donor.phone) + '</td>' +
    '</tr>';
  }).join('');
}

/** Reset the form and show the full registry again. */
function handleSearchReset() {
  // Let the native reset clear the fields first, then re-render.
  setTimeout(function () {
    renderSearchResults(getDonors());
  }, 0);
}

document.addEventListener('DOMContentLoaded', initSearchPage);
