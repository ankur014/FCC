
$(document).ready(function() {
    $(".random").on("click", random);
    $(".search").on("click", search);
    $(".searchQuery").keypress(function(e) {
        var key = e.which;
        if(key == 13) { // enter key code
            $(".search").click();
            return false;  
        }
    }); 

    $(".searchQuery").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "http://en.wikipedia.org/w/api.php?callback=?",
                dataType: "json",
                data: {
                    'action': "opensearch",
                    'search': request.term,
                    'format': "json"
                },
                success: function(data) {
                    response(data[1]);
                }
            });
        },
        // Minimum length for query to autocomplete
        minLength: 3
    });
});

function search() {
    query = $(".searchQuery").val();
    $.getJSON("https://en.wikipedia.org/w/api.php?callback=?", {
        action: 'query',
        format: 'json',
        formatversion: 2,
        prop: 'pageimages|extracts|info', // return page images, extracts
        pilimit: 10, // how many page images to return
        exlimit: 10, // how many extracts to return
        exchars: 500, // extract is 500 characters long
        explaintext: "", // extract is plain text, not HTML
        exintro: "", // return only content before the first section. has to be present otherwise wikipedia complains the extract are too long
        inprop: 'url', // return page url
        generator: 'search',
        gsrnamespace: 0, // Seach '(Main)'
        gsrlimit: 10, // return 10 pages,
        gsrsearch: query,
    }).done(function(json) {
        //console.log(JSON.stringify(json.query.pages));
        extractDisplay(json.query.pages);
    });  
}

function extractDisplay(articles) {
    $(".contentBox").text("");
    var str;
    articles.forEach(function(article) {
        str = '<div class="panel panel-info"><div class="panel-heading"><a target="_blank" href="';
        str += article.fullurl + '"><h3 class="panel-title">';
        str += article.title + '</h3></a></div><div class="panel-body">';
        str += article.extract
        str += '</div></div>';
        $(".contentBox").append(str);
    });
}

function random() {
    $.getJSON("https://en.wikipedia.org/w/api.php?callback=?", {
        action: 'query',
        format: 'json',
        formatversion: 2,
        list: 'random', // random entry
        rnnamespace: 0 // search only the main namespace
    }).done(function(json) {
        $(".searchQuery").val(json.query.random[0].title);
        search();
    });  
}  