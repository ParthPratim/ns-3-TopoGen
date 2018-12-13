function createNSTFile(name,author,components,callback){
    $.ajax({
        type : "POST",
        url : "http://localhost:2018/generator/nst",
        data : {
            "topo_info" : JSON.stringify({
                mname : name,
                mauthor : author,
                mcomponents : components
            }) 
        },
        success : function(response){
            callback(response)
        }
    })
}