// ==========================================
// DATA
// ==========================================

let sales = JSON.parse(localStorage.getItem("sales")) || [];

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

let inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageId, button = null) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageId).classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        sales: "Sales",
        expenses: "Expenses",
        inventory: "Inventory",
        customers: "Customers"
    };

    document.getElementById("pageTitle").innerText =
        titles[pageId];

    if (window.innerWidth <= 768) {
        document.getElementById("sidebar")
            .classList.remove("open");
    }

    updateUI();
}


// ==========================================
// SIDEBAR
// ==========================================

function toggleSidebar() {

    document.getElementById("sidebar")
        .classList.toggle("open");
}


// ==========================================
// DATE
// ==========================================

function displayDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("currentDate").innerText =
        today.toLocaleDateString("en-IN", options);
}

displayDate();


// ==========================================
// MODALS
// ==========================================

function openSaleModal() {

    document.getElementById("saleModal")
        .classList.add("show");
}

function openExpenseModal() {

    document.getElementById("expenseModal")
        .classList.add("show");
}

function openStockModal() {

    document.getElementById("stockModal")
        .classList.add("show");
}


function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");
}


// ==========================================
// ADD SALE
// ==========================================

function addSale() {

    const product =
        document.getElementById("saleProduct")
            .value.trim();

    const amount =
        Number(
            document.getElementById("saleAmount")
                .value
        );

    if (product === "" || amount <= 0) {

        alert("Please enter a product and valid amount.");

        return;
    }


    const sale = {

        id: Date.now(),

        product: product,

        amount: amount,

        date: new Date().toLocaleDateString("en-IN")

    };


    sales.push(sale);


    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );


    document.getElementById("saleProduct").value = "";

    document.getElementById("saleAmount").value = "";


    closeModal("saleModal");


    updateUI();

    alert("Sale added successfully!");
}


// ==========================================
// ADD EXPENSE
// ==========================================

function addExpense() {

    const name =
        document.getElementById("expenseName")
            .value.trim();

    const amount =
        Number(
            document.getElementById("expenseAmount")
                .value
        );


    if (name === "" || amount <= 0) {

        alert("Please enter expense and valid amount.");

        return;
    }


    const expense = {

        id: Date.now(),

        name: name,

        amount: amount,

        date: new Date().toLocaleDateString("en-IN")

    };


    expenses.push(expense);


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    document.getElementById("expenseName").value = "";

    document.getElementById("expenseAmount").value = "";


    closeModal("expenseModal");


    updateUI();

    alert("Expense added successfully!");
}


// ==========================================
// ADD STOCK
// ==========================================

function addStock() {

    const product =
        document.getElementById("stockProduct")
            .value.trim();

    const quantity =
        Number(
            document.getElementById("stockQuantity")
                .value
        );


    if (product === "" || quantity <= 0) {

        alert("Please enter product and quantity.");

        return;
    }


    const existingProduct =
        inventory.find(
            item =>
                item.product.toLowerCase() ===
                product.toLowerCase()
        );


    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        inventory.push({

            id: Date.now(),

            product: product,

            quantity: quantity

        });
    }


    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );


    document.getElementById("stockProduct").value = "";

    document.getElementById("stockQuantity").value = "";


    closeModal("stockModal");


    updateUI();

    alert("Stock added successfully!");
}


// ==========================================
// CALCULATIONS
// ==========================================

function calculateSales() {

    return sales.reduce(
        (total, sale) =>
            total + sale.amount,
        0
    );
}


function calculateExpenses() {

    return expenses.reduce(
        (total, expense) =>
            total + expense.amount,
        0
    );
}


function calculateStock() {

    return inventory.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const totalSales =
        calculateSales();

    const totalExpenses =
        calculateExpenses();

    const profit =
        totalSales - totalExpenses;

    const totalStock =
        calculateStock();


    document.getElementById("totalSales")
        .innerText =
        formatMoney(totalSales);


    document.getElementById("totalExpenses")
        .innerText =
        formatMoney(totalExpenses);


    document.getElementById("totalProfit")
        .innerText =
        formatMoney(profit);


    document.getElementById("totalStock")
        .innerText =
        totalStock;
}


// ==========================================
// SALES TABLE
// ==========================================

function updateSalesTable() {

    const table =
        document.getElementById("salesTable");


    if (sales.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3" class="empty">
                    No sales recorded yet.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = "";


    sales.slice().reverse().forEach(sale => {

        table.innerHTML += `

            <tr>

                <td>
                    <strong>${escapeHTML(sale.product)}</strong>
                </td>

                <td>
                    ${formatMoney(sale.amount)}
                </td>

                <td>
                    ${sale.date}
                </td>

            </tr>
        `;
    });
}


// ==========================================
// EXPENSE TABLE
// ==========================================

function updateExpenseTable() {

    const table =
        document.getElementById("expensesTable");


    if (expenses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3" class="empty">
                    No expenses recorded yet.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = "";


    expenses.slice().reverse().forEach(expense => {

        table.innerHTML += `

            <tr>

                <td>
                    <strong>${escapeHTML(expense.name)}</strong>
                </td>

                <td>
                    ${formatMoney(expense.amount)}
                </td>

                <td>
                    ${expense.date}
                </td>

            </tr>
        `;
    });
}


// ==========================================
// INVENTORY
// ==========================================

function updateInventory() {

    const grid =
        document.getElementById("inventoryGrid");


    if (inventory.length === 0) {

        grid.innerHTML = `
            <div class="customer-message">

                <i class="fa-solid fa-box-open"></i>

                <h2>No Products Yet</h2>

                <p>
                    Add your first product to inventory.
                </p>

            </div>
        `;

        return;
    }


    grid.innerHTML = "";


    inventory.forEach(item => {

        let stockStatus =
            item.quantity <= 5
                ? "Low Stock"
                : "Available";


        grid.innerHTML += `

            <div class="product-card">

                <div class="product-icon">

                    <i class="fa-solid fa-box"></i>

                </div>

                <h3>
                    ${escapeHTML(item.product)}
                </h3>

                <p>
                    Quantity:
                    <strong>${item.quantity}</strong>
                </p>

                <p style="margin-top:8px;">

                    ${stockStatus}

                </p>

            </div>
        `;
    });
}


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

function updateTransactions() {

    const table =
        document.getElementById("transactionTable");


    let transactions = [];


    sales.forEach(sale => {

        transactions.push({

            type: "Sale",

            description: sale.product,

            amount: sale.amount,

            date: sale.date

        });
    });


    expenses.forEach(expense => {

        transactions.push({

            type: "Expense",

            description: expense.name,

            amount: expense.amount,

            date: expense.date

        });
    });


    transactions =
        transactions.slice(-8).reverse();


    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    No transactions yet.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = "";


    transactions.forEach(item => {

        table.innerHTML += `

            <tr>

                <td>
                    <strong>${item.type}</strong>
                </td>

                <td>
                    ${escapeHTML(item.description)}
                </td>

                <td>
                    ${formatMoney(item.amount)}
                </td>

                <td>
                    ${item.date}
                </td>

            </tr>
        `;
    });
}


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updateUI() {

    updateDashboard();

    updateSalesTable();

    updateExpenseTable();

    updateInventory();

    updateTransactions();
}


// ==========================================
// MONEY FORMAT
// ==========================================

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);
}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// DARK MODE
// ==========================================

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        darkMode
    );
}


if (
    localStorage.getItem("darkMode") === "true"
) {

    document.body.classList.add("dark");
}


// ==========================================
// CUSTOMER PLACEHOLDER
// ==========================================

function addCustomer() {

    alert(
        "Customer management will be added in the next version."
    );
}


// ==========================================
// START APP
// ==========================================

updateUI();