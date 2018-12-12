/**Display the values for the select dropdown */
function selectClimate(value){

    $('#selectClimate').val(value);
}

function selectPublicHealth(value){
 
    $('#selectPublicHealth').val(value);
}

function selectDiseaseName(value){
   
    $('#selectDiseaseName').val(value);
}


/**Function to make ajax call to update sql  */
function updateContinent(id){

    $.ajax({
        url: '/continent/' + id,
        type: 'PUT',
        data: $('#updatecontinent').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });

}
