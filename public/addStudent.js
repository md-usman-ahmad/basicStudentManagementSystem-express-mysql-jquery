const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

$(".ad").on("click",function(){
    window.open("http://localhost:8000/admindashboard","_parent");
})

$("#submitbtn").on("click",function(){
    let name = $("#name").val();
    let fathername = $("#fathername").val()
    let age = $("#age").val();
    let gender = $("input[name='gender']:checked").val();
    // let gender = "";
    // if ($("#m").is(":checked")) {
    //     gender = $("#m").val();
    // } else if ($("#f").is(":checked")) {
    //     gender = $("#f").val();
    // }
    let grade = $("#grade-select").val();
    let contactno = $("#cn").val();
    // let email = $("#email").val();
    let username = $("#un").val();
    // let password = $("#pass").val();
    let createdAt = new Date().toISOString().split("T")[0]
    // let updatedAt = new Date().toISOString().split("T")[0]

    console.log("name =",name);
    console.log("fathername =",fathername);
    console.log("typeof age =",typeof age,"age =",age);
    console.log("typeof gender =",typeof gender,"gender =",gender);
    console.log("typeof grade =",typeof grade,"grade =",grade);
    console.log("typeof contactno =",typeof contactno,"contactno =",contactno);
    // console.log("typeof email =",typeof email,"email =",email);
    console.log("username =",username);
    // console.log("password =",password);

    axios({
        method : "POST",
        url : "http://localhost:8000/addstudent",
        data : {
            name,
            fathername,
            age,
            gender,
            grade,
            contactno,
            // email,
            username,
            // password,
            createdAt,
            // updatedAt
        }
    })
    .then(function(response){
        console.log("response =",response);
        $(".main").html(response.data);
        toastBootstrap.show();
    })
    .catch(function(error){
        console.log("error =",error);
        $(".main").html(error.response.data);
        toastBootstrap.show();
    })
})