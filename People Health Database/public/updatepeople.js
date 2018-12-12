
/**Display the values for the select dropdown */
function selectCurrentContinent(value){
    $('#selectCurrentContinent').val(value);
}


/**Function to make ajax call to update sql  */
function updatePeople(id){

    $.ajax({
        url: '/people/' + id,
        type: 'PUT',
        data: $('#updatepeople').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });

}