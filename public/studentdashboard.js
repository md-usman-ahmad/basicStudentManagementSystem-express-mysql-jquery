const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)


$("#logout").on("click",function(){
    axios({
        method : "POST",
        url : "http://localhost:8000/logout"
    })
    .then(function(response){
        console.log("response = ", response);
        alert(response.data);
        location.reload();
    })
})

$("#updatePasswordbtn").on("click",function(){
    let username = $("#Username").val();
    let newPassword = $("#enp").val();

    axios({
        method : "PATCH",
        url : "http://localhost:8000/studentdashboard",
        data : {
            username,
            newPassword
        }
    })
    .then(function(response){
        console.log("response =",response);
        $(".main").html(response.data + " Redirecting you to login page in 2 seconds");
        toastBootstrap.show();
        $("#SuccessMessage").html(response.data + " Redirecting you to login page in 2 seconds");
        setTimeout(function(){
            window.open("http://localhost:8000/login" , "_parent");
        },2000)        
    })
    .catch(function(error){
        console.log("error =",error);
    })
})