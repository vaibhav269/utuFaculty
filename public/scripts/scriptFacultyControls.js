$(document).ready(function(){
                $("#logout").on('click',function(){
                        location.href='/logout';
                });

                $(".editBtn").on('click',function(event){
                        event.preventDefault();
                        var tdId=this.id.toString().replace("EditBtn","");
                        if(tdId==="exp")
                        {
                                var expYears="expYears";
                                var expMonths="expMonths";
                                $('#expYears').prop('contenteditable',"true");
                                $('#expYears').css('border',"1px solid green");
                                $('#expMonths').prop('contenteditable',"true");
                                $('#expMonths').css('border',"1px solid green");
                        }
                        else{
                                $('#'+tdId).prop('contenteditable',"true");
                                $('#'+tdId).css('border',"1px solid green");
                        }
                });

                $(".saveBtn").on('click',function(event){
                        event.preventDefault();
                        var tdId=this.id.toString().replace("SaveBtn","");
                        var data={};
                        data.offEmail=$("#offEmail").text();
                        if(tdId==="exp")
                                {
                                        data.isExp=true;
                                        data.propertyName={};
                                        data.propertyValue={};
                                        data.propertyName={0:"expYears".toString(),1:"expMonths".toString()};       //sending array of Year and month
                                        data.propertyValue={0:$('#expYears').text(),1:$('#expMonths').text()};
                                }
                        else{
                                data.propertyName=tdId.toString();                      //sending single property
                                data.propertyValue=$('#'+tdId).text();
                        }
                        console.log(data);
                        $.ajax({
                                url:"/facultyUpdate",
                                data:data,
                                type:"post",
                                success:function(data){
                                                if(tdId==="exp")
                                                {
                                                        $('#expYears').prop('contenteditable',"false");
                                                        $('#expYears').css('border',"");
                                                        $('#expMonths').prop('contenteditable',"false");
                                                        $('#expMonths').css('border',"");
                                                }
                                                else{
                                                        $('#'+tdId).prop('contenteditable',"false");
                                                        $('#'+tdId).css('border',"");
                                                }
                                        }
                                });
                });

                $("#editProfile").on('click',function(){
                                $(".containers").hide();
                                $("#facultyDataContainer").show();
                });

                $("#dutiesAssigned").on('click',function(){
                                $(".containers").hide();
                                $("#dutiesContainer").show();
                });

                $(".externalBtn").on('click',function(){
                                $(".dutiesContainers").hide();
                                $("#externalExaminer").show();
                });

                $(".internalBtn").on('click',function(){
                                $(".dutiesContainers").hide();
                                $("#internalExaminer").show();
                });

                $("#externalExaminerFeedbackForm").on('submit',function(event){
                                event.preventDefault();
                                var formData=$("#externalExaminerFeedbackForm").serialize();
                                console.log(formData);
                                $.ajax({
                                        url:"/externalFeedback",
                                        data:formData,
                                        type:"post",
                                        success:function(data){
                                                $(".externalBtn:first").remove();
                                                $("#externalExaminer").hide();
                                        }
                                        });
                });

                $("#internalExaminerFeedbackForm").on('submit',function(event){
                                event.preventDefault();
                                var formData=$("#internalExaminerFeedbackForm").serialize();
                                $.ajax({
                                        url:"/internalFeedback",
                                        data:formData,
                                        type:"post",
                                        success:function(data){
                                                $(".internalBtn:first").remove();
                                                $("#internalExaminer").hide();
                                        }
                                        });
                });
});
