/*Deletes a status based on ID */
function deletestatus(id){
    $.ajax({
        url: '/status/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
};