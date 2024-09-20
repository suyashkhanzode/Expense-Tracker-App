document
  .getElementById("updatepasswordForm")
  .addEventListener("submit", (event) => {
    
    const params = new URLSearchParams(window.location.search);
    const requestUUID = params.get("requestUUID");
    const newPassword = document.getElementById("newPassword").value;
    
    axios
      .put(`http://localhost:3000/password/update-password/${requestUUID}`, {
        newPassword: newPassword,
      })
      .then((response) => {
        
          debugger;
        if (response.data.message === "Password updated successfully") {
          alert(response.data.message);
          window.location.href = "login.html";
        } else {
          alert("Fail to  Update Password");
        }
      })
      .catch((err) => {

        debugger;
      });
  });
