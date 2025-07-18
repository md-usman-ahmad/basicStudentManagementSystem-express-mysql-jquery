const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

$(".ad").on("click",function(){
    window.open("http://localhost:8000/admindashboard","_parent");
})

$(".delete").on("click",function(e){
    console.log(e);
    console.log(e.currentTarget.id);
    let deletingUserId = e.currentTarget.id.split("-")[1];
    console.log(deletingUserId);
    let deletedAt = new Date().toISOString().slice(0,10);

    axios({
        method : "POST",
        url : "http://localhost:8000/showstudents",
        data : {
            deletingUserId,
            deletedAt
        }
    })
    .then(function(response){
       console.log("response =",response) ;
       $(".main").html(response.data);
       toastBootstrap.show();
       $(`#up-${deletingUserId} , #${e.currentTarget.id}`).attr("disabled","");
    })
    .catch(function(error){
        console.log("error =",error);
    })
})

let userId = 0;
$(".update").on("click",function(e){
    console.log(e)
    console.log(e.currentTarget.id);
    let updatinguserId = e.currentTarget.id.split("-")[1];

    // Prefilling the values in Edit modal
    userId = $(`#tuserId-${updatinguserId}`).html().trim();
    $("#editName").val($(`#tname-${updatinguserId}`).html().trim());
    $("#editAge").val($(`#tage-${updatinguserId}`).html().trim());
    let pronoun = $(`#tgender-${updatinguserId}`).html().trim();
    $(`input[name='gender'][value='${pronoun}']`).prop("checked", true);
    let level = $(`#tgrade-${updatinguserId}`).html().trim();
    $("#grade-select").val(level);
    $("#editContactno").val($(`#tcontactno-${updatinguserId}`).html().trim());
    $("#editEmail").val($(`#temail-${updatinguserId}`).html().trim());
    $("#editUsername").val($(`#tusername-${updatinguserId}`).html().trim());
    $("#editPassword").val($(`#tpassword-${updatinguserId}`).html().trim());
})

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
            url : "http://localhost:8000/showstudents",
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
                updatedAt
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