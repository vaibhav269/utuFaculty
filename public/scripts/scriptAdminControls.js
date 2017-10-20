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

function initMap() {
               var input = document.getElementById('collegeLocation');
               var searchBox = new google.maps.places.SearchBox(input);

               // Listen for the event fired when the user selects a prediction and retrieve
               // more details for that place and show the map
               searchBox.addListener('places_changed', function() {
                       var places = searchBox.getPlaces();

                       if (places.length == 0) {
                               return;
                       }

                       // For each place, get the icon, name and location.
                       var bounds = new google.maps.LatLngBounds();

                       places.forEach(function(place) {
                               $("#lat").val(place.geometry.location.lat());    //setting the value of lat on choosing any position
                               $("#lng").val(place.geometry.location.lng());    //setting the value of lng on choosing any position

                               if (!place.geometry) {
                                       console.log("Returned place contains no geometry");
                                       return;
                               }

                               if (place.geometry.viewport) {
                                       // Only geocodes have viewport.
                                       bounds.union(place.geometry.viewport);
                               } else {
                                       bounds.extend(place.geometry.location);
                               }
                       });
               });
     }

$(document).ready(function(){
                $("#showDeans").on('click',function(){
                                $(".containers").hide();
                                $("#deanContainer").show();
                });

                $("#enterCollegeDetails").on('click',function(){
                                $(".containers").hide();
                                $("#collegeDetailsContainer").show();
                });


                $("#enterBranchDetails").on('click',function(){
                                $(".containers").hide();
                                $("#branchDetailsContainer").show();
                });

                $("#logout").on('click',function(){
                        location.href='/logout';
                });

                $("#collegeEnterForm").submit(function(event){
                        event.preventDefault();                                 //to stop form from submitting
                        var formData=$("#collegeEnterForm").serialize();
                        $.ajax({
                                url:"/collegeEnter",
                                data:formData,     //retriving faculty's _id from confirmBtn's id attribute
                                type:"post",
                                success:function(data){
                                        alert("Successfully entered");
                                        $("#collegeLocation").val("");
                                        $("#collegeName").val("");
                                        $("#lat").val("");
                                        $("#lng").val("");
                                        }
                                });
                });


                $("#branchEnterForm").submit(function(event){
                        event.preventDefault();                                 //to stop form from submitting
                        var formData=$("#branchEnterForm").serialize();
                        $.ajax({
                                url:"/branchEnter",
                                data:formData,     //retriving faculty's _id from confirmBtn's id attribute
                                type:"post",
                                success:function(data){
                                        alert("Successfully entered");
                                        $("#branchName").val("");
                                        $("#practicalSubjects").val("");
                                        }
                                });
                });
});
