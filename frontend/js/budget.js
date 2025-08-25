document.addEventListener("DOMContentLoaded", function () {
    const budgetChartCanvas = document.getElementById('budgetChart').getContext('2d');
    let budgetData = {
        labels: [],
        datasets: [{
            label: 'Budget Allocation',
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#E74C3C'],
            borderWidth: 1
        }]
    };

    const budgetChart = new Chart(budgetChartCanvas, {
        type: 'pie',
        data: budgetData,
        options: { responsive: true }
    });

    const budgetTableBody = document.querySelector('#budget-table tbody');
    const incomeInput = document.getElementById('income');
    const categoryInput = document.getElementById('budget-category');
    const amountInput = document.getElementById('budget-amount');
    const addBudgetBtn = document.getElementById('add-budget');

    addBudgetBtn.addEventListener('click', function () {
        const category = categoryInput.value;
        const amount = parseFloat(amountInput.value);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }

        budgetData.labels.push(category);
        budgetData.datasets[0].data.push(amount);
        budgetChart.update();

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category}</td>
            <td>$${amount.toFixed(2)}</td>
            <td><button onclick="removeBudget('${category}')">❌ Remove</button></td>
        `;
        budgetTableBody.appendChild(row);

        amountInput.value = "";
    });

    window.removeBudget = function (category) {
        const index = budgetData.labels.indexOf(category);
        if (index > -1) {
            budgetData.labels.splice(index, 1);
            budgetData.datasets[0].data.splice(index, 1);
            budgetChart.update();
        }
    };
});
