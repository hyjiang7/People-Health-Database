/*deletes Continent based on id passed in*/
function deletecontinent(id){
    $.ajax({
        url: '/continent/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};