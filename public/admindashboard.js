$(".showstudents").on("click",function(){
    window.open("http://localhost:8000/showstudents", "_parent")
})

$(".addstudent").on("click",function(){
    window.open("http://localhost:8000/addstudent", "_parent")
})

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