/**Functions for filtering on the people_status page */
function filterPsByPeople() {
    console.log("insider filterPdsByPeople function")
    var id = $("#filter-people").val();
    window.location = '/people_status/filter/people/' + parseInt(id); 
}


function filterPsByStatus(){
    var id = $("#filter-status").val();
    window.location = '/people_status/filter/status/' + parseInt(id); 
}


function filterPsByDate(){
    var id = $("#filter-date").val();
    window.location = '/people_status/filter/date/' + parseInt(id); 
}
