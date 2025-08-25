import { api } from "./api.js";

window.addEventListener("DOMContentLoaded", async () => {
    const ctxIncomeExpense = document.getElementById("incomeExpenseChart").getContext("2d");
    const ctxBudget = document.getElementById("budgetChart").getContext("2d");

    const fmt = d => d.toISOString().slice(0, 10);

    const today = new Date();
    const past7 = new Date(today);
    past7.setDate(today.getDate() - 6);

    const resp7 = await api("/transactions/all?start_date=${fmt(past7)}&end_date=${fmt(today)}&page_size=1000", "GET");
    const txns7 = resp7.transactions;

    const dayMap =  {};
    for(let i = 0; i < 7; i++){
        const d = new Date(past7);
        d.setDate(past7.getDate() + i);
        dayMap[fmt(d)] = { income:0, expense:0 };
    }
    txns7.forEach(t => {
        const d = t.created_at.slice(0, 10);
        if (dayMap[d]) {
            dayMap[d][t.type] += parseFloat(t.amount);
        }
    });

    const labels7 = Object.keys(dayMap);
    const dataIncome = labels7.map(d => dayMap[d].income);
    const dataExpense = labels7.map(d => dayMap[d].expense);

    new Chart(ctxIncomeExpense, {
        type: "line",
        data: {
            labels: labels7,
            datasets: [
                {
                    label: "Income",
                    data: dataIncome,
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: "Expense",
                    data: dataExpense,
                    fill: true,
                    tension: 0.3,
                }
            ]
        },
        options: {scale: {y: {beginAtZero: true}}}
    })

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const respM = await api("/transactions/all?start_date=${fmt(monthStart)}&end_date=${fmt(today)}&page_size=1000", "GET");
    const txnsM = respM.transactions;

    const catMap = {};
    txnsM.forEach(t => {
        if (!catMap[t.category]) catMap[t.category] = 0;
        catMap[t.category] += parseFloat(t.amount);
    })

    const catLabels = Object.keys(catMap);
    const catData = catLabels.map(c => catMap[c]);

    new Chart(ctxBudget, {
        type: "doughnut",
        data: {
            labels: catLabels,
            datasets: [{
                label: "This month",
                data: catData,
            }]
        },
        options: {plugins: {legend:{position:"bottom"}}}
    })
});

async function loadInsights(){
    try{
        const {advice} = await api("/insights", "GET");
        const container = document.getElementById("insights-container");
        advice.forEach(item => {
            const card = document.createElement("div");
            card.className = "insight-card";
            card.innerHTML = `<h4>${item.title}</h4><p>${item.text}</p>`;
            container.appendChild(card);
        });
    }
    catch (err) {
        console.error("Could not load insights:", err);
    }
}
loadInsights();

function fmt(d) {
    return d.toISOString().split("T")[0];
}