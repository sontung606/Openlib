function onCustomerToggle() {
    var x = document.getElementById("passwordChanger");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function validate() {

    var a = document.getElementById("newpassword").value;
    var b = document.getElementById("confirm_password").value;
    if (a != b) {
        alert("Passwords not match");
        return false;
    }
    else{
        return confirm('Are you sure update information ?');
    }
}