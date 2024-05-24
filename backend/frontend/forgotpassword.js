

 document.getElementById('forgotPasswordForm').addEventListener('submit',(event)=>{
       event.preventDefault();
       const recieverMail = document.getElementById('recieverMail').value;
       axios.post(`http://13.201.0.34:3000/password/forgot-password`,{
         recieverMail : recieverMail
       })
       .then((response) =>{
          
          alert(response.data.message)
       })
       .catch((err) =>{
           console.log(err)
       })
 })