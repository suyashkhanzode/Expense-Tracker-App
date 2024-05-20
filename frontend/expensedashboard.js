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
      handleOnLoad();
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleOnLoad() {
  axios
    .get(`http://localhost:3000/expenses/get-expense`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      const siteList = document.querySelector("ul");
      siteList.innerHTML = "";
      debugger;
      res.data.forEach((item) => {
        createList(item);
      });
    })
    .catch((err) => {
      console.log(err);
    });
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
      handleOnLoad();
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

      handleOnLoad();
    })
    .catch((err) => {
      console.log(err);
    });
}

function createList(expens) {
  const list = document.createElement("li");
  list.className = "list-group-item";
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.innerHTML = `<span>Delete</span>`;
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-warning";
  editBtn.innerHTML = `<span>Edit</span>`;
  list.textContent =
    expens.amount + "  " + expens.description + " " + expens.category + " ";
  deleteBtn.addEventListener("click", function () {
    deleteExpense(expens.id);
  });
  editBtn.addEventListener("click", function () {
    editExpense(expens);
  });
  list.append(deleteBtn);

  list.append(editBtn);
  document.querySelectorAll(".list-group")[0].appendChild(list);
  isPremiumMember();
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
    ele.appendChild(btn);
  }
}

function getLedboard() {
  axios
    .get(`http://localhost:3000/user/get-total-amount`)
    .then((response) => {
      debugger;
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

window.onload = handleOnLoad();
