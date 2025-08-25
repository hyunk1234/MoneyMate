document.addEventListener("DOMContentLoaded", function () {
  let transactions = [];

  // Fetch transactions from the backend
  function fetchTransactions() {
    fetch("/transactions/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Assumes JWT is stored in localStorage under 'token'
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        transactions = data;
        displayTransactions(transactions);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }
  (async function () {
    const result = await applyFilters("/transactions/add", "POST", newTxData);
  })();

  if (result.warning) {
    alert(result.warning);
  }

  // Display transactions in the table
  function displayTransactions(transactionsList) {
    const tableBody = document.querySelector("#transactions-table tbody");
    tableBody.innerHTML = "";
    transactionsList.forEach((transaction) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${transaction.id}</td>
          <td>${transaction.type}</td>
          <td>${transaction.category}</td>
          <td>${transaction.amount}</td>
          <td>
            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
          </td>
        `;
      tableBody.appendChild(row);
    });
  }

  // Apply filters, sorting, and search
  function applyFilters() {
    const searchValue = document
      .getElementById("search-input")
      .value.toLowerCase();
    const filterType = document.getElementById("filter-type").value;
    const sortOrder = document.getElementById("sort-order").value;

    let filtered = transactions;

    // Filter by search (category or type)
    if (searchValue) {
      filtered = filtered.filter(
        (tr) =>
          tr.category.toLowerCase().includes(searchValue) ||
          tr.type.toLowerCase().includes(searchValue)
      );
    }

    // Filter by transaction type
    if (filterType) {
      filtered = filtered.filter((tr) => tr.type.toLowerCase() === filterType);
    }

    // Sort by amount if specified
    if (sortOrder) {
      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return parseFloat(a.amount) - parseFloat(b.amount);
        } else {
          return parseFloat(b.amount) - parseFloat(a.amount);
        }
      });
    }

    displayTransactions(filtered);
  }

  // Delete a transaction
  function deleteTransaction(id) {
    fetch(`/transactions/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Refresh transactions after deletion
        fetchTransactions();
      })
      .catch((err) => console.error("Error deleting transaction:", err));
  }

  // Event listener for the filter button
  document.getElementById("filter-btn").addEventListener("click", applyFilters);

  // Event delegation for handling delete button clicks
  document
    .querySelector("#transactions-table tbody")
    .addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("delete-btn")) {
        const transactionId = e.target.getAttribute("data-id");
        deleteTransaction(transactionId);
      }
    });

  // Initial fetch of transactions
  fetchTransactions();
});
