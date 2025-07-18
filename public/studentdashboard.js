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