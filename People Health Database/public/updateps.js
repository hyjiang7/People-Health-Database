
/**Display the values for the select dropdown */
function selectPersonID(value){
    console.log(value);
    $('#selectPersonID').val(value);
}

function selectStatusID(value){
    console.log(value);
    $('#selectStatusID').val(value);
}


/**Function to make ajax call to update sql  */
function updatePs(id){

    $.ajax({
        url: '/people_status/' + id,
        type: 'PUT',
        data: $('#updateps').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });

}

