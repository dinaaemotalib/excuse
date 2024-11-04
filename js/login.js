function validate() {
    let user = document.getElementById("email").value;
    let user2 = document.getElementById("email");
    let re = 
        /^([a-zA-Z0-9._%-]+@eg.aiecons.com)$/i;
    if (re.test(user)) {
        window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSdjjElQ67_PRaav79-kk8rK9P1FxPZr0XjM7-_31W8awu7NYQ/viewform?usp=sf_link";
        alert("done");
        return true;
    }
    else {
        user2.style.border = "red solid 3px";
        return false;
    }
}

document.getElementById('loginnnnnnn').addEventListener("submit" , function(event){
    event.preventDefault();
    var username = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var user = localStorage.getItem(username);
    if(user){
        var parseduser = JSON.parse(user);
        if(parseduser.password === password){
            localStorage.setItem('user',JSON.stringify(parseduser));
            window.location.href = "../emp_homepage.html";
        }
        else{
            alert("incorrect password");
        }
    }
    else{
        alert("user not found");
    }
})

