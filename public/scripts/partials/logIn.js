$(document).ready(function(){
        $("#logInForm").submit(function(event){
                event.preventDefault();                                 //to stop form from submitting
                var formData=$("#logInForm").serialize();
                $.ajax({
                        url:"/logInForm",
                        data:formData,
                        type:"post",
                        success:function(data){
                                if(data=="1")
                                        location.href="/logInFaculty";
                                else if(data=="2")
                                        location.href="/logInHod";
                                else if(data=="3")
                                        location.href="/logInDean";
                                }
                });
        });
});
