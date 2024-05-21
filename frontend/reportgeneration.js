const token = window.sessionStorage.getItem("token");
function handleOnLoad() {
    console.log(token)
    axios
      .get(`http://localhost:3000/expenses/get-expense`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        
        debugger;
        res.data.forEach((item) => {
         reportGeneration(item);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

function reportGeneration(data) {
    const ele =  document.querySelectorAll(".table")[0];
    const tbody = document.createElement('tbody');
    tbody.innerHTML = `<tr>
    <td>${data.createdAt}</td>
    <td>${data.description}</td>
    <td>${data.category}</td>
    <td>${10}</td>
    <td>${data.amount}</td>
   </tr>`  ;
    
    ele.appendChild(tbody);
    
 }

 window.onload = handleOnLoad();