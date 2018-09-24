$(document).ready(function() {

    //when user presses enter
    $("#search").keypress(function(event) {
      if ((event.which === 13) && ($("#search").val())) {
        event.preventDefault();
        if (!$("#searchField").hasClass("#searched")) {
         $("#searchField").css("top", "0").addClass("searched");
        }
        
        //get search term and generate link for API call
          var searchTerm = $("#search").val();
          var link = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + searchTerm;
        // make call
          $.ajax({
            url: link,
            type: "GET",
            dataType: "jsonp",
            success: searchWikipedia,
            error: function() {
              console.log("Error occurred.");
            }
          });
        }
    });
  
    //callback function
    function searchWikipedia(wikiObj) {
      // create blank array to hold article objects
      var articles = [];
      
      // add each article to array, sort by index number
      var count = 1;
      $.each(wikiObj.query.pages, function(index, value) {
        articles.push(value);
      });
      articles.sort(function (a, b) {
        if (a.index > b.index) {
          return 1;
        }
        if (a.index < b.index) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      
      // clear any previous articles on page
      $("#articleList").empty();
      
      //create new article boxes and add them to page
      for (var i = 0; i < articles.length; i++) {
        var articleBox = new ArticleBox(articles[i].title, articles[i].extract, articles[i].pageid);
        articleBox.addBox();
      }
    }
    
    // Article box object
    function ArticleBox(title, snippet, pageid) {
      this.title = title;
      this.snippet = snippet;
      this.pageid = pageid;
      var self = this;
      this.divBox = "<a target='_blank' href=http://en.wikipedia.org/?curid=" + this.pageid + "><div class='article-box'" + this.index +"><h1>" + this.title + "</h1><p>" + this.snippet + "</p></div></a>";
      
      this.addBox = function() {
        var delay;
        if ($("#searchField").hasClass("searched")) {
          delay = 0;
        }
        else {
          delay = 500;
        }
        setTimeout(function() {
          $("#articleList").append(self.divBox).hide().fadeIn()
          
        }, delay);
      }
      
    }
  
  });