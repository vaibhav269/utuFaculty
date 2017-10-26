$(document).ready(function(){

        $("#signUpForm").submit(function(event){
                event.preventDefault();                                 //to stop form from submitting
        });

        $("#buttonNext").on('click',function(){
                $("#step1").hide(250);
                $("#step2").delay(250).show(250);
                $("#buttonNext").off("click");                          //removing event from first button
                $("#buttonNext").attr("id","buttonNext2");             //changing id of button initially
                $("#buttonNext2").on('click',function(){

                        var desigVal=$("#designation").val();   //getting the designation to show fields accordingly

                        if(desigVal==1)
                                $(".branch").show();
                        else if(desigVal==2)
                                $(".dateJoinHod").show();
                        else
                                $(".dateJoinDean").show();

                        $("#step2").hide(250);
                        $("#step3").delay(250).show(250);
                        $("#buttonNext2").off("click");                          //removing event from second button
                        $("#buttonNext2").val("Submit");                        //changing value from next to submit
                        $("#buttonNext2").attr("id","buttonSubmit");             //changing id of button finally
                        $("#buttonSubmit").click(function(){
                                $("#signUpForm").unbind('submit');     //removing previous submit event
                                $("#signUpForm").submit(function(event){              //adding new submit event
                                        event.preventDefault();
                                        var formData=$("#signUpForm").serialize();
                                        $.ajax({
                                                url:"/signUpForm",
                                                data:formData,
                                                type:"post",
                                                success:function(data){
                                                        $("#step4").show();
                                                        $("#step3").hide(250);
                                                        $("#buttonSubmit").remove();
                                                        }
                                        });
                                });
                });
                });
});

        $("#signUpFieldCollegeName").on('change',function(){                            //setting the college code according to college selected
                var x = document.getElementById("signUpFieldCollegeName");      //getting the container or select element
                var val=x.options[x.selectedIndex].getAttribute("data-college-code");   //getting the selected or option element
                        $("#signUpFieldCollegeCode").val(val);                                  //setting the college code accordingly
                });
});
