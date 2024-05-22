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
        const diff = new Date();
       
        
        debugger;
        res.data.forEach((item) => {
          const createdAt = new Date(item.createdAt);
          if(diff.getDay() === createdAt.getDay())
          {
            reportGenerationToday(item);

          }
          if(diff.getMonth() === createdAt.getMonth())
          {
            reportGenerationMonth(item);

          }
          if(diff.getFullYear() === createdAt.getFullYear())
          {
            reportGenerationYear(item);

          }
            
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

function reportGenerationToday(data) {
  const head1 = document.getElementById('dateElement');
  const today = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric',
    month: 'long',
  });
   head1.textContent = today;
    const ele1 =  document.querySelectorAll(".table")[0];
    const tbody = document.createElement('tbody');
    tbody.innerHTML = `<tr>
    <td>${data.createdAt}</td>
    <td>${data.description}</td>
    <td>${data.category}</td>
    <td>${10}</td>
    <td>${data.amount}</td>
   </tr>`  ;
    
    ele1.appendChild(tbody);
    
 }

function reportGenerationMonth(data) {
  const head1 = document.getElementById('monthlyElement');
  const today = new Date().toLocaleDateString('en-IN', { 
   
     month: 'long',
  });
   head1.textContent = today;
    const ele1 =  document.querySelectorAll(".table")[1];
    const tbody = document.createElement('tbody');
    tbody.innerHTML = `<tr>
    <td>${data.createdAt}</td>
    <td>${data.description}</td>
    <td>${data.category}</td>
    <td>${10}</td>
    <td>${data.amount}</td>
   </tr>`  ;
    
    ele1.appendChild(tbody);
    
 }

function reportGenerationYear(data) {
  const head1 = document.getElementById('yearlyElement');
  const today = new Date().toLocaleDateString('en-IN', { 
   year : "numeric"
  });
   head1.textContent = today;
    const ele1 =  document.querySelectorAll(".table")[2];
    const tbody = document.createElement('tbody');
    tbody.innerHTML = `<tr>
    <td>${data.createdAt}</td>
    <td>${data.description}</td>
    <td>${data.category}</td>
    <td>${10}</td>
    <td>${data.amount}</td>
   </tr>`  ;
    
    ele1.appendChild(tbody);
    
 }

 window.onload = handleOnLoad();