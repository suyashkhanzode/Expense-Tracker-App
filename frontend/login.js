
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    axios.post("",{
        email : email,
        password : password
    })
    .then((res)=>{

    })
    .catch((err)=>{

    })
}