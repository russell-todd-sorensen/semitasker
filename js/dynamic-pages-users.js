// JavaScript Document
var prev = "";
var current = "Home";

// pages contains a null home page plus additional simple pages.
// additional pages are added via Content.set

// These are example pages override for your own website
var pages = {
  'home': {
    title: null,
    body: null,
    linkText: null,
    url: null
  },
  'products' : {
    title: "Super Products by Vertical",
    body: "<div>Our products are the best on this planet.</div>\n<ul><li>Product 1</li><li>Product 2</li></ul>"
  },
  'services': {
    title: "Services by Vertical",
    body: "<div>Our services are the best in the Known Universe.</div>"
  }
};

var Content = {
  pages: null,
  get: function (name, attribute) {
    return this.pages[name.toLowerCase()][attribute];
  },
  set: function (name, attribute, value) {
    var lName = name.toLowerCase();
    if (!this.pages[lName]) {
      // initialize on first use
      this.pages[lName] = {title: null, body: null};
    }
    if (arguments.length == 3) {
      this.pages[lName][attribute] = value;
    }
    else if (arguments.length == 2) {
      
      this.pages[lName] = {
        title: this.getTitle(attribute),
        body: this.getBody(attribute)
      };
    }
  },
  addNavigation: function ( name, linkText, url) {
    if (!this.exists(name)) return null;
    this.pages[name]['linkText'] = linkText;
    this.pages[name]['url'] = url;
  },
  writeNavigation: function (selector) {
    var ul = $(selector);
    ul.html("");
    for (var name in this.pages) {
      var page = this.pages[name];
      ul.append("<li><a href='" + page.url + "' id='" + name + "'>" + page.linkText + "</a></li>\n");
    }
  },
  getTitle:  function (id) {
    var t = $('#' + id).attr('title');
    return t == undefined ? "" : t;
  },

  getBody: function (id) {
    var b = $('#' + id).html();
    return b == undefined ? "" : b;
  },
  exists: function (name) {
    if (this.pages[name]) {
      return true;
    } else {
      return false;
    }
  },
  changeBack: function (evt) {
    current = prev;
    var target = evt.data;
    var blowupText = "";
    for (var i = 0; i < current.length; i++) {
      blowupText += current[i];
      blowupText += " ";
    }
    $(target).text(blowupText);
    
  },
  changeBackNavText: function (evt) {
    current = prev;
    var target = evt.data;
    var navText = current;
    
    $(target).text(navText);
  },
  changePage: function (evt) {
    prev = current;
    var page = current.toLowerCase();
    if (Content.exists(page)) {
      $('#page-title').text(Content.get(page,'title'));
      $('#content-inner').html(Content.get(page,'body'));
    } else {
      $('#page-title').text('Page ' + page.toUpperCase() + ' does not exist!');
      $('#content-inner').html('<div>The page you were looking for was not found.</div>');
    }
  },
 changeBlowup: function (evt) { // this is for vertical nav text
    var target = evt.data;
    var pageName = $(this).attr('id');
    prev = current;
    current = pageName;
    var blowupText = "";
    for (var i = 0; i < pageName.length; i++) {
      blowupText += pageName[i];
      blowupText += " ";
    }
    $(target).text(blowupText);
  },
  changeNavText: function (evt) { // this is for horizontal nav text
    var target = evt.data;
    var navText = $(this).text();
    prev = current;
    current = $(this).attr('id');
    $(target).text(navText);
    
  },
  init: function(pagesObject) {
    this.pages = pagesObject;
  }
}

function joinUser (formId) {
  
  var form = '#' + formId;
  var username = $(form + " #username").val();
  var password1 = $(form + " #password1").val();
  var password2 = $(form + " #password2").val();
  var errors = "";
  if (username.length < 3) {
    errors += "Username is too short, must be 3 or more characters.\n";
  }
  if (password1 != password2) {
    errors += "Passwords don't match, please try again.\n";
  }
  if (password1 == "" || password2 == "") {
    errors += "Passwords cannot be empty!\n";
  }
  if (password1.length < 3 || password2 < 3 ) {
    errors += "Passwords must be at least three characters long.\n";
  }
  
  if (errors != "") {
    alert("Some Errors Were Found with Your Submission:\n\n" + errors);
    return false;
  } else {
    alert("Thanks for joining " + username);
  }
  timestamp = Date.now();
  User.Add(username, password1, timestamp);
  Log.Notice("User '" + username + "' added");
  handleLogin();
  current = "Home";
  $('#home').click();
  return false;
}
var User = {
  template: "-Vertical-",
  name: null,
  password: null,
  lastLogin: 0,
  loginMilliseconds: 10000, // 600K = 10 minutes;
  loggedIn: false,
  url: baseUrl(),
  Init: function () {
    this.name     = localStorage.getItem(this.url + this.template + "USERNAME");
    this.lastLogin = localStorage.getItem(this.url + this.template + "TIMESTAMP-" + this.name);
    this.password  =  localStorage.getItem(this.url + this.template + "PASSWORD-" + this.name);
    var timestamp = Date.now();
    if (this.lastLogin == null) this.lastLogin = 0;
    
    return this.checkLastLogin(timestamp);
  },
  checkLastLogin: function (timestamp) {
    
    if (timestamp - this.lastLogin > this.loginMilliseconds) {
      this.loggedIn = false;
    } else {
      this.lastLogin = timestamp;
      this.loggedIn = true;
    }
    return this.loggedIn;
  },
  Add: function (username, password, timestamp) {
      localStorage.setItem(this.url + this.template + "USERNAME", username);
      localStorage.setItem(this.url + this.template + "PASSWORD-" + username, password);
      localStorage.setItem(this.url + this.template + "TIMESTAMP-" + username, timestamp);
      this.name = username;
      this.password = password;
      this.lastLogin = timestamp;
      this.loggedIn = true;
      return this.loggedIn;
  },
  Remove: function (username) {
      localStorage.removeItem(this.url + this.template + "TIMESTAMP-" + username);
      localStorage.removeItem(this.url + this.template + "PASSWORD-" + username);
      localStorage.removeItem(this.url + this.template + "USERNAME", username);
      return this;
  },
  Exists: function () {
    this.name = localStorage.getItem(this.url + this.template + "USERNAME");
    return (this.name != null);
  },
  Login: function (passwordField) {
    var x = 5;
    var password = $('#' + passwordField).val();
    if (!password) { 
      alert("enter a password and try again.");
      return false;
    }
    if (this.name == null) {
      alert("you are not a member yet, please sign up.");
      return false;
    } else {
      var username = this.name;
    }
    if (this.password == null) {
      var tmpPassword = localStorage.getItem(this.url + this.template + "PASSWORD-" + username);
    } else {
      var tmpPassword = this.password;
    }
    var timestamp = Date.now();
    if (password == tmpPassword) {
      this.password = tmpPassword;
      this.lastLogin = timestamp;
       localStorage.setItem(this.url + this.template + "TIMESTAMP-" + username, timestamp);
      this.loggedIn = true;
    } else {
      alert("invalid password, try again");
      return this.loggedIn = false;
    }
    handleLogin();
    return this.loggedIn;
  }
}

function baseUrl () {
  var url = document.URL;
  var urlHashIndex = url.search('#');
  if (urlHashIndex > -1) {
    url = url.substring(0,urlHashIndex);
  }
  return url;
}

function handleLogin() {
  if (!User.Exists()) {
    $('#login').html('<div id="sign-up" style="cursor: pointer; text-align: center;">Join Our Community</div>');
    $('#sign-up').click(function() {
      current = "Community"
      $('#community').click();
    });
  } else if (!User.Init()) {
     $('#login').html('<div id="sign-up">Login Expired!\n' + $('#login-expired').html() + '\n</div>');
    
  } else {
     $('#login').html('<div id="sign-up">Welcome Back ' + User.name + '</div>');
  }
}