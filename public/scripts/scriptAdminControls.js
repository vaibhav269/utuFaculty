function confirmDean(confirmBtn){
        $.ajax({
                url:"/deanConfirm",
                data:{confirmId:confirmBtn.id.replace('buttonConfirm','')},     //retriving faculty's _id from confirmBtn's id attribute
                type:"post",
                success:function(confirmId){
                        $("#dean"+confirmId).hide(250);              //getting the id of container by using pattern 'faculty+faculty's _id'
                        }
                });
        }

function removeDean(removeBtn){
                $.ajax({
                        url:"/deanRemove",
                        data:{removeId:removeBtn.id.replace('buttonRemove','')},     //retriving faculty's _id from confirmBtn's id attribute
                        type:"post",
                        success:function(removeId){
                                $("#dean"+removeId).hide(250);              //getting the id of container by using pattern 'faculty+faculty's _id'
                                }
                        });
                }
