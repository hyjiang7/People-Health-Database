/*deletes People_status based on id passed in*/
function deleteps(id){
    $.ajax({
        url: '/people_status/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};