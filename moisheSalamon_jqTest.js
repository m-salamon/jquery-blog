/* global $ */
(function () {
    "use strict";

    var loadUsers = $('.loadUsers'),
        blogsArray = [],
        blogPosts = [],
        loadBlog = $('#loadBlog'),
        home = $('#home'),
        loadBlogger = $('#loadBlogger');

    home.click(function (event) {
        pageStart();
        event.preventDefault();
    });

    function pageStart() {
        $('#prev').hide();
        $('#next').hide();
        blogsArray = [];
        $.getJSON('https://jsonplaceholder.typicode.com/users', function (data) {
            data.forEach(function (d) {
                blogsArray.push(d);
            });
            listUsers();

        }).fail(function (jqxhr) {
            alert(jqxhr);
        });
    }
    pageStart();

    function listUsers() {
        loadUsers.empty();
        loadBlog.empty();
        loadBlogger.empty();
        blogsArray.forEach(function (b) {
            loadUsers.append('<div class="info"><a id="' + b.id + '" href="' + b.id + '">' +
                             'Name: ' + b.name + '</br>' +
                             'Website: ' + b.website + '</br>' +
                             'Company Name: ' + b.company.name + '</br>' +
                             '</a></div>');
        });

    }

    var bloggerName;
    loadUsers.on('click', function (event) {
        event.preventDefault();
        var id = event.target.id;
        
        if (!id) {
            return;
        }
        bloggerName = blogsArray.filter(function (v) {
            return v.id == id; // Filter out the appropriate one
        })[0].name; // Get result and access the foo property
        blogPosts = [];
        console.log(bloggerName);
        
//        var bloggerNameNew = blogsArray.find(function (v){
//             return v.id == id;                               
//        });
//        console.log(bloggerNameNew.name);
        
        
        $.getJSON('https://jsonplaceholder.typicode.com/posts?userId=' + id, function (data) {
            data.forEach(function (d) {
                blogPosts.push(d);
            });

            blog();
        }).fail(function (jqxhr) {
            alert(jqxhr);
        });

    });

    var newBlogPost;

    function blog() {
        $('#next').show();
        loadUsers.empty();
        loadBlogger.empty();
        newBlogPost = blogPosts.slice(begin, i);

        loadBlogger.append('<div>' + bloggerName + "'s Blog</div>");
         newBlogPost.forEach(function (b) {
            var newS = $('<div class="info" id="' + b.id + '"><strong>' + b.title + '</strong></br>' + b.body + '</br><div class="showComment" id="' + b.id + '">show comments</div></br></div>').appendTo(loadBlog);
             console.log(newS[0].id);
        });
         
    }
   
    var begin = 0,
        i = 3;

    function controlButtons() {
        if (begin === 0) {
            $('#prev').hide();
        } else if (begin > 0) {
            $('#prev').show();
        }
        if (i > blogPosts.length - 1) {
            $('#next').hide();
        } else if (i < blogPosts.length) {
            $('#next').show();
        }
    }

    $('#prev').click(function () {
        $('.info').remove();
        i -= 3;
        begin -= 3;
        blog();
        controlButtons();
    });

    $('#next').click(function () {
        $('.info').remove();
        i += 3;
        begin += 3;
        blog();
        controlButtons();
    });

    $(document).on("click", ".showComment", function (event) {
        event.preventDefault();
        var id = this.id,
            that = $(this).get(0);
        $(that).removeClass("showComment").addClass("hideComment").text('hide comments');
        $.getJSON('https://jsonplaceholder.typicode.com/comments?postId=' + id, function (data) {
            data.forEach(function (d) {
                $('<div id="' + d.postId + '">' + d.id + ' ' + d.body + '</br><strong>' + d.name + '</strong></br></div>').css({
                    color: '#a3a3a3',
                    padding: '5px',
                    backgroundColor: '#ffffb2',
                    margin: '2px'
                }).appendTo(that);
            });

        }).fail(function (jqxhr) {
            alert(jqxhr);
        });
        return;
    });

    $(document).on("click", ".hideComment", function (event) {
        event.preventDefault();
        $(this).find("div").remove();
        $(this).removeClass("hideComment").addClass("showComment").text('show comments');
    });

}());
