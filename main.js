var app = angular.module("seddit", ['angularMoment']);

console.log("in the app");

app.controller("redditCards", function($scope, $http) {

  $scope.newPostForm = false;
  $scope.showNewPostForm = function() {
    console.log(this.newPostForm);
    if (this.newPostForm === false) {
      this.newPostForm = true
    } else {
      this.newPostForm = false;
    }
  }
  $scope.dropdown = false;
  $scope.showDropdown = function() {
    console.log("clicking goddammit");
    if ($scope.dropdown === false) {
      $scope.dropdown = true;
    } else {
      $scope.dropdown = false;
    }
  }
  $scope.filterMethod = "Score"
  $scope.posts;

   $scope.getData = function() {
    console.log("calling get data function");
    $http.get('https://www.reddit.com/r/earthporn.json').then(function(data) {
      console.log("called api");
      console.log(data);
      var posts = []
      // var data = data.data.data.children
      data.data.data.children.forEach(function(item) {
        var newPost = {
          comments: []
        }
        newPost.title = item.data.title;
        newPost.photo = item.data.preview.images[0].source.url;
        newPost.score = item.data.score;
        newPost.author = item.data.author;
        newPost.created = item.data.created;
        newPost.commentFormShow = false;
        newPost.commentShow = false;


        posts.push(newPost);
      })
      $scope.posts = posts;
    }).catch(function(err){
      console.log(err);
    })
  }

  $scope.addPost = function() {
    console.log(this.newTitle);
    var newPost = {
      comments: [],
      score: 0,
      created: Math.floor(Date.now() / 1000),
      commentFormShow: false,
      commentShow: false
    };
    newPost.title = this.newTitle;
    newPost.photo = this.newPhotoURL;
    newPost.author = this.newUsername;
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
