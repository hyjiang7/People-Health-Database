/**Deletes continent based on ID passed in */
function deletedisease(id){
    $.ajax({
        url: '/disease/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};