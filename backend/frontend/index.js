document.getElementById('signUpForm').addEventListener('submit',handleSignUp)
function handleSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    axios.post("http://localhost:3000/user/sign-up",{
        name:name,
        email : email,
        password : password
    })
    .then((res)=>{
       window.location.href = "/login.html"
    })
    .catch((err)=>{
        
    })
}