function onCustomerToggle() {
    var x = document.getElementById("passwordChanger");
    if (x.style.display === "none") {
        document.getElementById("hiddenpw").value = '';
        x.style.display = "block";
    } else {
        x.style.display = "none";
        document.getElementById("hiddenpw").value = '<%=accountUser.password%>';
}
}

function validate() {

    var a = document.getElementById("newpassword").value;
    var b = document.getElementById("confirm_password").value;
    if (a != b) {
        alert("Passwords not match");
        return false;
    }
}