/**Display the values for the select dropdown */
function selectlifestyleInfluence(value){

    $('#lifestyle-selector').val(value);
}

function selecthereditary(value){
  
    $('#hereditary-selector').val(value);
}


/**Function to make ajax call to update sql  */
function updateDisease(id){

    $.ajax({
        url: '/disease/' + id,
        type: 'PUT',
        data: $('#updatedisease').serialize(),
        success: function(result){
            
            window.location.replace("./");
        }
    });

}
