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
    .post(`http://localhost:3000/expenses/add-expense`, {
      description: description,
      amount: amount,
      category: category,
    },
    {headers : 
        {
          Authorization: token 
        }
        })
    .then((res) => {
      handleOnLoad();
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleOnLoad() {
    debugger
  axios
    .get(`http://localhost:3000/expenses/get-expense`, 
      {headers : 
      {
        Authorization: token 
      }
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
    .delete(`http://localhost:3000/expenses/delete-expense/${id}`)
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
    .put(`http://localhost:3000/expenses/update-expense/${id}`, {
      description: updatedescription,
      amount: updateamount,
      category: updatecategory,
    })
    .then((res) => {
        const form = document.querySelector("form");
        form.onsubmit = (event) => {
           handleFormSubmit(event)
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
  deleteBtn.textContent = "Delete";
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-warning";
  editBtn.textContent = "Edit";
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
  document.querySelector(".list-group").appendChild(list);
}

window.onload = handleOnLoad();
