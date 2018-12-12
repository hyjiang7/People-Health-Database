/**Display the values for the select dropdown */
function selectDiseaseID(value){
    console.log(value);
    $('#selectDiseaseID').val(value);
}


/**Function to make ajax call to update sql  */
function updateStatus(id){

    $.ajax({
        url: '/status/' + id,
        type: 'PUT',
        data: $('#updatestatus').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });

}