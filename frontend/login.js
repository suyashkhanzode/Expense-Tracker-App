document.getElementById('loginform').addEventListener('submit',handleLogin)

function handleLogin(event) {
    debugger;
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    axios.post("http://localhost:3000/user/login",{
        email : email,
        password : password
    })
    .then((res)=>{
       if(res.data.message === "User authenticated successfully.")
       {
         const userId = res.data.user.id
         window.sessionStorage.setItem("userId",userId);
         window.location.href = '/expenseDashboard.html'
       } 
        
    })
    .catch((err)=>{
        
    })
}
