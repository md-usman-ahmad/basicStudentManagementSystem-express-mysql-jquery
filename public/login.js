const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

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