

function handleFormSubmit(event){
    event.preventDefault();
    debugger;
     const description = document.getElementById("description").value
     const amount = document.getElementById("amount").value
     const category = document.getElementById("category").value
     document.getElementById("amount").value = ""
     document.getElementById("description").value = ""
     document.getElementById("category").value = ""
     const userId = window.sessionStorage.getItem("userId")
      axios.post(`http://localhost:3000/expenses/${userId}/add-expense`,{
        description : description,
        amount : amount,
        category : category
     })
     .then((res) =>{
       handleOnLoad();
     })
     .catch((err)=>{
        console.log(err);
     })
    
}
function handleOnLoad(){
   const userId = window.sessionStorage.getItem("userId")
    
    axios.get(`http://localhost:3000/expenses/${userId}/get-expense`)
    .then((res) =>{
        const siteList = document.querySelector("ul");
            siteList.innerHTML = ""; 
            debugger;
            res.data.forEach((item) => {
                createList(item);
            });
    })
    .catch((err) =>{
        console.log(err)
    })
}

function deleteExpense(id){
    debugger;
    axios.delete(`http://localhost:3000/expenses/delete-expense/${id}`)
    .then(() =>{
       handleOnLoad();
    })
    .catch((err)=>{
        console.log(err)
    })
}

function editExpense(expens){
     document.getElementById("description").value = expens.description
     document.getElementById("amount").value = expens.amount;
     document.getElementById("category").value = expens.category;
    const form = document.querySelector("form");
    form.onsubmit = (event) =>{ updateExpense(event,expens.id)}
}

async function updateExpense(event,id){


   
        event.preventDefault();
        const updatedescription = document.getElementById("description").value
        const updateamount = document.getElementById("amount").value
        const updatecategory = document.getElementById("category").value
        document.getElementById("description").value = ""
        document.getElementById("description").value = ""
        document.getElementById("category").value = ""
         debugger;
        axios.put(`http://localhost:3000/expenses/update-expense/${id}`,{
            description : updatedescription,
            amount : updateamount,
            category : updatecategory
        })
        .then((res) =>{
            handleOnLoad();
          })
          .catch((err)=>{
             console.log(err);
          })
        

      
         
            handleOnLoad();
        
        
        
    

}

function createList(expens)
{
    const list = document.createElement('li');
    list.className = "list-group-item";
    const deleteBtn = document.createElement('button');
    deleteBtn.className = "btn btn-danger";
    deleteBtn.textContent = "Delete";
    const editBtn = document.createElement('button');
    editBtn.className = "btn btn-warning";
    editBtn.textContent = "Edit";
    list.textContent = expens.amount + "  "+expens.description+" "+expens.category+ " ";
    deleteBtn.addEventListener("click",function(){
          
         deleteExpense(expens.id);
           
    })
    editBtn.addEventListener("click",function(){
        editExpense(expens)
    })
    list.append(deleteBtn);
 
    list.append(editBtn);
    document.querySelector('.list-group').appendChild(list);
}



window.onload = handleOnLoad();