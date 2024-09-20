document.getElementById('loginform').addEventListener('submit',handleLogin)

function handleLogin(event) {
    
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
        debugger;
         const token = res.data.token;
         const isPremiumUSer = res.data.isPremiumUser;
         window.sessionStorage.setItem("token",token);
         window.sessionStorage.setItem("isPremiumUSer",isPremiumUSer)
         window.location.href = '/expenseDashboard.html'
       } 
        
    })
    .catch((err)=>{
      debugger;
        alert(`${err.response.data.message}`)
    })
}
