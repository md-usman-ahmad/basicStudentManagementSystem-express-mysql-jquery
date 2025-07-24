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

$(".edit").on("click",function(e){
    console.log(e.currentTarget.id);
    //  Method-1 --> Vanilla DOM
    console.log(" using Vanilla DOM =",document.getElementById("tName").innerText); // Or .innerText, or .textContent
    // Method - 2 --> Jquery
    console.log("using jquery =",$("#tName").text());


    let userId = $("#tuserId").html().trim();
    let logincount = $("#tlogincount").html().trim();
    console.log("typeof userId =",typeof userId,"userId =",userId);


    // Prefilling values in Edit Modal 
    $("#editName").val($("#tName").text().trim());  
    $("#editAge").val($("#tAge").html().trim());  
    let pronoun = $("#tGender").html().trim();
    $(`input[name='gender'][value='${pronoun}']`).prop("checked", true);
    let level = $("#tGrade").html().trim();
    $("#grade-select").val(level);
    $("#editContactno").val($("#tContactno").html().trim());
    $("#editEmail").val($("#tEmail").html().trim());
    $("#editUsername").val($("#tUsername").html().trim());
    $("#editPassword").val($("#tPassword").html().trim());

    // User updated Values 
    $("#editConfirm").on("click",function(){
        let name = $("#editName").val();
        let age = $("#editAge").val();
        let gender = $("input[name='gender']:checked").val();
        let grade = $("#grade-select").val();
        let contactno = $("#editContactno").val();
        let email = $("#editEmail").val();
        let username = $("#editUsername").val();
        let password = $("#editPassword").val();
        let updatedAt =new Date().toISOString().split("T")[0];
    
        console.log("typeof name =",typeof name," name =",name);
        console.log("typeof age =",typeof age," age =",age);
        console.log("typeof gender =",typeof gender," gender =",gender);
        console.log("typeof grade =",typeof grade," grade =",grade);
        console.log("typeof contactno =",typeof contactno," contactno =",contactno);
        console.log("typeof email =",typeof email," email =",email);
        console.log("typeof username =",typeof username," username =",username);
        console.log("typeof password =",typeof password," password =",password);
        console.log("typeof updatedAt =",typeof updatedAt," updatedAt =",updatedAt);
        axios({
            method : "PATCH",
            url : "http://localhost:8000/studentdashboard/edit",
            data : {
                userId,
                name,
                age,
                gender,
                grade,
                contactno,
                email,
                username,
                password,
                updatedAt,
                logincount

            }
        })
        .then(function(response){
            console.log("response =",response);
            $(".main").html(response.data+" refreshing the page in 2 seconds");
            toastBootstrap.show();
            $("#editSuccessMessage").html(response.data+" refreshing the page in 2 seconds");
            setTimeout(function(){
                location.reload();
            },2000)
        })
        .catch(function(error){
            console.log("error =",error);
        })
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