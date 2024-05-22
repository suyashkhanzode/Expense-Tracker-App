const token = window.sessionStorage.getItem("token");

function handleFormSubmit(event) {
  event.preventDefault();
  debugger;
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";

  axios
    .post(
      `http://localhost:3000/expenses/add-expense`,
      {
        description: description,
        amount: amount,
        category: category,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
       pagination();
    })
    .catch((err) => {
      console.log(err);
    });
}

document.getElementById("numberRows").addEventListener("input", (event) => {
  const number = parseInt(event.target.value);
  window.sessionStorage.setItem("limit", number);
  window.onload = pagination();
});

function pagination() {
  const limit = window.sessionStorage.getItem("limit") || 3;
 
  let currentPage = 1;

  function fetchExpenses(page) {
    axios
      .get(`http://localhost:3000/expenses/get-expense/${page}/${limit}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const { expenses, totalPages, currentPage } = response.data;
        renderExpenses(expenses);
        renderPagination(totalPages, currentPage);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function renderExpenses(expenses) {
    const expensesList = document.getElementById("expenses-list");
    expensesList.innerHTML = "";
    expenses.forEach((expense) => {
      const list = document.createElement("li");
      list.className = "list-group-item";
      list.textContent =
        expense.amount +
        "  " +
        expense.description +
        " " +
        expense.category +
        " ";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-danger";
      deleteBtn.innerHTML = `<span>Delete</span>`;
      deleteBtn.addEventListener("click", function () {
        deleteExpense(expense.id);
      });

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-warning";
      editBtn.innerHTML = `<span>Edit</span>`;
      editBtn.addEventListener("click", function () {
        editExpense(expense);
      });

      list.appendChild(deleteBtn);
      list.appendChild(editBtn);
      expensesList.appendChild(list);
      isPremiumMember();
    });
  }

  function renderPagination(totalPages, currentPage) {
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = "";

    // Previous Button
    const prevItem = document.createElement("li");
    prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.href = "#";
    prevLink.textContent = "Previous";
    prevLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        fetchExpenses(currentPage);
      }
    });
    prevItem.appendChild(prevLink);
    paginationControls.appendChild(prevItem);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
      const pageLink = document.createElement("a");
      pageLink.className = "page-link";
      pageLink.href = "#";
      pageLink.textContent = i;

      pageLink.addEventListener("click", function (e) {
        e.preventDefault();
        if (i !== currentPage) {
          currentPage = i;
          fetchExpenses(currentPage);
        }
      });

      pageItem.appendChild(pageLink);
      paginationControls.appendChild(pageItem);
    }

    // Next Button
    const nextItem = document.createElement("li");
    nextItem.className = `page-item ${
      currentPage === totalPages ? "disabled" : ""
    }`;
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#";
    nextLink.textContent = "Next";
    nextLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        fetchExpenses(currentPage);
      }
    });
    nextItem.appendChild(nextLink);
    paginationControls.appendChild(nextItem);
  }

  fetchExpenses(currentPage);
}

function deleteExpense(id) {
  debugger;
  axios
    .delete(`http://localhost:3000/expenses/delete-expense/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then(() => {
      pagination();
    })
    .catch((err) => {
      console.log(err);
    });
}

function editExpense(expens) {
  document.getElementById("description").value = expens.description;
  document.getElementById("amount").value = expens.amount;
  document.getElementById("category").value = expens.category;
  const form = document.querySelector("form");
  form.onsubmit = (event) => {
    updateExpense(event, expens.id);
  };
}

function updateExpense(event, id) {
  event.preventDefault();
  const updatedescription = document.getElementById("description").value;
  const updateamount = document.getElementById("amount").value;
  const updatecategory = document.getElementById("category").value;
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  debugger;
  axios
    .put(
      `http://localhost:3000/expenses/update-expense/${id}`,
      {
        description: updatedescription,
        amount: updateamount,
        category: updatecategory,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      const form = document.querySelector("form");
      form.onsubmit = (event) => {
        handleFormSubmit(event);
      };

      pagination();
    })
    .catch((err) => {
      console.log(err);
    });
}

document.getElementById("payBtn").addEventListener("click", () => {
  debugger;
  axios
    .get(`http://localhost:3000/order/buy-primium`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      const data = response.data;
      const options = {
        key: data.key_id, // Razorpay key ID
        amount: data.order.amount, // Amount in paisa
        currency: "INR",
        name: "Your Company Name",
        description: "Premium Subscription",
        order_id: data.order.id, // Order ID from Razorpay
        handler: function (response) {
          alert(
            `Payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
          alert(`Order ID: ${response.razorpay_order_id}`);
          alert(`Signature: ${response.razorpay_signature}`);

          // Verify the payment on the backend
          axios
            .post(
              "http://localhost:3000/order/verify-payment",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((res) => {
              alert("Payment verified and order updated successfully!");
            })
            .catch((err) => {
              console.error("Error verifying payment:", err);
            });
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout form closed");
          },
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    })
    .catch((err) => {
      console.error("Error creating order:", err);
    });
});

function isPremiumMember() {
  const isPremiumUSer = window.sessionStorage.getItem("isPremiumUSer");
  if (isPremiumUSer === "true") {
    const ele = document.getElementById("payBtnDiv");
    ele.innerHTML = "";
    ele.innerHTML = "<h3>You Are Primium User</h3>";
    const btn = document.createElement("button");
    btn.className = "btn btn-info";
    btn.textContent = "Show LeadBoard";
    btn.addEventListener("click", () => {
      getLedboard();
    });
    const reportBtn = document.createElement("button");
    reportBtn.className = "btn btn-dark";
    reportBtn.textContent = "Generate Report";
    reportBtn.addEventListener("click", () => {
      window.location.href = "reportgeneration.html";
    });
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "btn btn-success";
    downloadBtn.textContent = "Download";
    downloadBtn.addEventListener("click", () => {
      dowloadFile();
    });
    ele.appendChild(btn);
    // ele.appendChild(`<span/>`)
    ele.appendChild(reportBtn);
    ele.appendChild(downloadBtn);
  }
}

function getLedboard() {
  axios
    .get(`http://localhost:3000/user/get-total-amount`)
    .then((response) => {
      debugger;
      document.querySelectorAll(".list-group")[1].innerHTML = "";
      response.data.forEach((data) => {
        showLeadboard(data);
      });
    })
    .catch((err) => {});
}

function showLeadboard(data) {
  const list = document.createElement("li");
  list.className =
    "list-group-item d-flex justify-content-between align-items-center p-2";

  const nameDiv = document.createElement("div");
  nameDiv.innerHTML = `<strong>Name:</strong> ${data.name}`;
  nameDiv.className = "mr-3"; // Reduced margin-right to make it compact

  const amountDiv = document.createElement("div");
  amountDiv.innerHTML = `<strong>Total Amount:</strong> ${data.totalAmount}`;
  amountDiv.className = "mr-3";

  list.appendChild(nameDiv);
  list.appendChild(amountDiv);

  document.querySelectorAll(".list-group")[1].appendChild(list);
}

function dowloadFile() {
  axios
    .get(`http://localhost:3000/expenses/dowload`, {
      headers: { Authorization: token },
    })
    .then((response) => [(window.location.href = response.data.fileURL)])
    .catch((err) => []);
}

window.onload = pagination();
