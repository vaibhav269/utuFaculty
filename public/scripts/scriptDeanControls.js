function confirmFaculty(confirmBtn){
        $.ajax({
                url:"/facultyConfirm",
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

function confirmHod(confirmBtn){
        $.ajax({
                url:"/hodConfirm",
                data:{confirmId:confirmBtn.id.replace('buttonConfirm','')},     //retriving faculty's _id from confirmBtn's id attribute
                type:"post",
                success:function(confirmId){
                        $("#hod"+confirmId).hide(250);              //getting the id of container by using pattern 'faculty+faculty's _id'
                                }
                });
        }

function removeHod(removeBtn){
        $.ajax({
                url:"/hodRemove",
                data:{removeId:removeBtn.id.replace('buttonRemove','')},     //retriving faculty's _id from confirmBtn's id attribute
                type:"post",
                success:function(removeId){
                $("#hod"+removeId).hide(250);              //getting the id of container by using pattern 'faculty+faculty's _id'
                        }
                });
}

$(document).ready(function(){
                $("#showHods").on('click',function(){
                                $(".containers").hide();
                                $("#hodContainer").show();
                });

                $("#showFaculties").on('click',function(){
                                $(".containers").hide();
                                $("#facultyContainer").show();
                });
                
                $("#logout").on('click',function(){
                        location.href='/logout';
                });

});
