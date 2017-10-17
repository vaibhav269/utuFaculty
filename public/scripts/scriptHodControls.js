function confirmFaculty(confirmBtn){
        $.ajax({
                url:"/facultyConfirm0",
                data:{confirmId:confirmBtn.id.replace('buttonConfirm','')},     //retriving faculty's _id from confirmBtn's id attribute
                type:"post",
                success:function(confirmId){
                        $("#faculty"+confirmId).hide(250);              //getting the id of container by using pattern 'faculty+faculty's _id'
                        }
                });
        }

function removeFaculty(removeBtn){
                $.ajax({
                        url:"/facultyRemove",
                        data:{removeId:removeBtn.id.replace('buttonRemove','')},     //retriving faculty's _id from confirmBtn's id attribute
                        type:"post",
                        success:function(removeId){
                                $("#faculty"+removeId).hide(250);              //getting the id of container by using pattern 'faculty+faculty's _id'
                                }
                        });
                }
