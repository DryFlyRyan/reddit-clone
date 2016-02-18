app.controller("redditCards", function($scope, $http) {

  $scope.items = [
    {
      action: "+score",
      text: "Highest Score"
    },
    {
      action: "-score",
      text: "Lowest Score"
    },
    {
      action: "+created",
      text: "Newest"
    },
    {
      action: "-created",
      text: "Oldest"
    },
    {
      action: "-title",
      text: "Title Ascending"
    },
    {
      action: "+title",
      text: "Title Descending"
    },
  ];

  $scope.changeFilter = function(filterMethod) {
    $scope.filterMethod = filterMethod || $scope.searchText;
  }

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

  $scope.newPostForm = false;
  $scope.showNewPostForm = function() {
    console.log(this.newPostForm);
    if (this.newPostForm === false) {
      this.newPostForm = true
    } else {
      this.newPostForm = false;
    }
  }

  $scope.filterMethod = "-score";

  if ($scope.searchText) {
    $scope.filterMethod = $scope.searchText
  }

  $scope.posts;

   $scope.getData = function() {
    console.log("calling get data function");
    $http.get('https://www.reddit.com/r/earthporn.json').then(function(epdata) {
      var epPosts = epdata.data.data.children;
      $http.get('https://www.reddit.com/r/showerthoughts.json')
      .then(function(stdata){
        var stPosts = stdata.data.data.children;
        var posts = [];
        // var data = data.data.data.children
        for (var i = 0; i < epPosts.length - 1; i++) {
          var newPost = {
            comments: []
          };
          newPost.title = epPosts[i].data.title;
          newPost.photo = epPosts[i].data.preview.images[0].source.url;
          newPost.score = epPosts[i].data.score;
          newPost.author = epPosts[i].data.author;
          newPost.created = epPosts[i].data.created - 28800;
          newPost.description = stPosts[i+1].data.title
          newPost.commentFormShow = false;
          newPost.commentShow = false;

          posts.push(newPost);
        }
        $scope.posts = posts;
      })
    }).catch(function(err){
      console.log(err);
    })
  }

  $scope.addPost = function() {
    console.log(this.newTitle);
    var newPost = {
      comments: [],
      score: 0,
      commentFormShow: false,
      commentShow: false
    };
    newPost.title = this.newTitle;
    newPost.photo = this.newPhotoURL;
    newPost.author = this.newUsername;
    newPost.description = this.newDescription;
    newPost.created = Date.now() / 1000;
    $scope.posts.push(newPost);
    $scope.newPostForm = false;

  }

  $scope.upvote = function(post) {
    post.score = post.score + 1;
  }
  $scope.downvote = function(post) {
    post.score = post.score - 1;
  }

  $scope.showComments = function(post) {
    console.log("showComments");
    console.log(post.commentShow);
    if (post.commentShow === false ) {
      post.commentShow = true;
    } else {
      post.commentShow = false;
    }
  }

  $scope.showForm = function(post) {
    console.log("showForm");
    console.log(post.commentFormShow);
    if (post.commentFormShow === false) {
      post.commentFormShow = true;
    } else {
      post.commentFormShow = false;
    }
  }

  $scope.postComment = function(post) {
    var comment = {}
    comment.commentBody = this.commentBody;
    comment.username = this.username;
    this.post.comments.push(comment);
    $scope.showComments(post);
    $scope.showForm(post);
    this.username = '';
    this.commentBody = '';
  }

});
