const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

$(".newPasswordConfirm").on("click",function(){
    let username = $("#fpusername").val();
    let newPassword = $("#enp").val();

    axios({
        method : "PATCH",
        url : "http://localhost:8000/login",
        data : {
            username,
            newPassword
        }
    })
    .then(function(response){
        console.log("response =",response);
        $("#enpSuccessMessage").html(response.data);
        $(".main").html(response.data);
        toastBootstrap.show();
        setTimeout(function(){
            location.reload()
        },2000)
    })
    .catch(function(error){
        console.log("error =",error);
    })
})

$("#loginConfirm").on("click",function(e){
    e.preventDefault();
    let username = $("#loginUsername").val();
    let password = $("#loginPassword").val();

    axios({
        method : "POST",
        url : "http://localhost:8000/login",
        data : {
            username,
            password
        }
    })
    .then(function(response){
        console.log("response =",response);
        $("#loginSuccessMessage").html(response.data + " redirecting you to Your Dashboard in 2 seconds");
        $(".main").html(response.data + " redirecting you to Your Dashboard in 2 seconds");
        toastBootstrap.show();
        setTimeout(function(){
            window.open("http://localhost:8000/home" , "_parent");
        },2000)

    })
    .catch(function(error){
        console.log("error =",error);
        $("#loginErrorMessage").html(error.response.data);
        $(".main").html(error.response.data);
    })
})