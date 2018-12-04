/* Global Variables */
var currentVersion = "1.0.0";
var mobile    = false;

// No slash at the end of the url
var serverParentURL = "http://derek-kim.com:8000";
// "http://derek-kim.com:8000"
// "http://127.0.0.1:8000";

// Alternate between new and old servers
var server_toggle = true;  // If toggle on, new server

var info = $("<div>[DEBUG]" + serverParentURL + "<br>is new: " + server_toggle + "</div>")
            .css({ position: 'fixed', right: '50px', top: '80px', 'font-size': '10px'});
if (serverParentURL != "http://derek-kim.com:8000") {
  info.css({color: 'red', 'font-size': '20px'});
}
$('body').append(info)



/* Global Functions */

//============================================================
// Popup
//------------------------------------------------------------
function popup( message, time, callback ){

  var timebomb   = time     || 60000;
  var callbackFn = callback || function(){return true;};

  $("#popup-client").html(message).css({"display":"block"}).animate({ marginTop : "45px"} , 500);
  callbackFn();

  setTimeout(function(){

    $("#popup-client").animate({ marginTop : "-90px"} , 1000);

  }, timebomb);

}


//============================================================
// Get Url Parameter on client side
//------------------------------------------------------------
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


//============================================================
// Scroll reach specific div
//------------------------------------------------------------
function scrollReachDiv(elm,callback){
  var randEventName = "." + Math.floor(Math.random()*1000000);

  $(window).bind("scroll" + randEventName,function() {
    var elmTop        = elm.offset().top,
        buffer        = $(window).height();

    if(elmTop - buffer < $(window).scrollTop()){

      callback();
      $(this).unbind("scroll" + randEventName);

    }

  });
}


//============================================================
// Get Random Int
//------------------------------------------------------------
function getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}


//============================================================
// Cookie
//------------------------------------------------------------
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


//============================================================
// Pullup Menu
//------------------------------------------------------------

function pullupMenu(menu,successFn){

  var successFn = successFn || function(){};

  $("#pullup").css({"display":"block"});
  $("#template-view").css({"overflow":"hidden"});
  $("body").css({"overflow":"hidden"});

  anime({
    targets: '#pullup .pullup-inner',
    translateY: '-100%',
    duration: 500,
    easing: 'easeInOutQuart'
  });

  $("#pullup .pullup-inner").css({"display":"block"}).html('<span class="loading-spinner"></span>');

  var res;
  var promise = $.ajax({
          method    : "GET",
          url       : serverParentURL + "/misc/" + menu,
          xhrFields : {withCredentials: true},
          success   : function( response ) {
                      $("#pullup .pullup-inner").html("");
                      $("#pullup .pullup-inner").append($.parseHTML(response));

                      // Event Handler Enactive
                      $("#pullup .background").off('click').on('click',function(){

                        $("#pullup").css({"display":"none"});
                        $("body").css({"overflow":"inherit"});
                        $("#template-view").css({"overflow":""});
                        anime({
                          targets: '#pullup .pullup-inner',
                          translateY: '100%',
                          duration: 10
                        });

                      });

                      $("#pullup .pullup-item").off('click').on('click',function(){

                        $("#pullup").css({"display":"none"});
                        $("body").css({"overflow":"inherit"});
                        $("#template-view").css({"overflow":""});
                        anime({
                          targets: '#pullup .pullup-inner',
                          translateY: '100%',
                          duration: 10
                        });

                      });

                      $("woot-click").off('click').on('click',function(){

                        $("#pullup").css({"display":"none"});
                        $("body").css({"overflow":"inherit"});
                        $("#template-view").css({"overflow":""});
                        initiator($(this).attr("href"));
                        history.pushState(null, null, document.location.pathname + '#' + $(this).attr("href"));

                      });

                    },
          error     : function( request, status, error ) {

                    }
  });

  promise.then(function(){
    successFn(res);
  });

}


//============================================================
// Render template
//------------------------------------------------------------

function renderTemplate( templateUrl, targetElm, successFn, failureFn ){

  var successFn = successFn || function(){};
  var failureFn = failureFn || function(){};

  var res;
  var promise = $.ajax({
          method    : "GET",
          url       : templateUrl,
          xhrFields: {withCredentials: true},
          success   : function( response ) {

                      $(targetElm).html("");
                      $(targetElm).append($.parseHTML(response, null, true));
                      $(targetElm).css({"display":"block"});
                      $("woot-click").off('click').on('click',function(){
                        initiator($(this).attr("href"));
                        history.pushState(null, null, document.location.pathname + '#' + $(this).attr("href"));
                      });

                    },
          error     : function( request, status, error ) {

                    }

  });

  promise.then(function(){
    return successFn(res);
  })
  .catch(function(){
    return failureFn(res);
  });

}


//============================================================
// Global Event Handler
//------------------------------------------------------------

function globalEventHandler(){

  $(".history-back").off('click').on('click',function(){
    history.back();
  });

  $(".history-home").off('click').on('click',function(){
    window.location.replace('./index.html');
  });

  $("woot-click").off('click').on('click',function(){
    initiator($(this).attr("href"));
    history.pushState(null, null, document.location.pathname + '#' + $(this).attr("href"));
  });

}

//============================================================
// Timestamp Converter
//------------------------------------------------------------

function timestampConverter(timestamp){

  var a       = new Date(timestamp * 1000);
  var months  = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var year    = a.getFullYear();
  var month   = months[a.getMonth()];
  var date    = a.getDate();
  var hour    = a.getHours();
  var min     = a.getMinutes();
  var ampm    = '';

  if(hour > 12){
    ampm      = '오후';
    hour      = hour - 12;
  }else{
    ampm      = '오전';
  }

  var time    = month + ' ' + date + '일 ' + ampm + ' ' + hour + '시 ' + min + '분' ;
  return time;

}


//============================================================
// image element delete (Special case)
//------------------------------------------------------------

function imageElementDelete(e,inputOrder){

  $("#write-section-item-photo-preview-" + inputOrder).removeClass("selected").empty();

  // Reset input
  $("#write-posting-input-photo-wrapper").find("input").each(function(){

    if(this.getAttribute('data-inputOrder') == inputOrder){
      $(this).val("");
    }

  });

  $("#write-section-item-photo-button").removeClass("disabled");

}


/* End of Global Functions */


//============================================================
// View Configuration
//------------------------------------------------------------
var viewConfig = {

  "/index" : {
    "controller"  : "mainCtrl",
    "template"    : serverParentURL + "/index",
    "header"      : "./header/index.html"
  },
  "/login" : {
    "controller"  : "loginCtrl",
    "template"    : serverParentURL + "/account/login",
    "footerHide"  : true
  },
  "/login/intro" : {
    "controller"  : "loginCtrl",
    "template"    : serverParentURL + "/login/intro",
    "footerHide"  : true
  },
  "/login/signup" : {
    "controller"  : "signupCtrl",
    "template"    : serverParentURL + "/login/signup",
    "footerHide"  : true
  },
  "/signup/1" : {
    "controller"  : "signupCtrl",
    "template"    : serverParentURL + "/account/address",
    "footerHide"  : true
  },
  "/signup/2" : {
    "controller"  : "signupCtrl",
    "template"    : serverParentURL + "/login/signup.2",
    "footerHide"  : true
  },
  "/signup/3" : {
    "controller"  : "signupCtrl",
    "template"    : serverParentURL + "/login/signup.3",
    "footerHide"  : true
  },
  "/signup/4": {
    "controller": "signupCtrl",
    "template": serverParentURL + "/login/signup.4",
    "footerHide": true
  },
  "/signup/5": {
    "controller": "signupCtrl",
    "template": serverParentURL + "/login/signup.5",
    "footerHide": true
  },
  "/login/signup/confirm" : {
    "controller"  : "signupConfirmCtrl",
    "template"    : serverParentURL + "/login/confirm",
    "footerHide"  : true
  },
  "/message" : {
    "controller"  : "messageCtrl",
    "template"    : serverParentURL + "/message/discover",
    "header"      : "./header/message.html"
  },
  "/message/inbox" : {
    "controller"  : "messageInboxCtrl",
    "template"    : serverParentURL + "/message/inbox",
    "header"      : "./header/message.inbox.html",
    "footerHide"  : true
  },
  "/notification" : {
    "controller"  : "notificationCtrl",
    "template"    : serverParentURL + "/notification/notification",
    "header"      : "./header/notification.html"
  },
  "/write" : {
    "controller"  : "writeCtrl",
    "template"    : serverParentURL + "/write/gathering",
    "header"      : "./header/write.html",
    "footerHide"  : true
  },
  "/write/posting/edit" : {
    "controller"  : "writePostingCtrl",
    "template"    : serverParentURL + "/write/posting.edit",
    "header"      : "./header/write.posting.edit.html",
    "footerHide"  : true
  },
  "/post_category_list" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/board/discover",
    "header"      : "./header/board.html"
  },
  "/post_list" : {
    "controller"  : "postListCtrl",
    "template"    : serverParentURL + "/board/posting",
    "header"      : "./header/board.posting.html"
  },
  "/post_detail" : {
    "controller"  : "postDetailCtrl",
    "template"    : serverParentURL + "/board/detail",
    "header"      : "./header/board.posting.html"
  },
  "/board/posting/detail/like" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/board/like",
    "header"      : "./header/board.posting.like.html"
  },
  "/gathering_list" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/gathering/discover",
    "header"      : "./header/gathering.html"
  },
  "/gathering_list/my" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/gathering/my",
    "header"      : "./header/gathering.my.html"
  },
  "/gathering_detail" : {
    "controller"  : "gatheringCtrl",
    "template"    : serverParentURL + "/gathering/detail",
    "header"      : "./header/gathering.detail.html",
    "footerHide"  : true
  },
  "/gathering/like" : {
    "controller"  : "gatheringCtrl",
    "template"    : serverParentURL + "/gathering/like",
    "header"      : "./header/gathering.like.html",
    "footerHide"  : true
  },
  "/gathering_members" : {
    "controller"  : "gatheringCtrl",
    "template"    : serverParentURL + "/gathering/participants",
    "header"      : "./header/gathering.participants.html",
    "footerHide"  : true
  },
  "/gathering/chat" : {
    "controller"  : "chatCtrl",
    "template"    : serverParentURL + "/gathering/chat",
    "header"      : "./header/gathering.chat.html",
    "footerHide"  : true
  },
  "/gathering/review" : {
    "controller"  : "gatheringReviewCtrl",
    "template"    : serverParentURL + "/gathering/review",
    "header"      : "./header/gathering.review.html",
    "footerHide"  : true
  },
  "/gathering/review/write" : {
    "controller"  : "gatheringReviewCtrl",
    "template"    : serverParentURL + "/write/gathering.review",
    "header"      : "./header/gathering.review.html",
    "footerHide"  : true
  },
  "/account/more" : {
    "controller"  : "accountMoreCtrl",
    "template"    : serverParentURL + "/people/discover",
    "header"      : "./header/people.html"
  },
  "/account/profile" : {
    "controller"  : "profileCtrl",
    "template"    : serverParentURL + "/people/profile",
    "header"      : "./header/people.profile.html"
  },
  "/account/edit" : {
    "controller"  : "profileEditCtrl",
    "template"    : serverParentURL + "/people/edit",
    "header"      : "./header/people.profile.edit.html"
  },
  "/account/change_password" : {
    "controller"  : "passwordEditCtrl",
    "template"    : serverParentURL + "/people/edit.password",
    "header"      : "./header/people.profile.edit.password.html"
  },
  "/debug" : {
    "controller"  : "debugCtrl",
    "template"    : serverParentURL + "/debug",
    "header"      : "./header/index.html"
  }

}

if (server_toggle){
  // Don't put / at the end for now
  viewConfig["/index"]["template"] = serverParentURL;
  viewConfig["/notification"]["template"] = serverParentURL + "/action/notification";

  viewConfig["/login/intro"]["template"] = serverParentURL + "/account/not_logged_in";
  viewConfig["/signup/1"]["template"] = serverParentURL + "/account/signup/address";
  viewConfig["/signup/2"]["template"] = serverParentURL + "/account/signup/register";
  viewConfig["/signup/3"]["template"] = serverParentURL + "/account/signup/info";
  viewConfig["/signup/4"]["template"] = serverParentURL + "/account/signup/block_select";
  viewConfig["/signup/5"]["template"] = serverParentURL + "/account/signup/verify";

  viewConfig["/message"]["template"] = serverParentURL + "/misc/message_list";     
    
  viewConfig["/gathering_list"]["template"] = serverParentURL + "/gathering_list";
  viewConfig["/gathering_list/my"]["template"] = serverParentURL + "/gathering_list/my/";
  viewConfig["/gathering_detail"]["template"] = serverParentURL + "/gathering_detail";
  viewConfig["/gathering_members"]["template"] = serverParentURL + "/gathering_members";

  viewConfig["/write"]["template"] = serverParentURL + "/misc/write";

  viewConfig["/post_category_list"]["template"] = serverParentURL + "/post_category_list";
  viewConfig["/post_list"]["template"] = serverParentURL + "/post_list";
  viewConfig["/post_detail"]["template"] = serverParentURL + "/post_detail";
    
  viewConfig["/account/more"]["template"] = serverParentURL + "/account/more";
  viewConfig["/account/profile"]["template"] = serverParentURL + "/account/profile";
  viewConfig["/account/edit"]["template"] = serverParentURL + "/account/edit";
  viewConfig["/account/change_password"]["template"] = serverParentURL + "/account/change_password";
}

var api = {

  get : function(url,successFn){
    var successFn = successFn || function(){};
    var res;
    var promise = $.ajax({
              method    : "GET",
              url       : serverParentURL + url,
              dataType  : "json",
              xhrFields : {withCredentials: true},
              success   : function( response ) {
                          res = response;},
              error     : function( request, status, error ) {}
    });

    promise.then(function(){
      return successFn(res);
    })
    .catch(function(){
      var elm = '<div id="popup-message">' +
                  '<span>API 연결 오류</span>' +
                '</div>';
      $("body").append(elm);

      setTimeout(function(){
        $("#popup-message").remove();
      }, 5000);
    });
  },

  post : function(url,data,successFn){
    var successFn = successFn || function(){};
    var res;
    var promise = $.ajax({
              method    : "POST",
              data      : data,
              url       : serverParentURL + url,
              dataType  : "json",
              headers   : {
                      'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
              },
              xhrFields : { withCredentials: true },
              success   : function( response ) {
                          res = response;
                        },
              error     : function( request, status, error ) {}
    });

    promise.then(function(){
      return successFn(res);
    })
    .catch(function(){
      var elm = '<div id="popup-message">' +
                  '<span>API 연결 오류</span>' +
                '</div>';
      $("body").append(elm);
      setTimeout(function(){
        $("#popup-message").remove();
      }, 5000);
    });

  },

  delete : function(url,data,successFn){
    var successFn = successFn || function(){};
    var res;
    var promise = $.ajax({
              method    : "DELETE",
              data      : data,
              url       : serverParentURL + url,
              dataType  : "json",
              headers   : {
                      'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
              },
              xhrFields : { withCredentials: true },
              success   : function( response ) {
                          res = response;
                        },
              error     : function( request, status, error ) {}
    });

    promise.then(function(){
      return successFn(res);
    })
    .catch(function(){
      var elm = '<div id="popup-message">' +
                  '<span>API 연결 오류</span>' +
                '</div>';
      $("body").append(elm);

      setTimeout(function(){
        $("#popup-message").remove();
      }, 5000);
    });
  }

}


var initAjax = "";
function initiator(newPath){

  $("#template-view").css({"overflow":""});
  $("body").css({"overflow":"inherit"});

  if(initAjax != ""){ // Delete last template Ajax call if exists
    initAjax.abort();
  }

  var pathsplit   = newPath || window.location.hash.split("#")[1] || "";
  var pathname    = "";

  if(pathsplit){
    pathname  = pathsplit.split("?")[0];
  }else{
    pathname  = "/index";
  }

  var pathParent  = pathname.split("/")[1];

  // Footer Processing
  $("#footer").find(".footer-item").removeClass("selected");
  $("#footer").find(".footer-item-" + pathParent).addClass("selected");
  if(viewConfig[pathname]["footerHide"]){
    $("#footer").css({"display":"none"});
  }else{
    $("#footer").css({"display":"block"});
  }
  $(".footer-special-element").remove();


  // Path Parameter to Json
  var pathParams  = pathsplit.split("?")[1] || "";
  var pathParamsJson = {};

  if(pathParams != ""){
    var pathParamsArray = pathParams.split("&");

    $.each(pathParamsArray,function(index,value){
      pathParamsJson[value.split("=")[0]] = value.split("=")[1];
    });
    pathParams = "?" + pathParams;
  }

  if (server_toggle){
    var highlight_url = "/common/highlight"
  } else {
    var highlight_url = "/api/v1/get/highlight"
  }

  // Server side id add
  var idChecklist = ["uid","gid","bid","pid"];
  var idSlash     = "";
  $.each(idChecklist, function(index,value){
    if(pathParamsJson[value]){
      idSlash = "/" + pathParamsJson[value] + "/";
    }
  });

  // api.get("/api/v1/get/highlight",function(response){

  //   var footerHighlight = response.footer;
  //   var headerHighlight = response.header;

  //   $.each(footerHighlight,function(index,value){
  //     $(".footer-item-" + value).append('<div class="footer-item-noti"></div>');
  //   });

  //   pathParamsJson["headerHighlight"] = headerHighlight

  // });

  // Activate Controller for Current view
  $.each(Object.keys(viewConfig),function(index,value){

    if (pathname != value) {
      return;
    }

    $("#template-view-loading").css({"display":"block"});
    $("#template-view-loading").css({"opacity":"1"});
    $("#template-view").html("");

    renderTemplate(viewConfig[value]["header"], "#template-header", function(){
      var res;
      initAjax = $.ajax({
              method    : "GET",
              url       : viewConfig[value]["template"] + idSlash + pathParams,
              xhrFields : {withCredentials: true},
              success   : function( response ) {
                          $("#template-view").html("");
                          $("#template-view").append($.parseHTML(response, null, true));
                          $("#template-view").css({"display":"block"});
                          $("woot-click").off('click').on('click',function(){
                            initiator($(this).attr("href"));
                            history.pushState(null, null, document.location.pathname + '#' + $(this).attr("href"));
                          });
                        },
              error     : function( request, status, error ) {}
      });

      initAjax.then(function(){
          anime({
            targets: '#template-view-loading',
            opacity: '0',
            duration: 100,
            easing: 'linear',
            complete: function(){
              $("#template-view-loading").css({"display":"none"});
            }
          });

          // Login Check
          /*
          if(pathParent != "login"){
            var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);
            if(!userdata.login){
              window.location.href = "./login.html#/login";
            }
          }else{
            var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);
            if(userdata.login){
              window.location.href = "./index.html#/index";
            }
          }
          */

          controller[viewConfig[value]["controller"]](pathParamsJson);
          globalEventHandler();
      })
      .catch(function(){
          renderTemplate("404.html", "#template-view", function(){
            anime({
              targets: '#template-view-loading',
              opacity: '0',
              delay: 10000,
              duration: 100,
              easing: 'linear',
              complete: function(){
                $("#template-view-loading").css({"display":"none"});
              }
            });
          });
          globalEventHandler();
      });
    });

  });

}

function button_liked() {
  var pid = $(this).data("pid");
  var action = $(this).data("action");
  var data = { 'pid': pid, 'action': action};
  var button = $(this);

  // TODO: need to add error handling
  if (button.hasClass("liked")) { // Already Liked
    api.post("/post_like/", data, function () { });
    var next_action = "on";

    button.removeClass("liked");
    button.html("<span class='ion-ios-heart-outline'></span>");
    var count = parseInt($("#posting-item-" + pid).find(".posting-stat .like .count").text());
    $("#posting-item-" + pid).find(".posting-stat .like .count").text(count - 1);
  }
  else {
    api.post("/post_like/", data, function () { });
    var next_action = "off";

    button.addClass("liked");
    button.html("<span class='ion-ios-heart'></span>");
    var count = parseInt($("#posting-item-" + pid).find(".posting-stat .like .count").text());
    $("#posting-item-" + pid).find(".posting-stat .like .count").text(count + 1);
  }

  button.data("action", next_action);
}


/* Controller */
var controller = {

  /* Main Ctrl */
  mainCtrl : function(pathParams){


    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });


    // Header Notification Highlight
    if(pathParams.headerHighlight > 0){
      $(".header-right-index-item.notification").append('<span class="header-item-noti">' + pathParams.headerHighlight + '</span>');
    }


    // Blockname Replace
    var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);
    $("#header-title").text(userdata.block);


    // Post API: Like
    $(".button-like").off('click').on('click', button_liked);

    return;
  },

  /* Notification Ctrl */
  notificationCtrl : function(){
    // api.get("/api/v1/get/highlightHeaderDelete");
    return;
  },

  /* Login Ctrl */
  loginCtrl : function(){

    $("#header").css({"display":"none"});
    $("#footer").css({"display":"none"});


    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });

    $("#login-form input[type='submit']").off('click').on('click',function(e){
      e.preventDefault();
      $.ajax({

            url       : serverParentURL + "/account/login/",
            type      : 'POST',
            data      : $("#login-form").serialize(),
            xhrFields : { withCredentials: true },
            success   : function( response ) {

                        if(response["ok"]){
                          window.location.replace('./index.html');
                        }

                      },
            error     : function( request, status, error ) {
                          
                      }

      });
    });
      
    return;
  },

  signupCtrl : function(){

    $("#header").css({"display":"none"});
    $("#footer").css({"display":"none"});

    $("#signup-item-input-email").focusout(function(){

      var email = $("#signup-item-input-email").val();

      api.get("/api/v1/get/signupEmailCheck?email=" + email,function(response){

        $(".message-email").css({"display":"block"});
        if(response){
          $(".message-email").find("span").css({"color":"#2ecc71"}).text("가입 가능한 이메일입니다.");
        }else{
          $(".message-email").find("span").css({"color":"#e74c3c"}).text("이미 가입되어 있는 이메일입니다.");
        }

      });

    });

    $("#signup-item-input-password-confirm").keyup(function(){
      if($(this).val() == $("#signup-item-input-password").val()){
        $(".message-password").css({"display":"none"});
      }else{
        $(".message-password").css({"display":"block"});
        $(".message-password").find("span").css({"color":"#e74c3c"}).text("비밀번호가 일치하지 않습니다.");
      }
    });


    $("#signup-address-submit").off('click').on('click',function(){
      var address = $("#signup-address-input").val();

      $("#signup-address-result").html("");
      $.ajax({
              method    : "POST",
              url       : "http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do",
              data      : {
                keyword : address,
                countPerPage : 100,
                currentPage : 1,
                resultType : "json",
                confmKey : "U01TX0FVVEgyMDE4MDgxNDEzNDU1MTEwODA3NTU="
              },
              dataType  : 'jsonp',
              crossDomain : true,
              success   : function( response ) {

                          var elm = "<ul>";

                          if(response.results.common.totalCount == 0){

                            elm = elm + "<li><span>검색 결과가 없습니다.</span></li>";
                            $("#signup-address-result").append(elm + "</ul>");

                          }else{

                            $(response.results.juso).each(function(){

                              elm = elm + "<li><span>"+ this.jibunAddr + "</span></li>";

                            });

                            $("#signup-address-result").append(elm + "</ul>");

                            $("#signup-address-result li").off('click').on('click',function(){
                              var currentAdd = $(this).find("span").text();
                              $("#signup-address-input-hidden").val(currentAdd);
                              $("#signup-address-input").val(currentAdd);
                              $("#signup-address-result").html("");


                            })
                          }

                        },
              error     : function( request, status, error ) {

                        }
      });
    })

    return;
  },

  /* Signup Confirm Ctrl */
  signupConfirmCtrl : function(){

    $("#header").css({"display":"none"});
    $("#footer").css({"display":"none"});

    var modelHouseHTML = $("#model-house-item-wrapper").find(".model-house-item");
    $("#model-house-item-wrapper").html("");

    $.each(modelHouseHTML,function(index,elm){
      setTimeout(function(){
        $("#model-house-item-wrapper").prepend(elm);
        anime({
          targets: '.model-house-item:nth-child(1)',
          opacity: 0,
          duration: 1000,
          easing: 'easeInOutQuart',
          direction: 'reverse'
        });
      }, 5000 * index);
    })

    return;

  },

  /* WriteCtrl */
  writeCtrl : function(){

    $("#footer").css({"display":"none"});

    /* Global */

    $("textarea").on('keydown keyup', function () {
      $(this).height(1).height( $(this).prop('scrollHeight') - 16);
    });

    /* subheader */

    if($(".subheader-tab").length){
        $(".write-section-gathering").show();
        $(".write-section-posting").hide();
    }

    $(".subheader-tab").off('click').on('click',function(){

        var tab = $(this).data("tab");

        if(tab == "gathering"){

            $(".subheader-tab").removeClass("selected");
            $(this).addClass("selected");

            $(".write-section-gathering").show();
            $(".write-section-posting").hide();

        // renderTemplate(serverParentURL + "/people/profile.badge?uid=" + profiledata.uid,"#profile-section-history");

        } else if(tab == "posting"){

            $(".subheader-tab").removeClass("selected");
            $(this).addClass("selected");

            $(".write-section-gathering").hide();
            $(".write-section-posting").show();
        }
    });


    /* Write Gathering */

    // Sticker Change
    $(".write-gathering-sticker").off('click').on('click',function(){
      var stickerID = $(this).data("sticker");
      $("#write-gathering-input-sticker").val(stickerID);

      $(".write-gathering-sticker").removeClass("selected");
      $(this).addClass("selected");
    });

    // Number Restriction
    $(".write-gathering-input-number").change(function(){
      $(this).val(Math.abs(parseInt($(this).val())));
    });

    // Woot Gathering On/Off
    /*
    $("#write-gathering-input-woot-gathering").change(function(){

      if($(this).is(":checked")){
        $(".write-section-item-woot-gathering").css({"display":"block"});
      }else{
        $(".write-section-item-woot-gathering").css({"display":"none"});
      }

    });

    $("#write-gathering-input-woot-invitation-fake").off('click').on('click',function(){
      pullupMenu("write.gathering.invitation",function(){

        // Preset
        var checkedArray  = JSON.parse($("#write-gathering-input-woot-invitation").val());

        $(".pullup-gathering-invitation .checkbox").each(function(index,elm){

          if(checkedArray.indexOf($(elm).data("uid")) > -1){
            $(this).addClass("checked");
          }

        });

        // Checkbox Click Handler
        $(".pullup-gathering-invitation .checkbox").off('click').on('click',function(){

          var uid                   = $(this).data("uid");
          var username              = $(this).data("username");
          var checkedArray          = JSON.parse($("#write-gathering-input-woot-invitation").val());
          var checkedArrayUsername  = JSON.parse($("#write-gathering-input-woot-invitation-username").val());

          if(checkedArray.indexOf(uid) > -1){

            $(this).removeClass("checked");
            var inx = checkedArray.indexOf(uid);
            checkedArray.splice(inx, 1);
            checkedArrayUsername.splice(inx, 1);

          }else{

            $(this).addClass("checked");
            checkedArray.push(uid);
            checkedArrayUsername.push(username);

          }

          $("#write-gathering-input-woot-invitation").val(JSON.stringify(checkedArray));
          $("#write-gathering-input-woot-invitation-username").val(JSON.stringify(checkedArrayUsername));
          $("#write-gathering-input-woot-invitation-fake").val(checkedArrayUsername);

        });
      });
    });
    */

    // Gathering Time
    $("#write-gathering-input-time-fake").off('click').on('click',function(){
      pullupMenu("pullup_write_calendar",function(){

        // Date Select
        function dateSelect(){
          $("#calendar-input-date").val(this.lastSelectedDay);
        }

        // Days after 14 days
        var days14 = new Date(Date.now() + 12096e5);;
        var dd     = days14.getDate();
        var mm     = days14.getMonth()+1;
        var yyyy   = days14.getFullYear();

        if(dd<10){

            dd = '0' + dd;

        }
        if(mm<10){

            mm = '0' + mm;

        }

        var myCalendar = new HelloWeek({
              selector: '.calendar',
              lang: 'en',
              langFolder: './lib/hello-week-master/dist/langs/',
              format: false,
              weekShort: true,
              monthShort: true,
              multiplePick: false,
              defaultDate: false,
              todayHighlight: false,
              disablePastDays: true,
              disabledDaysOfWeek: false,
              disableDates: false,
              weekStart: 0,
              daysHighlight: false,
              range: false,
              minDate: false,
              maxDate: yyyy + "-" + mm + "-" + dd,
              onSelect: dateSelect
        });

        // AM-PM Toggle
        $(".am-pm.button").off('click').on('click',function(){
          if($("#calendar-input-am-pm").val() == "am"){
            $(this).find(".toggle").text("오후");
            $("#calendar-input-am-pm").val("pm")
          }else{
            $(this).find(".toggle").text("오전");
            $("#calendar-input-am-pm").val("am")
          }
        });

        // Hour Minute Restriction
        $("#calendar-input-hour").change(function(){
          var hour = $(this).val();
          if(hour >= 12){
            hour = 0;
          }else if(hour < 0){
            hour = 0;
          }

          if(hour >= 0 && hour < 10){
            $(this).val("0" + parseInt(hour));
          }else{
            $(this).val(parseInt(hour));
          }
        });

        $("#calendar-input-minute").change(function(){

          var minute = $(this).val();
          if(minute >= 60){
            minute = 59;
          }else if(minute < 0){
            minute = 0;
          }

          if(minute >= 0 && minute < 10){
            $(this).val("0" + parseInt(minute));
          }else{
            $(this).val(parseInt(minute));
          }

        });

        // Submit Click Event Handler
        $(".calendar-submit").off('click').on('click',function(){

          var date        = $("#calendar-input-date").val();
          var ampm        = $("#calendar-input-am-pm").val();
          var hour        = $("#calendar-input-hour").val();
          var minute      = $("#calendar-input-minute").val();
          var timestamp   = "";

          if(ampm == "am"){
            timestamp = parseInt(date) + (parseInt(hour) * 60 * 60) + (parseInt(minute) * 60);
          }else{
            timestamp = parseInt(date) + ((parseInt(hour) + 12) * 60 * 60) + (parseInt(minute) * 60);
          }

          $("#write-gathering-input-time").val(timestamp);
          $("#write-gathering-input-time-fake").val(timestampConverter(timestamp));

          $("#pullup").css({"display":"none"});
          $("#template-view").css({"overflow":""});
          $("body").css({"overflow":"inherit"});

          anime({
            targets: '#write-gathering-input-time-fake',
            opacity:0.3,
            duration: 300,
            easing: 'linear',
            direction: 'alternate'
          });

        })
      });
    });


    $("#write-gathering-input-agelimit-fake").off('click').on('click',function(){
      pullupMenu("pullup_write_agelimit",function(){

        // Age Limit Event Handler
        $("#pullup-agelimit-input-min-fake input").off('click').on('click',function(){
          $("#pullup-agelimit-input-min-fake .roller").css({"display":"block"});

          $("#pullup-agelimit-input-min-fake li").off('click').on('click',function(){
            $("#pullup-agelimit-input-min-fake input").val($(this).data("age"));
            $("#pullup-agelimit-input-min-fake .roller").css({"display":"none"});
          });
        });

        $("#pullup-agelimit-input-max-fake input").off('click').on('click',function(){
          $("#pullup-agelimit-input-max-fake .roller").css({"display":"block"});

          $("#pullup-agelimit-input-max-fake li").off('click').on('click',function(){
            $("#pullup-agelimit-input-max-fake input").val($(this).data("age"));
            $("#pullup-agelimit-input-max-fake .roller").css({"display":"none"});
          });
        });

        // Age Limit Submit
        $("#pullup-agelimit-submit").off('click').on('click',function(){
          var minage = $("#pullup-agelimit-input-min-fake input").val();
          var maxage = $("#pullup-agelimit-input-max-fake input").val();

          if(!minage && !maxage){
            $("#pullup .background").click();
            $("#write-gathering-input-agelimit-fake").val("");
            $("#write-gathering-input-agelimit").val("");
          }else if(minage && maxage){
            $("#pullup .background").click();
            $("#write-gathering-input-agelimit-fake").val(minage + " ~ " + maxage);
            $("#write-gathering-input-agelimit").val(minage + " ~ " + maxage);
          }else{

            var elm = '<div id="popup-message">' +
                        '<span>최소나이와 최대나이를 모두 입력해주세요</span>' +
                      '</div>';

            $("body").append(elm);

            setTimeout(function(){
              $("#popup-message").remove();
            }, 5000);

          }

        });

      });
    });

    // Gathering Submit

    $("#write-gathering-submit").off('click').on('click',function(){

      var inputs = [
                      {"id":"sticker","require":true},
                      {"id":"title","require":true},
                      {"id":"description","require":true},
                      {"id":"location","require":true},
                      {"id":"time","require":true},
                      {"id":"maxpeople","require":false},
                      {"id":"agelimit","require":false},
                      {"id":"instant","require":true},
                      {"id":"mintime","require":true},
                      {"id":"minpeople","require":true}
                   ];

      var required = true;
      var data = {};

      $.each(inputs, function(ind,val){

        data[val.id] = $("#write-posting-input-" + val.id).val();

        if(val.require){ // Check required fields

          if( $("#write-gathering-input-" + val.id).val().length == 0 ){

            $("#write-gathering-input-" + val.id).css({"border-bottom":"1px solid #eb3b5a"}).change(function(){
              $(this).css({"border-bottom":"1px solid rgb(210,210,210)"});
            });

            $("#write-gathering-input-" + val.id + "-fake").css({"border-bottom":"1px solid #eb3b5a"}).change(function(){
              $(this).css({"border-bottom":"1px solid rgb(210,210,210)"});
            });

            var elm = '<div id="popup-message">' +
                        '<span>필수 정보를 반드시 입력해주세요.</span>' +
                      '</div>';

            $("body").append(elm);

            setTimeout(function(){
              $("#popup-message").remove();
            }, 5000);

            required = false;

          }

        }

        if($("#write-gathering-input-instant").val() == false){
          if( $("#write-gathering-input-mintime").val().length != 0 || $("#write-gathering-input-minpeople").val().length != 0 ){

            var elm = '<div id="popup-message">' +
                        '<span>필수 정보를 반드시 입력해주세요.</span>' +
                      '</div>';

            $("body").append(elm);

            setTimeout(function(){
              $("#popup-message").remove();
            }, 5000);

            required = false;

          }
        }

      });

      if(required){ // All requirements are met

        api.post("/api/v1/post/gathering",data,function(){
          return document.location.replace("./gathering.my.html");
        });

      }

    });

  /* Write Posting */

    // Board Select
    $("#write-posting-input-board-fake").off('click').on('click',function(){

      pullupMenu("pullup_write_posting_category",function(){

        $(".board-select").off('click').on('click',function(){

          $("#pullup .background").click();
          var bid = $(this).data("bid");

          $("#write-posting-input-board-fake").val($(this).find("span").text());
          $("#write-posting-input-board").val(bid);

          anime({
            targets: '#write-posting-input-board-fake',
            opacity:0.3,
            duration: 300,
            easing: 'linear',
            direction: 'alternate'
          });

          renderTemplate(serverParentURL + "/write/posting.addon?bid=" + bid, "#write-section-addon");

        });

      });

    });


    $("#write-section-item-photo-button").off('click').on('click',function(){

      $("#write-posting-input-photo-wrapper").find("input").each(function(index,val){

        if(val.files.length == 0){
          $(this).click();
          return false;
        }

      });

    });


    // Image Upload
    function imageProcessor(dataURL, fileType, inputOrder) {

      var image = new Image();
      var srcOrientation = 1;
      image.src = dataURL;

      image.onload = function () {

        EXIF.getData(image, function() {

          srcOrientation = EXIF.getTag(this, "Orientation");
          var newWidth = image.width;
          var newHeight = image.height;

          var canvas = document.createElement('canvas');

          canvas.width = newWidth;
          canvas.height = newHeight;

          var context = canvas.getContext('2d');

            // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
              canvas.width = newHeight;
              canvas.height = newWidth;
            } else {
              canvas.width = newWidth;
              canvas.height = newHeight;
            }

            switch (srcOrientation) {
              case 2: context.transform(-1, 0, 0, 1, newWidth, 0); break;
              case 3: context.transform(-1, 0, 0, -1, newWidth, newHeight ); break;
              case 4: context.transform(1, 0, 0, -1, 0, newHeight ); break;
              case 5: context.transform(0, 1, 1, 0, 0, 0); break;
              case 6: context.transform(0, 1, -1, 0, newHeight , 0); break;
              case 7: context.transform(0, -1, -1, 0, newHeight , newWidth); break;
              case 8: context.transform(0, -1, 1, 0, 0, newWidth); break;
              default: break;
            }

          context.drawImage(image, 0, 0);

          dataURL   = canvas.toDataURL(fileType);

          var imageID = "image_" + Date.now();

          $("#write-section-item-photo-preview-" + inputOrder).addClass("selected").append("<span class='item-delete ion-close-circled button' onclick='imageElementDelete(this," + inputOrder + ")' data-image='" + imageID + "'></span><img src='" + dataURL + "'/>");

          if($("#write-section-item-photo-preview-wrapper .selected").length == 3){
            $("#write-section-item-photo-button").addClass("disabled");
          }

        });

      };

      image.onerror = function () {
        console.log('Image Processor Error');
      };

    }

    if(window.File && window.FileList && window.FileReader){
      var $filesInput = $("#write-posting-input-photo-wrapper").find("input");

      $filesInput.on("change", function(event){

          var inputOrder = event.target.getAttribute('data-inputOrder');
          var file = event.target.files[0];
          var picReader = new FileReader();

          picReader.onloadend = function(){

              imageProcessor(picReader.result, file.type, inputOrder);

          };

          picReader.readAsDataURL(file);

      });
    }


    // Posting Submit
    $("#write-posting-submit").off('click').on('click',function(){

      var inputs = [
                      {"id":"board","require":true},
                      {"id":"description","require":true},
                      {"id":"file-1","require":false},
                      {"id":"file-2","require":false},
                      {"id":"file-3","require":false},
                      {"id":"location","require":false}
                   ];

      var required = true;

      $.each(inputs, function(ind,val){

        if(val.require){ // Check required fields

          if( $("#write-posting-input-" + val.id).val().length == 0 ){

            $("#write-posting-input-" + val.id).css({"border-bottom":"1px solid #eb3b5a"}).change(function(){
              $(this).css({"border-bottom":"1px solid rgb(210,210,210)"});
            });

            $("#write-posting-input-" + val.id + "-fake").css({"border-bottom":"1px solid #eb3b5a"}).change(function(){
              $(this).css({"border-bottom":"1px solid rgb(210,210,210)"});
            });

            var elm = '<div id="popup-message">' +
                        '<span>필수 정보를 반드시 입력해주세요.</span>' +
                      '</div>';

            $("body").append(elm);

            setTimeout(function(){
              $("#popup-message").remove();
            }, 5000);

            required = false;

          }

        };

      });

      if(required){ // All requirements are met

        var formData = $("#write-posting-form").serialize();

        api.post("/api/v1/post/posting",formData,function(res){
          return document.location.replace("./board.posting.detail.html?pid=" + res.pid);
        });

      }

    });

    return;
  },

  /* People Ctrl */
  accountMoreCtrl : function(){
    var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);
    $("#header-title").text(userdata.block);

    $("#people-filtering").off('click').on('click',function(){

      pullupMenu('pullup_more_filtering',function(){

        var interestArray = [];
        $(".pullup-interest-content .interest").off('click').on('click',function(){

          var interest = $(this).data("interest");

          if(interestArray.indexOf(interest) > -1){
            interestArray.splice(interestArray.indexOf(interest), 1);
          }else{
            interestArray.push(interest);
          }

          $(this).toggleClass("selected");

        });

        $("#submit-filtering").off('click').on('click',function(){

          $("#people-filtering").addClass("filtered").find("span").text("필터됨");
          $("#pullup .background").click();
          $(".people-section-all .people-item").each(function(index,value){

            $(this).css({"display":"block"});

            if(interestArray.length != 0){
              var personInterestArray = $(this).find(".interest").data("interestarray");
              var orChecker = false;
              $.each(interestArray,function(index, value){
                if(personInterestArray.indexOf(value) > -1){
                  orChecker = true;
                }
              });

              if(!orChecker){
                $(this).css({"display":"none"});
              }
            }

          });

        });

      });

    });

    return;
  },


  /* Profile Ctrl */
  profileCtrl : function(){

    // Current Profile User Data
    var profiledata = JSON.parse($("#hiddenInput_currentpagedata").val() || null);

    if($("#profile-section-history").length){
      $(".badge-discover-contents").show();
      $(".posting-wrapper").hide();
      $(".people-contents").hide();
    }

    // History Tab
    $(".profile-section-statistics-tab").off('click').on('click',function(){

      var tab = $(this).data("tab");

      if(tab == "badge"){

        $(".profile-section-statistics-tab").removeClass("selected");
        $(this).addClass("selected");

        $(".badge-discover-contents").show();
        $(".posting-wrapper").hide();
        $(".people-contents").hide();

        // renderTemplate(serverParentURL + "/people/profile.badge?uid=" + profiledata.uid,"#profile-section-history");

      } else if(tab == "posting"){

        $(".profile-section-statistics-tab").removeClass("selected");
        $(this).addClass("selected");
        $(".badge-discover-contents").hide();
        $(".posting-wrapper").show();
        $(".people-contents").hide();

        // renderTemplate(serverParentURL + "/people/profile.posting?uid=" + profiledata.uid,"#profile-section-history");

      } else if(tab == "woot"){

        $(".profile-section-statistics-tab").removeClass("selected");
        $(this).addClass("selected");
        $(".badge-discover-contents").hide();
        $(".posting-wrapper").hide();
        $(".people-contents").show();

        // renderTemplate(serverParentURL + "/people/profile.woot?uid=" + profiledata.uid,"#profile-section-history");

      }

    });

    // Profile Buttons Like
    $(".profile-button-like").off('click').on('click',function(){
      if($(this).hasClass("liked")){
        var targetUid = $(this).data("uid");
        api.delete("/api/v1/post/user/woot",{uid:targetUid});
        $(this).removeClass("liked");
      }else{
        var targetUid = $(this).data("uid");
        api.post("/api/v1/post/user/woot",{uid:targetUid});
        $(this).addClass("liked");
      }
    });

    // Profile Buttons Report
    $(".profile-button-report").off('click').on('click',function(){
      var targetUid = $(this).data("uid");
      pullupMenu('pullup_profile_report?uid=' + targetUid,function(){

        $(".profile-report-block").off('click').on('click',function(){
          api.post("/api/v1/post/user/block",{uid:targetUid},function(){

            var elm = '<div id="popup-message">' +
                        '<span>해당 유저를 차단했습니다.<br>앞으로 내가 만든 게더링은 해당 유저에게 보이지 않습니다.</span>' +
                      '</div>';

            $("body").append(elm);

            setTimeout(function(){
              $("#popup-message").remove();
            }, 10000);

          });
          $("#pullup .background").click();
        });

        $(".profile-report-report").off('click').on('click',function(){
          pullupMenu('pullup_profile_report_reason?uid=' + targetUid,function(){
            $(".pullup-item-report-reason").off('click').on('click',function(){
              var reason = $(this).data("reason");
              api.post("/api/v1/post/user/report",{uid:targetUid, reason:reason},function(){

                var elm = '<div id="popup-message">' +
                            '<span>해당 유저를 차단하고 신고했습니다.<br>앞으로 내가 만든 게더링은 해당 유저에게 보이지 않습니다.</span>' +
                          '</div>';

                $("body").append(elm);

                setTimeout(function(){
                  $("#popup-message").remove();
                }, 10000);

              });

              $("#pullup .background").click();

            });
          });
        });

        $(".profile-report-unblock").off('click').on('click',function(){
          api.post("/api/v1/post/user/unblock",{uid:targetUid},function(){

            var elm = '<div id="popup-message">' +
                        '<span>해당 유저 차단을 해제했습니다.</span>' +
                      '</div>';

            $("body").append(elm);

            setTimeout(function(){
              $("#popup-message").remove();
            }, 5000);

          });
          $("#pullup .background").click();
        });

      });
    });

    return;
  },

  profileEditCtrl : function(){

    $("#profile-edit-input-description").height(1).height( $("#profile-edit-input-description").prop('scrollHeight') - 16 );
    $("textarea").on('focus keydown keyup', function () {
      $(this).height(1).height( $(this).prop('scrollHeight') -16 );
    });
    $("textarea").focus(function(){
      $("#footer").css({"display":"none"});
    });
    $("textarea").blur(function(){
      $("#footer").css({"display":"block"});
    });


    // Profile Avatar Change
    $("#profile-avatar-change-button").off('click').on('click',function(){

      api.get("/api/v1/get/avatarChange",function(response){

        $("#profile-avatar").css({"background-image":"url(" +response.image + ")"});
        $("#profile-edit-input-avatar").val(response.avatarID);

      });

    });


    // Profile Interest Edit
    $("#profile-edit-input-interest-fake").off('click').on('click',function(){

      pullupMenu("pullup_edit_interest",function(){

        var interestArray = JSON.parse($("#profile-edit-input-interest").val() || null);

        $(".pullup-interest-content").find(".interest").each(function(indx,val){
          if(interestArray.indexOf($(this).data("interest")) > -1){
            $(this).addClass("selected");
          }
        });

        $(".pullup-interest-content").find(".interest").off('click').on('click',function(){
          if($(this).hasClass("selected")){

            $(this).removeClass("selected");
            var interestValue = $(this).data("interest");
            interestArray.splice(interestArray.indexOf(interestValue), 1);

          }else{

            $(this).addClass("selected");
            var interestValue = $(this).data("interest");
            interestArray.push(interestValue);

          }

          $("#profile-edit-input-interest").val(JSON.stringify(interestArray));
          $("#profile-edit-input-interest-fake").html("");
          $.each(interestArray,function(indx,val){
            $("#profile-edit-input-interest-fake").prepend("<span>" + val + "</span>");
          });

        });

      });

    });

    $("#profile-edit-input-push-fake").change(function(){
      if($(this).is(":checked")){
        $("#profile-edit-input-push").val(true);
      }else{
        $("#profile-edit-input-push").val(false);
      }
    });

    $("#profile-edit-submit").off('click').on('click',function(){

      if($("#profile-edit-input-avatar").val()      == "" ||
        $("#profile-edit-input-description").val()  == "" ||
        $("#profile-edit-input-interest").val()     == ""){

        var elm = '<div id="popup-message">' +
                    '<span>모든 값을 정확히 입력해주세요.</span>' +
                  '</div>';

        $("body").append(elm);

        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);

        return;

      }

      var serializedData = $("#profile-edit-form").serialize();

      $.ajax({

            url       : serverParentURL + "/api/v1/post/profile",
            type      : 'POST',
            data      : serializedData,
            xhrFields : { withCredentials: true },
            success   : function( response ) {

                        var res = JSON.parse(response);
                        if(res.redirect){
                          initiator(res.redirect);
                          history.pushState(null, null, document.location.pathname + '#' + res.redirect);
                        }

                      },
            error     : function( request, status, error ) {

                      }

      });

    });

    return;
  },

  passwordEditCtrl : function(){

    $("#profile-password-edit-submit").off('click').on('click',function(){

      if($("#profile-edit-password-input-current").val()    == "" ||
        $("#profile-edit-password-input-new").val()         == "" ||
        $("#profile-edit-password-input-new-confirm").val() == ""){

        var elm = '<div id="popup-message">' +
                    '<span>모든 값을 정확히 입력해주세요.</span>' +
                  '</div>';

        $("body").append(elm);

        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);

        return;

      }

      if($("#profile-edit-password-input-new").val() != $("#profile-edit-password-input-new-confirm").val()){

        var elm = '<div id="popup-message">' +
                    '<span>새로운 비밀번호를 확인해주세요.</span>' +
                  '</div>';

        $("body").append(elm);

        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);

        return;

      }

      var serializedData = $("#profile-edit-password-form").serialize();

      $.ajax({

            url       : serverParentURL + "/api/v1/post/password",
            type      : 'POST',
            data      : serializedData,
            xhrFields : { withCredentials: true },
            success   : function( response ) {
                        var res = JSON.parse(response);
                        if(res.redirect){
                          initiator(res.redirect);
                          history.pushState(null, null, document.location.pathname + '#' + res.redirect);
                        }

                      },
            error     : function( request, status, error ) {

                      }

      });

    });

    return;
  },

  /* Board Ctrl */
  postListCtrl : function(){

    // Blockname Replace
    var boarddata = JSON.parse($("#hiddenInput_boarddata").val() || null);
    $("#header-title").text(boarddata.bname);

    var postdata = JSON.parse($("#hiddenInput_postdata").val() || null);

    $("textarea").on('keydown keyup', function () {
      $(this).height(1).height( $(this).prop('scrollHeight') );
      $("#posting-item-comment").css({"padding-bottom":$(this).prop('scrollHeight') - 26});
    });

    // Post API: Like
    var likeHandler = function(){
      $(".button-like").off('click').on('click', button_liked);
    }
    likeHandler();

    // Overlap
    var overlapHandler = function(){
      // Overlap : Comment
      $(".overlap-button-comment").off('click').on('click',function(){

        $("#template-view").css({"overflow":"hidden"});
        $("body").css({"overflow":"hidden"});

        var pid = $(this).data("pid");
        $("#posting-overlap-view").append('<div id="header" class="row">' +
                                            '<div class="header-left overlap-close button col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
                                              '<i class="ion-android-close"></i>' +
                                            '</div>' +
                                            '<div class="header-center block col-lg-16 col-md-16 col-sm-16 col-xs-16">' +
                                              '<span>댓글</span>' +
                                            '</div>' +
                                          '</div>');
        $("#posting-overlap-view").css({"display":"block"});
        anime({
            targets: "#posting-overlap-view",
            translateX: '-100%',
            duration: 300,
            easing: 'easeInOutQuart'
        });

        renderTemplate(serverParentURL + "/misc/comment_list_iframe?pid=" + pid, "#posting-overlap-view", function(){

          // Close Event Handler
          $(".overlap-close").off('click').on('click',function(){
            anime({
              targets: "#posting-overlap-view",
              translateX: '100%',
              duration: 10
            });
            $("#posting-overlap-view").html("");
            $("#posting-overlap-view").css({"display":"none"});
            $("#template-view").css({"overflow":""});
            $("body").css({"overflow":"inherit"});
          });

          // Post API: Comment - Default
          $("#footer-textarea-submit").off('click').on('click',function(){

            var data = {
              text : $("#footer-textarea").val()
            };

            api.post("/api/v1/post/comment",data,function(){
              location.reload(true);
            });

          });

          // Comment Edit Button
          $(".comment-edit-button").off('click').on('click',function(){

            var cid = $(this).data("cid");

            $(".posting-comment").removeClass("selected");
            $("#posting-comment-" + cid).addClass("selected");

            renderTemplate(serverParentURL + "/footer-input/comment.edit?cid=" + cid,"#footer-input",function(){

              $("#footer-textarea").focus().height(1).height( $("#footer-textarea").prop('scrollHeight') );
              $("#posting-item-comment").css({"padding-bottom":$("#footer-textarea").prop('scrollHeight') - 26});

              $("#footer-textarea").on('keydown keyup', function () {
                $(this).height(1).height( $(this).prop('scrollHeight') );
                $("#posting-item-comment").css({"padding-bottom":$(this).prop('scrollHeight') - 26});
              });

              setTimeout(function(){
                $("#template-view").scrollTop( $("#posting-comment-" + cid).offset().top - $("#footer-textarea").height() );
              }, 500);

              // Post API: Comment
              $("#footer-textarea-submit").off('click').on('click',function(){

                var data = {
                  cid : cid,
                  text : $("#footer-textarea").val()
                };

                api.post("/api/v1/post/comment",data,function(){
                  location.reload(true);
                });

              });

            });

          });


          // Comment Recomment Button
          $(".recomment-button").off('click').on('click',function(){

            var cid = $(this).data("cid");

            $(".posting-comment").removeClass("selected");
            $("#posting-comment-" + cid).addClass("selected");

            renderTemplate(serverParentURL + "/footer-input/comment.recomment?cid=" + cid,"#footer-input",function(){

              $("#footer-textarea").focus();

              $("#footer-textarea").on('keydown keyup', function () {
                $(this).height(1).height( $(this).prop('scrollHeight') );
              });

              setTimeout(function(){
                $("#template-view").scrollTop( $("#posting-comment-" + cid).offset().top - 60 );
              }, 500);

              // Post API: Comment
              $("#footer-textarea-submit").off('click').on('click',function(){

                var data = {
                  parentCid : cid,
                  text : $("#footer-textarea").val()
                };

                api.post("/api/v1/post/recomment",data,function(){
                  location.reload(true);
                });

              });

            });

          });

        });

      });

      // Overlap : Like
      $(".overlap-button-like").off('click').on('click',function(){

        $("#template-view").css({"overflow":"hidden"});
        $("body").css({"overflow":"hidden"});

        var pid = $(this).data("pid");
        $("#posting-overlap-view").append('<div id="header" class="row">' +
                                            '<div class="header-left overlap-close button col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
                                              '<i class="ion-android-close"></i>' +
                                            '</div>' +
                                            '<div class="header-center block col-lg-16 col-md-16 col-sm-16 col-xs-16">' +
                                              '<span>좋아요</span>' +
                                            '</div>' +
                                          '</div>');
        $("#posting-overlap-view").css({"display":"block"});
        anime({
            targets: "#posting-overlap-view",
            translateX: '-100%',
            duration: 300,
            easing: 'easeInOutQuart'
        });
        renderTemplate(serverParentURL + "/board/overlap.like?pid=" + pid,"#posting-overlap-view",function(){

          // Event Handler
          $(".overlap-close").off('click').on('click',function(){
            anime({
              targets: "#posting-overlap-view",
              translateX: '100%',
              duration: 10
            });
            $("#posting-overlap-view").html("");
            $("#posting-overlap-view").css({"display":"none"});
            $("#template-view").css({"overflow":""});
            $("body").css({"overflow":"inherit"});
          });
        });

      });
    }
    overlapHandler();

    // Infinite Scroll

    var infiniteScroll = function(){

      $("#template-view").unbind("scroll.board").bind("scroll.board",function() {

        var eventScroll = $("#posting-wrapper").height() - $("#template-view").height() + 150;

        if( eventScroll < $("#template-view").scrollTop() ){

          $(this).unbind("scroll.board");

          if($("#posting-wrapper").length > 0){
            $.ajax({
                    method    : "GET",
                    url       : serverParentURL + "/board/posting.infinitescroll?lastpid=1",
                    xhrFields: {withCredentials: true},
                    success   : function( response ) {

                                if(response){
                                  $("#posting-wrapper").append($.parseHTML(response));
                                  $("woot-click").off('click').on('click',function(){
                                    initiator($(this).attr("href"));
                                    history.pushState(null, null, document.location.pathname + '#' + $(this).attr("href"));
                                  });
                                  overlapHandler();
                                  likeHandler();
                                  infiniteScroll();
                                }

                              },
                    error     : function( request, status, error ) {

                              }

            });
          }

        }

      });
    }

    infiniteScroll();

    return;
  },

  /* Board Detail Ctrl */
  postDetailCtrl : function(urlParameter){

    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });

    $("#footer").css({"display":"none"});

    $('<div id="footer-input" class="row footer-special-element">' +
      '<div class="footer-item-wrapper col-lg-24 col-md-24 col-sm-24 col-xs-24">' +
        '<div class="footer-textarea-wrapper">' +
          '<textarea id="footer-textarea" placeholder="댓글 달기..."></textarea>' +
          '<div class="footer-textarea-submit button" id="footer-textarea-submit">' +
            '<span>등록</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>').insertAfter($("#footer"));

    if(urlParameter){
      if(urlParameter.scrollToElm){
        $("#template-view").scrollTop( $('#' + urlParameter.scrollToElm).position().top );
      }
    }

    // Blockname Replace
    var boarddata = JSON.parse($("#hiddenInput_boarddata").val() || null);
    $("#header-title").text(boarddata.bname);

    var postdata = JSON.parse($("#hiddenInput_postdata").val() || null);

    $("textarea").on('keydown keyup', function () {
      $(this).height(1).height( $(this).prop('scrollHeight') );
      $("#posting-item-comment").css({"padding-bottom":$(this).prop('scrollHeight') - 26});
    });

    // Post API: Like
    $(".button-like").off('click').on('click', button_liked);

    // Post API: Comment - Default
    $("#footer-textarea-submit").off('click').on('click',function(){

      var data = {
        text : $("#footer-textarea").val()
      };

      api.post("/api/v1/post/comment",data,function(){
        location.reload(true);
      });

    });

    // Comment Edit Button
    $(".comment-edit-button").off('click').on('click',function(){

      var cid = $(this).data("cid");

      $(".posting-comment").removeClass("selected");
      $("#posting-comment-" + cid).addClass("selected");

      renderTemplate(serverParentURL + "/footer-input/comment.edit?cid=" + cid,"#footer-input",function(){

        $("#footer-textarea").focus().height(1).height( $("#footer-textarea").prop('scrollHeight') );
        $("#posting-item-comment").css({"padding-bottom":$("#footer-textarea").prop('scrollHeight') - 26});

        $("#footer-textarea").on('keydown keyup', function () {
          $(this).height(1).height( $(this).prop('scrollHeight') );
          $("#posting-item-comment").css({"padding-bottom":$(this).prop('scrollHeight') - 26});
        });

        setTimeout(function(){
          $("#template-view").scrollTop( $("#posting-comment-" + cid).offset().top - $("#footer-textarea").height() );
        }, 500);

        // Post API: Comment
        $("#footer-textarea-submit").off('click').on('click',function(){

          var data = {
            cid : cid,
            text : $("#footer-textarea").val()
          };

          api.post("/api/v1/post/comment",data,function(){
            location.reload(true);
          });

        });

      });

    });


    // Comment Recomment Button
    $(".recomment-button").off('click').on('click',function(){

      var cid = $(this).data("cid");

      $(".posting-comment").removeClass("selected");
      $("#posting-comment-" + cid).addClass("selected");

      renderTemplate(serverParentURL + "/footer-input/comment.recomment?cid=" + cid,"#footer-input",function(){

        $("#footer-textarea").focus();

        $("#footer-textarea").on('keydown keyup', function () {
          $(this).height(1).height( $(this).prop('scrollHeight') );
        });

        setTimeout(function(){
          $("#template-view").scrollTop( $("#posting-comment-" + cid).offset().top - 60 );
        }, 500);

        // Post API: Comment
        $("#footer-textarea-submit").off('click').on('click',function(){

          var data = {
            parentCid : cid,
            text : $("#footer-textarea").val()
          };

          api.post("/api/v1/post/recomment",data,function(){
            location.reload(true);
          });

        });

      });

    });


    return;
  },

  /* Gathering Ctrl */
  gatheringCtrl : function(){

    // Gathering Participate
    $("#gathering-participate-button").off('click').on('click',function(){

      /*
      $("#template-view-loading").css({"display":"block"});
      $("#template-view-loading").css({"opacity":"1"});

      var gatheringdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);
      var chatRoomRef = cordova.InAppBrowser.open(encodeURI( chatServerURL + '?cid=' + gatheringdata.cid ),'_blank', 'clearcache=yes,location=no,zoom=no,hideurlbar=yes,hidenavigationbuttons=yes,disallowoverscroll=yes,toolbar=no');

      chatRoomRef.hide();
      chatRoomRef.addEventListener( "loadstop", function(){

              chatRoomRef.show();
              $("#template-view-loading").css({"display":"none"});
              $("#template-view-loading").css({"opacity":"0"});

              var loop = window.setInterval(function(){
                      chatRoomRef.executeScript({
                        code: "window.shouldClose"
                      },
                      function(values){
                        if(values[0]){
                            chatRoomRef.close();
                            window.clearInterval(loop);
                            chatRoomRef = undefined;
                        }
                      });
              },500);

      });

      chatRoomRef.addEventListener( "loaderror", function(){

              $("#template-view-loading").css({"display":"none"});
              $("#template-view-loading").css({"opacity":"0"});
              chatRoomRef.close();
              chatRoomRef = undefined;

              var elm = '<div id="popup-message">' +
                          '<span>채팅 서버 연결 오류</span>' +
                        '</div>';

              $("body").append(elm);

              setTimeout(function(){
                $("#popup-message").remove();
              }, 5000);

      });
      */

    });

    $(".gathering-detail-tab").off('click').on('click',function(){

      var gatheringdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);

      var tab = $(this).data("tab");

      if(tab == "information"){

        $(".gathering-detail-tab").removeClass("selected");
        $(this).addClass("selected");

        renderTemplate(serverParentURL + "/gathering/detail.information?gid=" + gatheringdata.gid,"#gathering-details-view");

      }else if(tab == "review"){

        $(".gathering-detail-tab").removeClass("selected");
        $(this).addClass("selected");

        renderTemplate(serverParentURL + "/gathering/detail.review?uid=" + gatheringdata.gid,"#gathering-details-view");

      }else if(tab == "comment"){

        $(".gathering-detail-tab").removeClass("selected");
        $(this).addClass("selected");

        renderTemplate(serverParentURL + "/gathering/detail.comment?uid=" + gatheringdata.gid,"#gathering-details-view");

      }

    });


    $("#footer").css({"display":"none"});
    return;
  },

  /* Gathering Review Ctrl */
  gatheringReviewCtrl : function(){

    var gatheringdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);
    $("#chat-title").text(gatheringdata.gname);

    $("#footer").css({"display":"none"});
    return;
  },

  /* Chat Ctrl */
  chatCtrl : function(){

    var gatheringdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);
    $("#chat-title").text(gatheringdata.gname);
    $("#chat-detail-link").attr("href","/gathering/detail?gid=" + gatheringdata.gid);

    $("#footer").css({"display":"none"});

    if(!gatheringdata.expired){
      $('<div id="footer-input" class="row footer-special-element">' +
        '<div class="footer-item-wrapper col-lg-24 col-md-24 col-sm-24 col-xs-24">' +
          '<div class="footer-textarea-wrapper">' +
            '<textarea id="footer-textarea" placeholder="메세지를 입력하세요"></textarea>' +
            '<div class="footer-textarea-submit button" id="footer-textarea-submit">' +
              '<span>전송</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>').insertAfter($("#footer"));

      $("#footer-textarea").height(1).height( $("#footer-textarea").prop('scrollHeight') );

      $("#footer-textarea").on('keydown keyup', function () {
        $(this).height(1).height( $(this).prop('scrollHeight') );
      });
    }else{
      $('<div id="footer-input" class="row footer-special-element">' +
        '<div class="footer-item-wrapper col-lg-24 col-md-24 col-sm-24 col-xs-24">' +
          '<div class="footer-textarea-wrapper">' +
            '<textarea id="footer-textarea" class="footer-textarea-readonly" placeholder="채팅이 종료된 게더링입니다." readonly></textarea>' +
          '</div>' +
        '</div>' +
      '</div>').insertAfter($("#footer"));
    }

    $("#template-view").scrollTop($("#template-view").height());

    var infiniteScroll = function(){

      $("#template-view").unbind("scroll.chat").bind("scroll.chat",function() {

        var eventScroll = 500;

        if( eventScroll > $("#template-view").scrollTop() ){

          $(this).unbind("scroll.chat");

          if($("#chat-room").length > 0){
            $.ajax({
                    method    : "GET",
                    url       : serverParentURL + "/gathering/chat.infinitescroll",
                    xhrFields: {withCredentials: true},
                    success   : function( response ) {

                                if(response){
                                  $("#chat-room").prepend($.parseHTML(response));
                                  infiniteScroll();
                                }

                              },
                    error     : function( request, status, error ) {

                              }

            });
          }

        }

      });
    }

    infiniteScroll();

    return;

  },


  /* Debug Ctrl */
  debugCtrl : function(){

    return;
  },

  /* Message Ctrl */
  messageCtrl : function(){

    $("#message-search-input").focus(function(){
      $("#footer").css({"display":"none"});
    });
    $("#message-search-input").blur(function(){
      $("#footer").css({"display":"block"});
    });

    // Message Search
    $("#message-search-input").off('keyup').on('keyup',function(){

      var query     = $(this).val();
      var noResult  = true;

      if( query != ""){

        $(".message-people-item").each(function(){

          if($(this).data("username").search(new RegExp(query, "i")) == -1){

            $(this).addClass("displayNone");

          }else{

            noResult = false;
            $(this).removeClass("displayNone");

          }

        });

      }else{

        noResult = false;
        $(".message-people-item").removeClass("displayNone");

      }

      if(noResult){
        $(".message-people-item-no").css({"display":"block"});
      }else{
        $(".message-people-item-no").css({"display":"none"});
      }

    });


    return;
  },

  /* Message Inbox Ctrl */
  messageInboxCtrl : function(){

    var currentuserdata = JSON.parse($("#hiddenInput_currentuserdata").val() || null);
    $("#header-title").text(currentuserdata.uname);

    $('<div id="footer-input" class="row footer-special-element">' +
        '<div class="footer-item-wrapper col-lg-24 col-md-24 col-sm-24 col-xs-24">' +
          '<div class="footer-textarea-wrapper">' +
            '<textarea id="footer-textarea" placeholder="메세지를 입력하세요"></textarea>' +
            '<div class="footer-textarea-submit button" id="footer-textarea-submit">' +
              '<span>전송</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>').insertAfter($("#footer"));

    return;
  },


  /* Void Ctrl */
  voidCtrl : function(){
    return;
  }

}
/* End of Controller */


//============================================================
// Initiate functions
//------------------------------------------------------------
$(document).ready(function(){

  initiator();

  //============================================================
  // Update Check
  //------------------------------------------------------------
  if (server_toggle){
    var update_url = serverParentURL + "/common/update?currentVersion=" + currentVersion;
  } else {
    var update_url = serverParentURL + "/update?currentVersion=" + currentVersion;
  }
  $.ajax({
          method    : "GET",
          url: update_url,
          xhrFields: {withCredentials: true},
          success   : function( response ) {

                      if(response.length > 0){
                        $("#update-alert").html("");
                        $("#update-alert").append($.parseHTML(response));
                        $("#update-alert").css({"display":"block"});
                      }

                    },
          error     : function( request, status, error ) {

                    }

  });


  //============================================================
  // Cordova Plugin
  //------------------------------------------------------------
  document.addEventListener("deviceready",function(){

    // cordova-plugin-fcm : Push Notification
    FCMPlugin.onNotification(function(data){

        if(data.wasTapped){

          //Notification was received on device tray and tapped by the user.
          if(data.url){

            initiator(data.url);
            history.pushState(null, null, document.location.pathname + '#' + data.url);

          }

        }else{

          //Notification was received in foreground. Maybe the user needs to be notified.

        }

    });

    // Cordova-plugin-screen-orientation : Orientation Lock
    screen.orientation.lock('portrait');

    // Cordova-plugin-cache-clear : Cache Clear
    window.CacheClear(function(){}, function(){});

  });

})

window.addEventListener('popstate', function(event) {
  initiator();
});
