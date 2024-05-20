

 document.getElementById('forgotPasswordForm').addEventListener('submit',(event)=>{
       event.preventDefault();
       const recieverMail = document.getElementById('recieverMail').value;
       axios.post(`http://localhost:3000/user/forgot-password`,{
         recieverMail : recieverMail
       })
       .then((response) =>{
          
          alert(response.data.message)
       })
       .catch((err) =>{
           console.log(err)
       })
 })