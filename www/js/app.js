/* Global Variables */
var currentVersioniOS = "1002"; // this must be string, not integer
var currentVersionAnd = "2003"; // this must be string, not integer
var mobile    = false;

// No slash at the end of the url
var serverParentURL = "http://www.hellowoot.co.kr"
// var serverParentURL = "http://derek-kim.com:8000";
// var serverParentURL = "http://127.0.0.1:8000"; // Don't remove this


// Alternate between new and old servers
var server_toggle = true;  // If toggle false, old & test server
var plugin_toggle = true;  // if toggle false, test mode

var signupVariable = {
      address : "",
      postcode : ""
};

/* Global Functions */
//============================================================
// Calendar
//------------------------------------------------------------
function displayCalendar(element, next, maxDate){

 var htmlContent ="";
 var FebNumberOfDays ="";
 var counter = 1;

 var dateNow = new Date();


 if(next){
  var month = dateNow.getMonth() + 1;
 }else{
  var month = dateNow.getMonth();
 }

 var nextMonth = month+1; //+1; //Used to match up the current month with the correct start date.
 var prevMonth = month -1;
 var day  = dateNow.getDate();
 var year = dateNow.getFullYear();


 // Feburary exception case
 if (month == 1){
    if ( (year%100!=0) && (year%4==0) || (year%400==0)){
      FebNumberOfDays = 29;
    }else{
      FebNumberOfDays = 28;
    }
 }


 // names of months and week days.
 var monthNames   = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
 var dayNames     = ["일","월","화","수","목","금", "토"];
 var dayPerMonth  = ["31", ""+FebNumberOfDays+"","31","30","31","30","31","31","30","31","30","31"];

 // days in previous month and next one , and day of week.
 var nextDate = new Date(year + "/" + nextMonth +'/1');
 var weekdays= nextDate.getDay();
 var weekdays2 = weekdays;
 var numOfDays = dayPerMonth[month];

 // this leave a white space for days of pervious month.
 while (weekdays>0){
    htmlContent += "<td class='monthPre'></td>";

 // used in next loop.
     weekdays--;
 }

 // loop to build the calander body.
 while (counter <= numOfDays){

     // When to start new line.
    if (weekdays2 > 6){
        weekdays2 = 0;
        htmlContent += "</tr><tr>";
    }

    var counterDate = new Date(year + "/" + (month +1) + "/" + counter);
    var timeDiff = Math.abs(counterDate.getTime() - dateNow.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (counter < day && !next){
        htmlContent +="<td class='calendar-day calendar-disable'>"+counter+"</td>";
    }else if(diffDays < 31){
        htmlContent +="<td class='calendar-day' onclick='$(\"#calendar-input-date\").val(" + (counterDate.getTime()/1000) + ");$(\".calendar-day\").removeClass(\"selected\");$(this).addClass(\"selected\");'>"+counter+"</td>";
    }else{
        htmlContent +="<td class='calendar-day calendar-disable'>"+counter+"</td>";
    }

    weekdays2++;
    counter++;
 }

 // building the calendar html body.
 var calendarBody = "";
 if(next){
  calendarBody = "<table class='calendar'> <tr class='monthNow'><th id='prev-month-button'><</th><th colspan='5'>"+ year + "년 " + monthNames[month] +"</th><th></th></tr>";
 }else{
  calendarBody = "<table class='calendar'> <tr class='monthNow'><th></th><th colspan='5'>"+ year + "년 " + monthNames[month] +"</th><th id='next-month-button'>></th></tr>";
 }
 calendarBody +="<tr class='dayNames'>  <td>일</td>  <td>월</td> <td>화</td>"+
 "<td>수</td> <td>목</td> <td>금</td> <td>토</td> </tr>";
 calendarBody += "<tr>";
 calendarBody += htmlContent;
 calendarBody += "</tr></table>";
 calendarBody += "<input type='hidden' id='calendar-input-date' />";
 // set the content of div .
 $(element).html(calendarBody);
 $("#next-month-button").off("click").on("click",function(){
   displayCalendar("#calendar",true);
 });
 $("#prev-month-button").off("click").on("click",function(){
   displayCalendar("#calendar",false);
 });

}

//============================================================
// Popup
//------------------------------------------------------------
function popup( message, callback ){

  if(typeof callback == "function"){

    var elm = '<div id="popup-message">' +
                '<span>' + message + '</span>' +
                '<div class="button-wrapper"><div class="confirm button">확인</div><div class="cancel button">취소</div></div>' +
              '</div>';

    $("body").append(elm);

    $("#popup-message .confirm").off("click").on("click",function(){
      callback();
      $("#popup-message").remove();
    });
    $("#popup-message .cancel").off("click").on("click",function(){
      $("#popup-message").remove();
    });

  }else{

    var timebomb   = callback     || 5000;

    var elm = '<div id="popup-message">' +
                '<span>' + message + '</span>' +
              '</div>';

    $("body").append(elm);

    setTimeout(function(){
      $("#popup-message").remove();
    }, timebomb);

  }

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
                        $("#pullup .pullup-inner").html("");
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
                        initiator($(this).attr("href"), true);
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
          xhrFields : {withCredentials: true},
          credentials: 'include',
          success   : function( response ) {

                      $(targetElm).html("");
                      $(targetElm).append($.parseHTML(response, null, true));
                      $(targetElm).css({"display":"block"});
                      $("woot-click").off('click').on('click',function(){
                        initiator($(this).attr("href"), true);
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
    $("template-view").removeAttr("style");
    $("#popup-message").hide();
    history.back();
  });
  $(".history-home").off('click').on('click',function(){
    window.location.replace('./index.html');
  });
  $("woot-click").off('click').on('click',function(){
    initiator($(this).attr("href"), true);
    $("#popup-message").hide();

    if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
        var pageurl = window.location.href.split("#")[1].split("?");
        logViewedContentEvent(pageurl[0], pageurl[1] || "none");
    }
  });
}

// Facebook SDK App Event Functions
if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
  function logViewedContentEvent(contentType, contentId) {
    var params = {};
    params["CONTENT_TYPE"] = contentType;
    params["CONTENT_ID"] = contentId;
    facebookConnectPlugin.logEvent("VIEWED_CONTENT", params, null);
    console.log(params);
  }
  function logCompletedTutorialEvent(contentId, success) {
      var params = {};
      params["CONTENT_ID"] = contentId;
      params["SUCCESS"] = success ? 1 : 0;
      facebookConnectPlugin.logEvent("COMPLETED_TUTORIAL", params, null);
      console.log(params);
  }
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

  if(hour >= 12){
    if(hour == 12){

    }else{
        hour = hour - 12;
    }
    ampm      = '오후';
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
      this.type = ''
      this.type = 'file'
    }
  });

  $("#write-section-item-photo-button").removeClass("disabled");
}

//============================================================
// Factory function that makes ajax submit handlers.
// Note that this depends on api variable so the url
// shouldn't start with http://
//------------------------------------------------------------
function makeAjaxSubmitHandler(successFn) {
    function handler(e) {
        e.preventDefault();
        var url = $(this).attr("action");
        api.post(url, $(this).serialize(), successFn);
    }

    return handler;
}

/* End of Global Functions */


//============================================================
// View Configuration
//------------------------------------------------------------
var viewConfig = {
  "/index" : {
    "controller"  : "mainCtrl",
    "template"    : serverParentURL + "/home",
    "header"      : "./header/index.html"
  },
  "/invalid_status": {
    "controller": "loginCtrl",
    "template": serverParentURL + "/account/invalid_status",
    "footerHide": true
  },
  "/logout": {
    "controller": "loginCtrl",
    "template": serverParentURL + "/account/logout",
    "footerHide": true
  },
  "/login" : {
    "controller"  : "loginCtrl",
    "template"    : serverParentURL + "/account/login",
    "footerHide"  : true
  },
  "/login/find_username" : {
    "controller"  : "loginCtrl",
    "template"    : serverParentURL + "/account/find_username",
    "footerHide"  : true
  },
  "/login/reset_password" : {
    "controller"  : "loginCtrl",
    "template"    : serverParentURL + "/account/reset_password",
    "footerHide"  : true
  },
  "/login/intro" : {
    "controller"  : "loginCtrl",
    "template"    : serverParentURL + "/misc/intro",
    "footerHide"  : true
  },
  "/signup": {
    "controller": "signupCtrl",
    "template": serverParentURL + "/account/signup",
    "footerHide": true
  },
  "/signup/to_be_approved": {
    "controller": "signupCtrl",
    "template": serverParentURL + "/account/to_be_approved",
    "footerHide": true
  },
  "/login/signup/confirm" : {
    "controller"  : "signupConfirmCtrl",
    "template"    : serverParentURL + "/login/confirm",
    "footerHide"  : true
  },
  "/message" : {
    "controller"  : "messageCtrl",
    "template"    : serverParentURL + "/misc/message_list",
    "header"      : "./header/message.html"
  },
  "/message/inbox" : { // Doesn't exist
    "controller"  : "messageInboxCtrl",
    "template"    : serverParentURL + "/message/inbox",
    "header"      : "./header/message.inbox.html",
    "footerHide"  : true
  },
  "/notification" : {
    "controller"  : "notificationCtrl",
    "template"    : serverParentURL + "/action/notification",
    "header"      : "./header/notification.html",
    "footerHide"  : true
  },
  "/write" : {
    "controller"  : "writeCtrl",
    "template"    : serverParentURL + "/write",
    "header"      : "./header/write.html",
    "footerHide"  : true
  },
  "/write/gathering/edit" : {
    "controller"  : "writeCtrl",
    "template"    : serverParentURL + "/gathering_edit",
    "header"      : "./header/write.gathering.edit.html",
    "footerHide"  : true
  },
  "/write/posting/edit" : {
    "controller"  : "writeCtrl",
    "template"    : serverParentURL + "/post_edit",
    "header"      : "./header/write.posting.edit.html",
    "footerHide"  : true
  },
  "/post_category_list" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/post_category_list",
    "header"      : "./header/board.html"
  },
  "/post_list" : {
    "controller"  : "postListCtrl",
    "template"    : serverParentURL + "/post_list",
    "header"      : "./header/board.posting.html"
  },
  "/post_detail" : {
    "controller"  : "postDetailCtrl",
    "template"    : serverParentURL + "/post_detail",
    "header"      : "./header/board.posting.html"
  },
  "/post_users_liking" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/post_users_liking",
    "header"      : "./header/board.posting.like.html"
  },
  "/gathering_list" : {
    "controller"  : "gatheringListCtrl",
    "template"    : serverParentURL + "/gathering_list",
    "header"      : "./header/gathering.html"
  },
  "/gathering_list/my" : {
    "controller"  : "gatheringListCtrl",
    "template"    : serverParentURL + "/gathering_list/my",
    "header"      : "./header/gathering.my.html"
  },
  "/gathering_detail" : {
    "controller"  : "gatheringDetailCtrl",
    "template"    : serverParentURL + "/gathering_detail",
    "header"      : "./header/gathering.detail.html",
    "footerHide"  : true
  },
  "/gathering_members" : {
    "controller"  : "gatheringDetailCtrl",
    "template"    : serverParentURL + "/gathering_members",
    "header"      : "./header/gathering.participants.html",
    "footerHide"  : true
  },
  "/chat" : {
    "controller"  : "chatCtrl",
    "template"    : serverParentURL + "/chat/gathering_detail",
    "header"      : "./header/void.html",
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
    "template"    : serverParentURL + "/account/more",
    "header"      : "./header/people.html"
  },
  "/account/profile" : {
    "controller"  : "profileCtrl",
    "template"    : serverParentURL + "/account/profile",
    "header"      : "./header/people.profile.html"
  },
  "/account/edit" : {
    "controller"  : "profileEditCtrl",
    "template"    : serverParentURL + "/account/edit",
    "header"      : "./header/people.profile.edit.html",
    "footerHide"  : true
  },
  "/account/change_password" : {
    "controller"  : "passwordEditCtrl",
    "template"    : serverParentURL + "/account/change_password",
    "header"      : "./header/people.profile.edit.password.html",
    "footerHide"  : true
  },
  "/debug" : {
    "controller"  : "debugCtrl",
    "template"    : serverParentURL + "/debug",
    "header"      : "./header/index.html"
  },
  "/report/gathering" : {
    "controller"  : "reportCtrl",
    "template"    : serverParentURL + "/support/report/gathering",
    "header"      : "./header/report.html",
    "footerHide"  : true
  },
  "/report/post" : {
    "controller"  : "reportCtrl",
    "template"    : serverParentURL + "/support/report/post",
    "header"      : "./header/report.html",
    "footerHide"  : true
  },
  "/support/suggest" : {
    "controller"  : "reportCtrl",
    "template"    : serverParentURL + "/support/suggest",
    "header"      : "./header/suggest.html",
    "footerHide"  : true
  },
  "/guideone" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/misc/guideone",
    "header"      : "./header/void.html",
    "footerHide"  : true
  },
  "/guidetwo" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/misc/guidetwo",
    "header"      : "./header/void.html",
    "footerHide"  : true
  },
  "/guidethree" : {
    "controller"  : "voidCtrl",
    "template"    : serverParentURL + "/misc/guidethree",
    "header"      : "./header/void.html",
    "footerHide"  : true
  }
}

var api = {
  get : function(url, successFn){
    var successFn = successFn || function(){};
    var res;
    var promise = $.ajax({
              method    : "GET",
              url       : serverParentURL + url,
              dataType  : "json",
              xhrFields : {withCredentials: true},
              success   : function( response ) {
                          res = response;
                        },
              error     : function( request, status, error ) {
                          console.error(error);
                        }
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

  post : function(url, data, successFn){
    var successFn = successFn || function(){};
    var res;
    var errorStatus;
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
              error     : function( request, status, error ) {
                          errorStatus = request.status;
                          console.error(error);
                        }
    });

    promise.then(function(){
      return successFn(res);
    })
    .catch(function(){
      if(errorStatus == 403){
        var elm = '<div id="popup-message">' +
                    '<span>연결 오류. 앱을 완전히 껐다 다시 켜주세요. 그리고 앱을 최신버전으로 업데이트해주세요</span>' +
                  '</div>';
        $("body").append(elm);
        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);
      }else{
        var elm = '<div id="popup-message">' +
                    '<span>API 연결 오류</span>' +
                  '</div>';
        $("body").append(elm);
        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);
      }

    });
  },

  postMulti : function(url, data, successFn){
    var successFn = successFn || function(){};
    var res;
      console.log(url);
    var promise = $.ajax({
              method    : "POST",
              data      : data,
              url       : serverParentURL + url,
              enctype   : "multipart/form-data",
              processData: false,
              contentType: false,
              cache: false,
              dataType  : "json",
              headers   : {
                      'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
              },
              xhrFields : { withCredentials: true },
              success   : function( response ) {
                          res = response;
                        },
              error     : function( request, status, error ) {
                          console.error(error);
                        }
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

  delete : function(url, data, successFn){
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
function initiator(newPath, pushState){
  $("#template-view").css({"overflow":""});
  $("body").css({"overflow":"inherit"});
  $(".overlap-close").click();

  // Delete last template Ajax call if exists
  if (initAjax != "") {
    initAjax.abort();
  }

  if (pushState) {
      history.pushState(null, null, document.location.pathname + '#' + newPath);
  }

  var pathsplit   = newPath || window.location.hash.split("#")[1] || "";
  var pathname    = "";

  if (pathsplit) {
    pathname = pathsplit.split("?")[0];
  } else {
    var pathHtmlSplit = window.location.href.split("/");
    var pathHtml = pathHtmlSplit[pathHtmlSplit.length - 1]
    if (pathHtml == "index.html") {
      pathname = "/index";
    } else if (pathHtml == "login.html") {
      pathname = "/invalid_status";
    }else{
      pathname = "/index";
    }
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

  // if (server_toggle){
  //   var highlight_url = "/common/highlight"
  // } else {
  //   var highlight_url = "/api/v1/get/highlight"
  // }

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
  $.each(Object.keys(viewConfig), function(index,value){
    if (pathname != value) { return; }
    $("#template-view-loading").css({"display":"block"});
    $("#template-view-loading").css({"opacity":"1"});
    $("#template-view").html("");

    renderTemplate(viewConfig[value]["header"], "#template-header", function(){
      var res;
      initAjax = $.ajax({
              method    : "GET",
              url       : viewConfig[value]["template"] + idSlash + pathParams,
              xhrFields : {withCredentials: true},
              credentials: 'include',
              success   : function( response ) {
                          $("#template-view").html("");
                          $("#template-view").append($.parseHTML(response, null, true));
                          $("#template-view").css({"display":"block"});
                          $("woot-click").off('click').on('click', function(){
                            initiator($(this).attr("href"), true);
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

          globalEventHandler();
          controller[viewConfig[value]["controller"]](pathParamsJson);
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

function button_like() {
  var id = $(this).data("pid") || $(this).data("gid");
  var action = $(this).data("action");
  var type = ( ($(this).data('pid')) > 0 ? 'post' : 'gath' );
  var data = (type == 'post') ? {'pid': id, 'action': action} : {'gid': id, 'action': action};
  var url = (type == 'post') ? "/post_like/" : "/gathering_like/";
  var button = $(this);

  // TODO: need to add error handling
  if (button.hasClass("liked")) { // Already Liked
    api.post(url, data, function (res) {
      console.log(res);
      if(res['ok']) {
        var next_action = "on";
        button.data("action", next_action);
        button.removeClass("liked");
        button.css("background-image", "url('http://www.hellowoot.co.kr/static/asset/images/main/func_like_off.png')");

        if (type == 'post'){
          var count = parseInt($("#posting-item-" + id).find(".posting-stat .like .count").text());
          $("#posting-item-" + id).find(".posting-stat .like .count").text(count - 1);

          if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
              logCompletedTutorialEvent("like_post", false);
          }
        } else {
          var count = parseInt($("#gathering-stats-like").text());
          $("#gathering-stats-like").text(count - 1);
          $('#gathering-stats-nor').data("link", "");

          if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
              logCompletedTutorialEvent("like_gath", false);
          }
        }
      }
    });

  } else {
    api.post(url, data, function (res) {
      console.log(res);
      if(res['ok']) {
        var next_action = "off";
        button.data("action", next_action)
        button.addClass("liked");
        button.css("background-image", "url('http://www.hellowoot.co.kr/static/asset/images/main/func_like_on.png')");

        if (type == 'post'){
          var count = parseInt($("#posting-item-" + id).find(".posting-stat .like .count").text());
          $("#posting-item-" + id).find(".posting-stat .like .count").text(count + 1);

          if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
              logCompletedTutorialEvent("like_post", true);
          }
        } else {
          var count = parseInt($("#gathering-stats-like").text());
          $("#gathering-stats-like").text(count + 1);
          $('#gathering-stats-nor').data("link", "/gathering_members?gid=" + id);

          if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
              logCompletedTutorialEvent("like_gath", true);
          }
        }
      }
    });
  }
}

function pullupGuideTemplate(templeteUrl){
  pullupMenu(templeteUrl, function(){
      $(".overlap-close").off("click").on("click",function(){
          $("#template-view-pullup").css({"display":"none"}).html("");
          $("#pullup .background").trigger("click");
      });
  });
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

    // Blockname Replace
    var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);
    $("#header-title").text(userdata.block + " 블록");

    function refreshDeviceToken() {
        FirebasePlugin.onTokenRefresh(function(dtoken) {
            if (dtoken && userdata.dtoken != dtoken) {
                api.post("/account/change_devicetoken/", {"devicetoken":dtoken}, function(res){
                    if (res['ok']) {
                        console.log("dtoken updated by Refresh");
                    } else {
                        console.log("api.post failed - Refresh");
                    }
                    return;
                });
            }
        });
        FirebasePlugin.getToken(function(dtoken) {
          if (dtoken && userdata.dtoken != dtoken) {
                api.post("/account/change_devicetoken/", {"devicetoken":dtoken}, function(res){
                    if (res['ok']) {
                        console.log("dtoken updated by Get");
                    } else {
                        console.log("api.post failed - Get");
                    }
                    return;
                });
            }
        });
    }

    if(typeof FirebasePlugin != 'undefined'){
       refreshDeviceToken();
    }

    // Header Notification Highlight
    var notidata = JSON.parse($("#hiddenInput_notidata").val() || null);
    var numNewNoti = notidata.num_noti;
    if (numNewNoti > 0) {
      $('.header-right-index-item.notification').append('<span class="header-item-noti">' + numNewNoti + '</span>');
    }

    // requiring points for gathering
    var udata = JSON.parse($("#hiddenInput_userdata").val() || null);
    var points_left = parseInt(udata.points_earned) - parseInt(udata.points_used);

    $(".gathering-item").off("click").on("click", function(){
        var item = $(this);
        var gid = item.data("id");

        if ( item.hasClass("gathering-item-more") ) {
            initiator("/gathering_list", true);
        } else if ( item.data("join") ) {
            if ( item.data("chaton") ) {
                initiator("/chat?gid=" + gid, true);
            } else {
                initiator("/gathering_detail?gid=" + gid, true);
            }
        } else {
            if ( points_left >= 3 ) {
                initiator("/gathering_detail?gid=" + gid, true);
            } else {
              popup("게더링에 참여하기 위해서는 포인트 3점을 모아야 해요.<br><br><span class='guide-point'>포인트 얻는 방법 확인 >></span>");
              $(".guide-point").off("click").on("click", function(){
                  $("#popup-message").hide();
                  pullupGuideTemplate("pullup_guide_point");
              });
            }
        }
    });

    return;
  },

  /* Notification Ctrl */
  notificationCtrl : function(){
    var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);

    api.get("/action/read_all/", function(){});

    $('.notification-item').each(function (index) {
        $(this).off('click').on('click', function() {
            actionUrl = $(this).data('url');

            api.get(actionUrl, function(res) {
                console.log(res);
                if(res['ok']) {
                    var urlSplit = res.url.split("/");
                    var urlType = urlSplit[1];
                    var id = urlType.indexOf("account") > -1 ? urlSplit[3] : urlSplit[2];

                    // post -> post_detail
                    if ( urlType.indexOf("post") > -1 ) {
                        initiator("/post_detail?pid=" + id, true);
                    }
                    // gathering (need to fix the condition of if statement through 'chatting_on')
                    else if ( urlType.indexOf("gathering") > -1 ) {
                        if ( res.target.fields.is_chatting_on == true && res.target.fields.users_joining.includes(parseInt(userdata.uid)) ) {
                            initiator("/chat?gid=" + id, true);
                        } else if ( res.target.fields.is_removed == true || res.target.fields.is_accessible == false ) {
                            popup('사라진 게더링이라서 접근이 불가능합니다.');
                        } else {
                            initiator("/gathering_detail?gid=" + id, true);
                        }
                    }
                    // woot -> profile
                    else if ( urlType.indexOf("account") > -1 ) {
                        initiator("/account/profile?uid=" + id, true);
                    }

                }
            });
        });
    });
    return;
  },


  /* Login Ctrl */
  loginCtrl : function(){
    $("#header").css({"display":"none"});
    $("#footer").css({"display":"none"});

    // iOS: blur keyboard by clicking outside area
    $(".login-contents").off("click").on("click", function(){
        $("input").blur();
    });
    $(".account-find").off("click").on("click", function(){
        $("input").blur();
    });
    $("input").off("click").on("click", function(event){
        event.stopPropagation();
    });

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
            headers   : {
                      'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            credentials: 'include',
            xhrFields : { withCredentials: true },
            success   : function( response ) {
                            if(response['ok']){
                              window.location.replace('./index.html');
                            } else {
                              popup('아이디 혹은 비밀번호가 일치하지 않습니다.');
                            }
                        },
            error     : function( request, status, error ) {
              popup('연결 오류. 앱을 완전히 껐다 다시 켜주세요. 그리고 앱을 최신버전으로 업데이트해주세요');
            }
      });
    });

    $('#account-find-input-submit-username').off('click').on('click', function(e){
        e.preventDefault();
        api.post("/account/find_username/", $(this).closest('form').serialize(), function(res) {
            if (res['ok']){
                popup("가입하신 이메일은" + res.username + "입니다." );
                initiator("/login", true);
            } else {
                popup("해당 핸드폰 번호로 가입한 아이디는 존재하지 않습니다.");
            }
        });
    });

    $('#account-find-input-submit-password').off('click').on('click', function(e){
        e.preventDefault();
        popup("입력하신 메일 주소가 정확하나요? 정확하지 않을 경우 비밀번호 설정 메일이 가지 않습니다.", function() {
            $.ajax({
                  url       : serverParentURL + "/account/reset_password/",
                  type      : 'POST',
                  data      : $(this).closest('form').serialize(),
                  headers   : {
                            'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
                  },
                  credentials: 'include',
                  xhrFields : { withCredentials: true },
                  success   : function( response ) {
                                  $("#background-resetpassword").show();
                                  popup("메일을 전송 중이니 잠시만 기다려주세요..", 7000);
                                  setTimeout( function(){
                                      $("#background-resetpassword").hide();
                                      popup("비밀번호 설정 메일을 보내드렸습니다. 최대 5분 이상 시간이 걸릴 수 있습니다.")
                                  }, 7000);
                              },
                  error     : function( request, status, error ) {
                              }
            });

        });
    });

    return;
  },

  signupCtrl : function() {
      $("#header").hide();
      $("#footer").hide();

      // iOS: blur keyboard by clicking outside area
      $(".signup-item-wrapper").off("click").on("click", function(){
          $("input").blur();
          $("textarea").blur();
      });
      $("input").off("click").on("click", function(event){
        event.stopPropagation();
      });
      $("textarea").off("click").on("click", function(event){
        event.stopPropagation();
      });

      // update devicetoken
      var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);

      function refreshDeviceToken() {
          FirebasePlugin.onTokenRefresh(function(dtoken) {
              if (dtoken && userdata.dtoken != dtoken) {
                  api.post("/account/change_devicetoken/", {"devicetoken":dtoken}, function(res){
                      if (res['ok']) {
                          console.log("dtoken updated by Refresh");
                      } else {
                          console.log("api.post failed - Refresh");
                      }
                      return;
                  });
              }
          });
          FirebasePlugin.getToken(function(dtoken) {
            if (dtoken && userdata.dtoken != dtoken) {
                  api.post("/account/change_devicetoken/", {"devicetoken":dtoken}, function(res){
                      if (res['ok']) {
                          console.log("dtoken updated by Get");
                      } else {
                          console.log("api.post failed - Get");
                      }
                      return;
                  });
              }
          });
      }

      if(userdata.uid != "None" && typeof FirebasePlugin != 'undefined'){
          refreshDeviceToken();
      }

      // redirection to login or signup
      $('#redirect-signup').trigger('click');

      // 1. info.html
      $("#signup-item-input-email").focusout(function(){
          var data = { email: $("#signup-item-input-email").val() }
          api.post("/account/signup/validate_email/", data, function(response){
              $(".message-email").css({"display":"block"});
              console.log(response);
              if(response['ok']){
                  $(".message-email")
                  .find("span")
                  .css({"color":"#2ecc71"})
                  .text("가입 가능한 이메일입니다.");
              }else{
                  $(".message-email")
                  .find("span")
                  .css({"color":"#e74c3c"})
                  .text("이미 가입되어 있는 이메일입니다.");
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
        $("#signup-address-result").show();
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
                if (response.results.common.totalCount == 0) {
                    var $ul = $("<ul><li><span>검색 결과가 없습니다.</span></li></ul>");
                    $("#signup-address-result").append($ul);
                } else {
                    var $ul = $("<ul>");
                    $(response.results.juso).each(function(){
                        var $li = $("<li>")
                        $('<span>').text(this.jibunAddr).appendTo($li);
                        $li.data('addr', this.jibunAddr);
                        $li.data('postcode', this.zipNo);
                        $ul.append($li);
                    });
                    $("#signup-address-result").append($ul);
                    $("#signup-address-result li").off('click').on('click', function(){
                        // save addr and postcode data
                        var data = $(this).data();
                        console.log(data);
                        signupVariable["address"] = JSON.parse(JSON.stringify(data.addr));
                        signupVariable["postcode"] = JSON.parse(JSON.stringify(data.postcode));

                        $('#signup-address-input').val(signupVariable["address"]);
                        $('#signup-item-input-postcode').val(signupVariable["postcode"]);

                        // designate user's block
                        api.post("/account/signup/address/", data, function(response){
                            console.log(response)
                            $('#signup-item-input-area').val(response.area_id);
                            $("#signup-address-result ul").html("");
                            $("#signup-address-result").hide();
                        });

                        // validate address and show signable blocks
                        /* comment
                        api.post("/account/signup/address/", data, function(response){
                            $("#signup-address-result").hide();
                            if (response['ok']){
                                // TODO: enable '다음' button
                                $("#signup-address-block-result").css({"display":"block"});
                                $("#signup-address-block-result ul").html("");

                            } else {
                                // TODO: show error and reset search form(다시 검색 가능하도록 화면 초기화)
                                console.log('not ok');
                                $('#signup-address-input').val("");
                                var elm = '<div id="popup-message">' +
                                            '<span>현재 가입이 불가능한 주소입니다.</span>' +
                                          '</div>';

                                $("body").append(elm);

                                setTimeout(function(){
                                  $("#popup-message").remove();
                                }, 5000);

                            }

                            // TODO: show signable blocks
                            $.each(res['blocks'], function(index, value){
                              $("#signup-address-block-result ul").append('<li>' +
                                                                            '<div class="block-title">' +
                                                                              '<span>' + value.title + '</span>' +
                                                                            '</div>' +
                                                                            '<div class="block-subtitle">' +
                                                                              '<span>' + value.subtitle + '</span>' +
                                                                            '</div>' +
                                                                          '</li>');
                            });
                        });
                        */
                    });
                } // else
              },
            error     : function( request, status, error ) {}
        });
      });

      if($("#signup-item-input-devicetoken") && typeof FirebasePlugin != 'undefined'){
          FirebasePlugin.getToken(function(token){
              $("#signup-item-input-devicetoken").val(token);
          });
      }

      // Radio
      $(".signup-radio-container .signup-radio-button").off('click').on('click',function(){
        var container   = $(this).parent();
        var radioValue  = $(this).data("radio");

        $(container).find(".signup-radio-button").removeClass("selected");
        $(this).addClass("selected");
        $(container).find("input").val(radioValue);

      });

      $.each($(".signup-radio-container .signup-radio-button-route"), function(){
          var inputRoute = $(this).find("input");

          $(this).off("click").on("click", function(){
              if ( $(this).data("radio") == "off") {
                  $(this).addClass("selected");
                  $(this).data("radio", "on");
                  inputRoute.val(true);
              } else {
                  $(this).removeClass("selected");
                  $(this).data("radio", "off");
                  inputRoute.val(false);
              }
          });
      });

      $.each($('.radio-container .checkmark-signup'), function(){
          var checkmark = $(this);
          console.log(checkmark);
          var parent = $(this).closest(".radio-container");
          console.log(parent);
          var checkbox = parent.find('input[type="checkbox"]');
          console.log(checkbox);

          checkmark.off('click').on('click', function(){
              if ( checkmark.hasClass("selected") ) {
                  console.log("off");
                  checkbox.val("off");
                  checkmark.removeClass("selected");
              } else {
                  console.log("on");
                  checkbox.val("on");
                  checkmark.addClass("selected");
              }
          });
      });

      var infoSubmitHandler = function(e){
          e.preventDefault();
          $this = $(this);

          var url = $this.attr("action");

          if ( $('input[name="address"]').val() != "" && $('input[name="address_detail"]').val() != "" ){
              if ( $('input[name="privacy1"]').val() == "on" && $('input[name="privacy2"]').val() == "on" ){
                  api.post(url, $this.serialize(), function(response){
                      if ( response['ok'] ){
                          initiator('/signup', false);  // no pushState
                      } else {
                          popup("모든 정보를 정확하게 입력해 주세요.");
                          console.log(response['user_form_errors']);
                          console.log(response['profile_form_errors']);
                      }
                  });
              } else {
                  popup("필수 약관들에 동의해주세요.");
              }
          } else {
              popup("주소를 정확히 입력해주세요.");
          }
      }

      $("#signup-info-form").on('submit', infoSubmitHandler);
      $(".signup-footer-item-forward-info").off('click').on('click', function(){
          $("#signup-info-form").submit();
      });

      // 3. block_select.html: check community
      // $(".signup-footer-item-forward-block").off('click').on('click', function(){
    	// 	if ( $(this).data("status") == "on" ) {
    	// 		api.post("/account/signup/block_select/", $("form").serialize(), function(response){
    	// 			if (response['ok']){
    	// 				initiator("/signup");  // no pushState
    	// 			} else {
    	// 				popup("회원가입 과정에 오류가 발생했습니다. contact@hellowoot.co.kr로 문의해주세요.")
    	// 				console.log(response['errors']);
      //                   console.log(response);
    	// 			}
    	// 		});
    	// 	} else {
    	// 		popup("문자 알람 신청 되었습니다. 커뮤니티가 열리면 문자로 알려드릴게요.");
      //           $.ajax({
      //                 method    : "GET",
      //                 url       : serverParentURL + "/account/logout",
      //                 success   : function( response ) {
      //                              initiator("/login", false);
      //                           },
      //                 error     : function( request, status, error ) {
      //
      //                           }
      //           });
    	// 	}
      // });


      // ModelHouse Past Version
      // var modelHouseHTML = $("#model-house-item-wrapper").find(".model-house-item");
      // $("#model-house-item-wrapper").html("");
      //
      // $.each(modelHouseHTML,function(index,elm){
      //   setTimeout(function(){
      //     $("#model-house-item-wrapper").prepend(elm);
      //     anime({
      //       targets: '.model-house-item:nth-child(1)',
      //       opacity: 0,
      //       duration: 1000,
      //       easing: 'easeInOutQuart',
      //       direction: 'reverse'
      //     });
      //   }, 5000 * index);
      // });

      // Pullup Guide for Waiting and Verify
      $(".blockopen-reason").off("click").on("click",function(){
          pullupGuideTemplate("pullup_guide_blockopen");
      });

      $(".verify-reason").off("click").on("click",function(){
          pullupGuideTemplate("pullup_guide_verify");
      });

      // Confirm Form
      $(".signup-confirm-button").off('click').on('click',function(){
        $(".signup-confirm-form-wrapper").css({"display":"block"});
        var type = $(this).data("confirm");
        if(type == "post"){
          $(".signup-confirm-form-wrapper .post").css({"display":"block"});
          $(".signup-confirm-form-wrapper .bill").css({"display":"none"});
        }else{
          $(".signup-confirm-form-wrapper .post").css({"display":"none"});
          $(".signup-confirm-form-wrapper .bill").css({"display":"block"});
        }

        // Close
        $(".signup-confirm-form-wrapper .close").off('click').on('click',function(){
          $(".signup-confirm-form-wrapper").css({"display":"none"})
        });

      });

      // Verify Upload
      $(".verify-upload-button").off("click").on("click",function(){
          $(".upload-img").click();
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

            $('.test-image').attr('src', dataURL);

          });
        };

        image.onerror = function () {
          console.log('Image Processor Error');
        };

      }

      if(window.File && window.FileList && window.FileReader){
        var $filesInput = $("input.upload-img");
        $filesInput.on("change", function(event){
            console.log(event);
            console.log(event.target);
            var inputOrder = event.target.getAttribute('data-inputOrder');
            var file = event.target.files[0];
            var picReader = new FileReader();

            console.log(inputOrder);
            console.log(file);
            console.log(picReader);

            picReader.onloadend = function(){
                imageProcessor(picReader.result, file.type, inputOrder);
            };

            picReader.readAsDataURL(file);

        });
      }

      $("#form-verify").submit(function(event){
          event.preventDefault();

          if($("#form-verify input[name='img']").val() == ""){
              popup("주소 이미지를 첨부해주세요.");
              return;
          }

          var url = $(this).attr("action");
          var data = new FormData(this);

          api.postMulti(url, data, function(response){
              if (response['ok']){
                  initiator("/signup", true);
              } else {
                  console.log("fail");
              }
          });


      });

      // Signup Logout

      $(".signup-footer-logout").off("click").on("click",function(){
          $.ajax({
                    method    : "GET",
                    url       : serverParentURL + "/account/logout",
                    success   : function( response ) {
                                 initiator("/login", false);
                              },
                    error     : function( request, status, error ) {

                              }
          });
      });

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
    });


    // Confirm Form
    $(".signup-confirm-button").off('click').on('click',function(){
      $(".signup-confirm-form-wrapper").css({"display":"block"});
      var type = $(this).data("confirm");
      if(type == "post"){
        $(".signup-confirm-form-wrapper .post").css({"display":"block"});
        $(".signup-confirm-form-wrapper .bill").css({"display":"none"});
      }else{
        $(".signup-confirm-form-wrapper .post").css({"display":"none"});
        $(".signup-confirm-form-wrapper .bill").css({"display":"block"});
      }
    });

    return;

  },

  /* WriteCtrl */
  writeCtrl : function(){
    $("#footer").css({"display":"none"});

    /* Global */
    $("textarea").on('keydown keyup', function () {
      $(this).height(1).height( $(this).prop('scrollHeight') - 16);
    });

    // iOS: blur keyboard by clicking outside area
    $(".write-section").off("click").on("click", function(){
        $("input").blur();
        $("textarea").blur();
    });
    $("input").off("click").on("click", function(event){
      event.stopPropagation();
    });
    $("textarea").off("click").on("click", function(event){
      event.stopPropagation();
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
      var stickerID = $(this).data("code");
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
      if ( $(this).data("edit") == "no" ) {
          pullupMenu("pullup_calendar",function(){
            displayCalendar("#calendar",false);

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
              if(hour > 12){
                hour = 0;
              }else if(hour < 0){
                hour = 0;
              }

              if(hour > -1 && hour < 10){
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

              if(minute > -1 && minute < 10){
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

              if(!date || !hour || !minute){
                popup("모든 값을 정확히 입력해주세요.");
                return;
              }

              if(ampm == "am"){
                if(hour == 12){
                    hour = hour - 12;
                }
                timestamp = parseInt(date) + (parseInt(hour) * 60 * 60) + (parseInt(minute) * 60);
              }else{
                if(hour == 12){
                    hour = hour - 12;
                }
                timestamp = parseInt(date) + ((parseInt(hour) + 12) * 60 * 60) + (parseInt(minute) * 60);
              }

              var ServerDate = new Date(timestamp*1000);
              $("#write-gathering-input-time-date0").val(ServerDate.getFullYear() + "-" + (ServerDate.getMonth() + 1) + "-" + ServerDate.getDate());
              $("#write-gathering-input-time-date1").val(ServerDate.getHours() + ":" + ServerDate.getMinutes());

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
      }
    });


    $("#write-gathering-input-agelimit-fake").off('click').on('click',function(){
      pullupMenu("pullup_agelimit",function(){

        var myage = $("#myage").val() || 30;
        var i = 2;
        var j = 2;
        var agedown = parseInt(myage) - i;
        var ageup = parseInt(myage) + j;
        while(agedown >= 20){
            $(".roller-min ul").append('<li class="button" data-age="' + agedown + '">' + agedown + '</li>');
            i += 1;
            agedown = parseInt(myage) - i;
        }
        while(ageup <= 99){
            $(".roller-max ul").append('<li class="button" data-age="' + ageup + '">' + ageup + '</li>');
            j += 1;
            ageup = parseInt(myage) + j;
        }

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

            $("#write-gathering-input-agelimit-has").val(false);

          }else if(minage && maxage){
            $("#pullup .background").click();
            $("#write-gathering-input-agelimit-fake").val(minage + " ~ " + maxage);

            $("#write-gathering-input-agelimit-min").val(minage);
            $("#write-gathering-input-agelimit-max").val(maxage);
            $("#write-gathering-input-agelimit-has").val(true);
          } else {
            popup('최소나이와 최대나이를 모두 입력해주세요');
          }
        });

      });
    });

    $("#write-gathering-input-prestage").off('click').on('click',function(){
      if ( $(this).data("edit") == "no" ) {
          pullupMenu("pullup_prestage",function(){

            // Prestage Event Handler
            $("#pullup-prestage-input-duration input").off('click').on('click',function(){
              $("#pullup-prestage-input-duration .roller").css({"display":"block"});

              $("#pullup-prestage-input-duration li").off('click').on('click',function(){
                $("#pullup-prestage-input-duration input").val($(this).data("duration"));
                $("#pullup-prestage-input-duration .roller").css({"display":"none"});
              });
            });

            $("#pullup-prestage-input-min-people input").off('click').on('click',function(){
              $("#pullup-prestage-input-min-people .roller").css({"display":"block"});

              $("#pullup-prestage-input-min-people li").off('click').on('click',function(){
                $("#pullup-prestage-input-min-people input").val($(this).data("people"));
                $("#pullup-prestage-input-min-people .roller").css({"display":"none"});
              });
            });

            // Prestage Submit
            $("#pullup-prestage-submit").off('click').on('click',function(){
              var duration = $("#pullup-prestage-input-duration input").val();
              var minpeople = $("#pullup-prestage-input-min-people input").val();

              if(!duration && !minpeople){
                $("#pullup .background").click();
                $("#write-gathering-input-prestage").val("");
                $("#write-gathering-input-prestage-duration").val("");
                $("#write-gathering-input-prestage-minpeople").val("");
              } else if (duration && minpeople){
                $("#pullup .background").click();
                $("#write-gathering-input-prestage").val(duration + "시간 전까지 " + minpeople + "명 이상 모이면 진행");
                $("#write-gathering-input-prestage-duration").val(duration);
                $("#write-gathering-input-prestage-minpeople").val(minpeople);
              } else {
                popup("모든 값을 정확히 입력해주세요.");
              }

            });

          });
      }
    });

    // Gathering Max People Num
    $("#write-gathering-input-maxpeople-fake").off('click').on('click',function(){
        pullupMenu("pullup_maxpeople",function(){
            var i = 4;
            while(i <= 50){
                $(".roller-max-people ul").append('<li class="button" data-maxpeople="' + i + '">' + i + '</li>');
                i += 1;
            }

            // Maxnumpeople Event Handler
            $("#pullup-maxpeople-input-fake input").off('click').on('click',function(){
                $("#pullup-maxpeople-input-fake .roller").css({"display":"block"});

                $("#pullup-maxpeople-input-fake li").off('click').on('click',function(){
                  $("#pullup-maxpeople-input-fake input").val($(this).data("maxpeople"));
                  $("#pullup-maxpeople-input-fake .roller").css({"display":"none"});
                });
            });

            // Maxnumpeople Submit
            $("#pullup-maxpeople-submit").off('click').on('click',function(){
              var maxpeople = $("#pullup-maxpeople-input-fake input").val();
              if( !maxpeople ){
                  $("#pullup .background").click();
                  $("#write-gathering-input-maxpeople-fake").val("");
                  $("#write-gathering-input-maxpeople").val("");
              } else {
                  $("#pullup .background").click();
                  $("#write-gathering-input-maxpeople-fake").val(maxpeople + "명 까지만 참여 가능");
                  $("#write-gathering-input-maxpeople").val(maxpeople);
              }
            });
        });
    });

    $("#write-gathering-input-maxpeople").off('change').on('change',function(){
      if($(this).val() == ""){
        $("#write-gathering-input-maxpeople-has").val(false);
      }else{
        $("#write-gathering-input-maxpeople-has").val(true);
      }
    })

    // Gathering edit
    if ( $('#write-gathering-input-time-fake').data("edit") == "yes" ) {
        $('#write-gathering-input-time-fake').css("opacity", "0.4");
    }
    if ( $('#write-gathering-input-prestage').data("edit") == "yes" ) {
        $('#write-gathering-input-prestage').css("opacity", "0.4");
    }

    // Gathering Submit
    $('form.gathering_write').off('submit').on('submit', function(event){
        event.preventDefault();
        $("#pullup-write").show();

        var url = $(this).attr('action');
        api.post(url, $(this).serialize(), function(res){
            if (res['ok']){
                var gid = res['gid'].toString();
                initiator('/gathering_detail?gid=' + gid, false);
                $("#pullup-write").hide();

                if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                    logCompletedTutorialEvent("write_gath", true);
                }
            } else {
                $("#pullup-write").hide();
                popup('필수 항목들에 내용을 채워주세요.');
                // 안 채운 부분들 중 가장 먼저있는 곳으로 focus
            }
        });
    });

    /* Write Posting */

    var woottagArray = []; // Post this array to server-side
    var woottagMaxLength;
    var woottagMaxNumber;

    var woottag = {

      init : function( maxLength, maxNumber ){

        // Configuration
        woottagMaxLength = maxLength || 10;
        woottagMaxNumber = maxNumber || 10;

        $("#woot-tag-wrapper").click(function(){
          $("#woot-tag-input").focus();
        });

        // Space-add Event Handler
        $("#woot-tag-input").bind("input",function(){
          let str = $(this).val();
          if( str.indexOf(" ") == -1 && str.length > woottagMaxLength ){
            $(this).val(str.slice( 0, woottagMaxLength ));
            woottag.errorHandler.maxLengthExceed();
          }

          if(str.indexOf(" ") != -1){
            str = str.replace(" ","");
            woottag.createTag(str);
            $(this).val("");
          }
        });

        // Click-add Event Handler
        $("#woot-tag-recommendation").find(".woot-tag").click(function(){
          let str = $(this).text().replace(/\s/g,"").replace("#","");
          woottag.createTag(str);
        });

        // Already Exist Tag (for posting_edit)

        if($("#woot-tag-wrapper").find("input[type='hidden']").val()){
          var alreadyTags = $("#woot-tag-wrapper").find("input[type='hidden']").val();
          woottagArray = alreadyTags.split(" ");
          $.each(woottagArray.slice().reverse(),function(index, value){
              var reverseIndex = parseInt(woottagArray.length -1 - index);
              $("#woot-tag-wrapper ul").prepend("<li class='woot-tag' data-index='" + reverseIndex + "'>" + value + "<i class='ion-android-close'></i></li>");
          });
        }
      },

      createTag : function(str){
        let duplicate   = ( woottagArray.indexOf("#" + str) > -1 );
        let empty     = ( str == "" );

        // Create Tag
        if( !duplicate && !empty ) {
          if( woottagArray.length == woottagMaxNumber ){
            woottag.errorHandler.maxNumberExceed();
          } else {
            woottagArray.push("#" + str);
            $("#woot-tag-wrapper").find(".woot-tag").remove();
            $.each(woottagArray.slice().reverse(),function(index, value){
              var reverseIndex = parseInt(woottagArray.length -1 - index);
              $("#woot-tag-wrapper ul").prepend("<li class='woot-tag' data-index='" + reverseIndex + "'>" + value + "<i class='ion-android-close'></i></li>");
            });

            $("#woot-tag-wrapper").find("input[type='hidden']").val(String(woottagArray).replace(/,/g," "));

            var deleteHandler = function(){
              $("#woot-tag-wrapper").find(".woot-tag").off("click").on("click",function(){
                woottagArray.splice($(this).data("index"),1);
                $("#woot-tag-wrapper").find(".woot-tag").remove();
                $.each(woottagArray.slice().reverse(),function(index, value){
                  var reverseIndex = parseInt(woottagArray.length -1 - index);
                  $("#woot-tag-wrapper ul").prepend("<li class='woot-tag' data-index='" + reverseIndex + "'>" + value + "<i class='ion-android-close'></i></li>");
                });
                $("#woot-tag-wrapper").find("input[type='hidden']").val(String(woottagArray).replace(/,/g," "));

                return deleteHandler();
              });
            }
            deleteHandler();
          }
        }
      },

      errorHandler : {

        /* When length of tag is exceeded maximum length */
        maxLengthExceed : function(){
          console.log("Maximum tag length exceeded");
          popup("태그 길이는 최대 20자까지만 가능합니다.");
        },

        /* When count of tags is exceeded maximum number */
        maxNumberExceed : function(){
          console.log("Maximum tag number exceeded");
          popup("태그는 최대 5개까지만 쓸 수 있습니다.");
        }
      }
    }
    woottag.init(20, 5);

    // Board Select
    $("#write-posting-input-topic-fake").off('click').on('click',function(){
      pullupMenu("pullup_write_posting_category",function(){
        $(".board-select").off('click').on('click',function(){
          $("#pullup .background").click();
          var code = $(this).data("code");

          $("#write-posting-input-topic-fake").val($(this).find("span").text());
          $("#write-posting-input-topic").val(code);

          api.get("/get_recommended_tags/" + code + "/",function(res){
              var recommendTagArray = res;
              $("#woot-tag-recommendation").find("ul").html("");
              $.each(recommendTagArray, function(index,value){
                  $("#woot-tag-recommendation").find("ul").append("<li class='woot-tag'>#" + value + "</li>");
              });
              // Click-add Event Handler
              $("#woot-tag-recommendation").find(".woot-tag").click(function(){
                let str = $(this).text().replace(/\s/g,"").replace("#","");
                woottag.createTag(str);
              });
          });
          anime({
            targets: '#write-posting-input-topic-fake',
            opacity:0.3,
            duration: 300,
            easing: 'linear',
            direction: 'alternate'
          });
        // 주변 블록 공개 옵션: renderTemplate(serverParentURL + "/write/posting.addon?bid=" + bid, "#write-section-addon");

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

          $("#write-section-item-photo-preview-" + inputOrder)
          .addClass("selected")
          .append("<span class='item-delete ion-close-circled button' onclick='imageElementDelete(this," + inputOrder + ")' data-image='" + imageID + "'></span><img src='" + dataURL + "'/>");

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
    $('form#write-posting-form').submit(function(event){
      event.preventDefault();
      $("#pullup-write").show();

      $('form#write-posting-form input[name="img"]').each(function(){
        if($(this).val() == ""){
          $(this).remove();
        }
      });

      var url = $(this).attr("action");
      var data = new FormData(this);

      api.postMulti(url, data, function(response){
          if (response['ok']){
              var pid = response['pid'].toString();
              initiator('/post_detail?pid=' + pid, false);
              $("#pullup-write").hide();

              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                  logCompletedTutorialEvent("write_post", true);
              }
          } else {
              $("#pullup-write").hide();
              popup('필수 항목들에 내용을 채워주세요.');
              // 안 채운 부분들 중 가장 먼저있는 곳으로 focus
          }
      });
    });

    /*
    $("#write-posting-submit").off('click').on('click',function(){
      var inputs = [
                      {"id":"topic","require":true},
                      {"id":"title","require":true},
                      {"id":"content","require":true},
                      {"id":"file-1","require":false},
                      {"id":"file-2","require":false},
                      {"id":"file-3","require":false},
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
        api.post("/post_write/",formData,function(res){
          return document.location.replace("/post_detail/?pid=" + res.pid);
        });

      }

    });
    */

    return;
  },

  /* People Ctrl */
  accountMoreCtrl : function(){
    var userdata = JSON.parse($("#hiddenInput_userdata").val() || null);
    $("#header .header-center").text(userdata.block + " 블록 웃님들");

    // Interest
    $(".interest-array").each(function(){
        if($(this).val()){
            var interestArray = JSON.parse($(this).val());
            var appendHtml = $(this).parent();
            $.each(interestArray, function(index,value){
                appendHtml.append("<span>" + value + "</span>");
            });
        }
    });
    $("#people-filtering").off('click').on('click',function(){
      if ( $(this).hasClass('filtered') ) {
        // cancel filter
        var num_area_people = parseInt( $(this).data('num_area_people') );
        $('#filter-count').text(num_area_people);

        $($(this)).removeClass("filtered").find("span").text("관심사 필터");

        $(".people-section-all .people-item").each(function(index,value){
            $(this).css( {"display":"block"} );
        });

      } else {
          // add filter
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
                $("#pullup .background").click();
                var filteredCount = 0;
                $(".people-section-all .people-item").each(function(index,value){

                $(this).css({"display":"block"});

                if(interestArray.length > 0){

                  var personInterestArray = JSON.parse(JSON.stringify($(this).find(".interest").data("interestarray")));

                  var personInterestArrayPure = [];
                  $.each(personInterestArray, function(index, value){
                    personInterestArrayPure.push(value.split(":")[0]);
                  });

                  var andChecker = true;
                  $.each(interestArray,function(index, value){
                    if(personInterestArrayPure.indexOf(value) == -1){
                      andChecker = false;
                    }
                  });

                  if(!andChecker){
                    $(this).css({"display":"none"});
                  }else{
                    filteredCount += 1;
                  }
                }

              });
              $("#people-filtering").addClass("filtered").find("span").text("필터 취소");
              $('#filter-count').text(filteredCount);

            });
          });
      }

    });


    return;
  },


  /* Profile Ctrl */
  profileCtrl : function(){
    // Current Profile User Data
    var profiledata = JSON.parse($("#hiddenInput_currentpagedata").val() || null);

    var udata = JSON.parse($("#hiddenInput_userdata").val() || null);
    var points_left = parseInt(udata.points_earned) - parseInt(udata.points_used);

    // Interest
    $(".interest-array").each(function(){
        if($(this).val()){
            var interestArray = JSON.parse($(this).val());
            var appendHtml = $(this).parent();
            $.each(interestArray, function(index,value){
                appendHtml.append("<span>" + value + "</span>");
            });
        }
    });

    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });

    if($("#profile-section-history").length){
      // $(".badge-discover-contents").show();
      $(".posting-wrapper").show();
      $(".people-contents").hide();
    }

    // History Tab
    $(".profile-section-statistics-tab").off('click').on('click',function(){
      var tab = $(this).data("tab");

      /*
      if(tab == "badge"){
        $(".profile-section-statistics-tab").removeClass("selected");
        $(this).addClass("selected");

        $(".badge-discover-contents").show();
        $(".posting-wrapper").hide();
        $(".people-contents").hide();

        // renderTemplate(serverParentURL + "/people/profile.badge?uid=" + profiledata.uid,"#profile-section-history");
      */
      if(tab == "posting"){
        $(".profile-section-statistics-tab").removeClass("selected");
        $(this).addClass("selected");
        // $(".badge-discover-contents").hide();
        $(".posting-wrapper").show();
        $(".people-contents").hide();

        // renderTemplate(serverParentURL + "/people/profile.posting?uid=" + profiledata.uid,"#profile-section-history");

      } else if(tab == "woot"){
        $(".profile-section-statistics-tab").removeClass("selected");
        $(this).addClass("selected");
        // $(".badge-discover-contents").hide();
        $(".posting-wrapper").hide();
        $(".people-contents").show();

        // renderTemplate(serverParentURL + "/people/profile.woot?uid=" + profiledata.uid,"#profile-section-history");
      }

    });

    // Points count
    $(".profile-button-points .points").text(points_left);

    // Points guide
    $(".profile-button-points").off("click").on("click", function(){
        pullupGuideTemplate("pullup_guide_point");
    });

    // Profile Buttons Like
    $(".profile-button-like").off('click').on('click',function(){
      var $this = $(this);
      var targetUid = $this.data("uid");
      var action = $this.data("action");

      if($(this).hasClass("liked")){
        popup("우트를 취소하시겠습니까? 우트를 취소해도 상대방에게는 알람이 가지 않으니 괜찮아요.", function() {
          api.post("/account/woot/",{id:targetUid, action:action},function(res){
            if(res['ok']){
              $this.removeClass("liked");
              $this.data("action", "woot");
              $this.find('.profile-button-icon').css("background-image", "url('http://www.hellowoot.co.kr/static/asset/images/profile/func_woot_off.png')");

              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                  logCompletedTutorialEvent("like_woot", false);
              }
            }
          });
        });
      } else {
        popup("웃님에게 우트하시겠습니까? 무분별한 우트하기는 제재의 대상이 됩니다.", function() {
          api.post("/account/woot/",{id:targetUid, action:action},function(res){
            if(res['ok']){
              $this.addClass("liked");
              $this.data('action', 'unwoot');
              $this.find('.profile-button-icon').css("background-image", "url('http://www.hellowoot.co.kr/static/asset/images/profile/func_woot_on.png')");

              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                  logCompletedTutorialEvent("like_woot", true);
              }
            }
          });
        });
      }
    });

    // Profile Buttons Report
    $(".profile-button-report").off('click').on('click',function(){
      var button = $(this);
      var targetUid = $(this).data("uid");
      var action = $(this).data("action");
      var data = {id:targetUid, action:action};
      pullupMenu('pullup_profile_report?uid=' + targetUid,function(){
        if ( button.hasClass("banned") ) {
            $(".profile-report-block").text("해당 이웃 차단 해제");
            $(".profile-report-report").text("해당 이웃 신고 하기");
        }

        $(".profile-report-block").off('click').on('click',function(){
          if ( button.hasClass("banned") ) {
              var next_action = "ban";
              button.data("action", next_action);
              button.removeClass("banned");
              button.find('.profile-button-icon').css("background-image", "url('http://www.hellowoot.co.kr/static/asset/images/profile/func_freeze_off.png')");
              button.find('span').text("얼음");

              api.post("/account/ban/", data, function(){
                  popup("해당 유저를 차단 해제했습니다.\n앞으로 서로의 게더링, 게시물을 볼 수 있습니다.");
              });
              $("#pullup .background").click();

              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                  logCompletedTutorialEvent("ban", false);
              }

          } else {
              var next_action = "unban";
              button.data("action", next_action);
              button.addClass("banned");
              button.find('.profile-button-icon').css("background-image", "url('http://www.hellowoot.co.kr/static/asset/images/profile/func_freeze_on.png')");
              button.find('span').text("땡");

              api.post("/account/ban/", data, function(){
                  popup("해당 유저를 차단했습니다.\n앞으로 서로의 게더링, 게시물은 보이지 않습니다.");
              });
              $("#pullup .background").click();

              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                  logCompletedTutorialEvent("ban", true);
              }
          }
        });
        $(".profile-report-report").off('click').on('click',function(){
           initiator("/support/suggest", true);
           $("#pullup").css({"display":"none"});
           $("#template-view").css({"overflow":""});
           $("body").css({"overflow":""});
        });

      });
    });
    return;
  },

  // profileCtrl
  profileEditCtrl : function(){
    var udata = JSON.parse($("#hiddenInput_userdata").val());
    var editdata = JSON.parse($("#hiddenInput_editdata").val());

    $("#profile-edit-input-description").height(1).height( $("#profile-edit-input-description").prop('scrollHeight') - 16 );
    $("textarea").on('focus keydown keyup', function () {
      $(this).height(1).height( $(this).prop('scrollHeight') -16 );
    });

    // displaying app update
    var iOS = !!navigator.platform && /iPhone|iPad|iPod/i.test(navigator.platform);
    if ( iOS ) {
       $("#profile-edit-update-ios").show();
       $("#profile-edit-update-and").hide();
    } else {
       $("#profile-edit-update-ios").hide();
       $("#profile-edit-update-and").show();
    }

    // iOS: blur keyboard by clicking outside area
    $(".profile-contents").off("click").on("click", function(){
        $("input").blur();
        $("textarea").blur();
    });
    $("input").off("click").on("click", function(event){
      event.stopPropagation();
    });
    $("textarea").off("click").on("click", function(event){
      event.stopPropagation();
    });

    $("#profile-avatar-change-button").off('click').on('click',function(){
        pullupMenu("pullup_edit_avatar",function(){
            $(".profile-avatar-wrapper").hide();
            $(".profile-avatar-wrapper-1").show();

            $(".overlap-close").off('click').on('click',function(){
                $("#profile-avatar-template").css({"display":"none"}).html("");
                $("#pullup .background").trigger("click");
            });
            $("#profile-edit-avatar-submit").off('click').on('click',function(){
                var imageUrl = $(".item-selected .avatar-item").css("background-image");
                var imageFirstNum = imageUrl.split("-")[0][imageUrl.split("-")[0].length - 1];
                var imageSecondNum = imageUrl.split("-")[1].split(".")[0];
                $("#profile-avatar").css({"background-image":imageUrl});
                $('input[name="profile_image_type"]').val(imageFirstNum + "-" + imageSecondNum);

                $("#profile-avatar-template").css({"display":"none"}).html("");
                $("#pullup .background").trigger("click");
            });

            $(".profile-avatar-type-list").off('click').on('click',function(){
                var tab = $(this).data("tab");

                $(".profile-avatar-type-list").removeClass("type-selected");
                $(this).addClass("type-selected");

                $(".profile-avatar-wrapper").hide();
                if (tab == 1) {
                    $(".profile-avatar-wrapper-1").show();
                } else if (tab == 2) {
                    $(".profile-avatar-wrapper-2").show();
                } else if (tab == 3) {
                    $(".profile-avatar-wrapper-3").show();
                } else {
                    $(".profile-avatar-wrapper-4").show();
                }
            });
            $(".profile-avatar-wrapper-item").off("click").on("click", function(){
                $(".profile-avatar-wrapper-item").removeClass("item-selected");
                $(this).addClass("item-selected");
                // input value
            });
        });
    });

    // Profile Edit Guide
    $("#profile-edit-guide-nick").css({"display":"none"});
    $("#profile-edit-guide-intro").css({"display":"none"});
    $("#profile-edit-guide-interest").css({"display":"none"});

    $('input[name="nick"]').focus(function(){
        $("#profile-edit-guide-nick").css({"display":"block"});
    });
    $('input[name="nick"]').blur(function(){
        $("#profile-edit-guide-nick").css({"display":"none"});
    });

    $('textarea[name="intro"]').focus(function(){
        $("#profile-edit-guide-intro").css({"display":"block"});
    });
    $('textarea[name="intro"]').blur(function(){
        $("#profile-edit-guide-intro").css({"display":"none"});
    });

    /* Profile Interest Edit */

    // show existing interests
    if($("#profile-edit-input-interest").val()){
        var alreadyInterest = JSON.parse($("#profile-edit-input-interest").val() || "[]");
        $.each(alreadyInterest,function(index,value){
           $("#profile-edit-input-interest-fake").append("<span>"+value+"</span>");
           $('#profile-edit-guide-interest').hide();
        });
    } else {
        $('#profile-edit-guide-interest').show();
    }

    $("#profile-edit-input-interest-fake").off('click').on('click',function(){
      pullupMenu("pullup_edit_interest",function(){
        var interestArray = JSON.parse($("#profile-edit-input-interest").val() || "[]");
        var interestArrayPure = [];
        var interestValue = "";

        // Push interest category to interestArrayPure
        $.each(interestArray, function(indx,val){
          interestArrayPure.push(val.split(":")[0]);
        });

        // addClass for the selected interests
        $(".pullup-interest-content").find(".interest").each(function(indx,val){
          if(interestArrayPure.indexOf($(this).data("interest")) > -1){
            $(this).addClass("selected");
          }
        });

        // click interest
        $(".pullup-interest-content").find(".interest").off('click').on('click',function(){
          if($(this).hasClass("selected")){

            $(this).removeClass("selected");

            // indexing the removed one
            interestValue = $(this).data("interest");
            var deletingIndex = interestArrayPure.indexOf(interestValue);

            // remove from array
            interestArray.splice(deletingIndex, 1);
            interestArrayPure.splice(deletingIndex, 1);

            // input for detail displayed none and blurred
            $(".pullup-interest-detail").css({"display":"none"});

          }else{

            if(interestArray.length > 4){
                popup("관심사는 최대 5개까지만 선택가능합니다.");
            }else{
                // add new one
                $(this).addClass("selected");
                interestValue = $(this).data("interest");
                interestArray.push(interestValue);
                interestArrayPure.push(interestValue);

                $(".pullup-interest-detail").css({"display":"block"});
                $(".pullup-interest-content").hide();
                $("#pullup-interest-detail-input").val("").attr("placeholder", interestValue + "에 대한 간단한 설명을 입력해주세요").focus();
            }

          }

          $("#profile-edit-input-interest").val(JSON.stringify(interestArray));
          $("#profile-edit-input-interest-fake").html("");
          $.each(interestArray,function(indx,val){
            $("#profile-edit-input-interest-fake").prepend("<span>" + val + "</span>");
          });

        });

        $("#pullup-interest-detail-submit").off('click').on('click',function(){

          var detail = $("#pullup-interest-detail-input").val();
          if(detail == ""){
            return;
          }

          // attach detail value as one string
          interestArray[interestArrayPure.indexOf(interestValue)] = interestValue + ":" + detail;

          $("#profile-edit-input-interest").val(JSON.stringify(interestArray));
          $("#profile-edit-input-interest-fake").html("");
          $.each(interestArray,function(indx,val){
            $("#profile-edit-input-interest-fake").prepend("<span>" + val + "</span>");
          });

          $("#pullup-interest-detail-input").val("");
          $(".pullup-interest-detail").css({"display":"none"});
          $(".pullup-interest-content").show();


        });

        // close button
        $('.close-interest').off('click').on('click', function(){
            $("#pullup .background").trigger('click');
        });

      }); // pullupMenu
    });

    $("#profile-edit-input-push-fake").change(function(){
      if($(this).is(":checked")){
        $("#profile-edit-input-push").val(true);
      }else{
        $("#profile-edit-input-push").val(false);
      }
    });

    $("#profile-edit-input-chat-push-fake").change(function(){
      if($(this).is(":checked")){
        $("#profile-edit-input-chat-push").val(true);
      }else{
        $("#profile-edit-input-chat-push").val(false);
      }
    });

    /* message will be added later
    $("#profile-edit-input-message-fake").change(function(){
      if($(this).is(":checked")){
        $("#profile-edit-input-message").val(true);
      }else{
        $("#profile-edit-input-message").val(false);
      }
    });

    */

    $("#profile-edit-submit").off('click').on('click',function(){
      if($("#profile-edit-input-avatar").val()      == "" ||
        $("#profile-edit-input-description").val()  == "" ||
        $("#profile-edit-input-interest").val()     == "" ||
        $("#profile-edit-input-interest").val()     == "[]" ){
        var elm = '<div id="popup-message">' +
                    '<span>모든 값을 정확히 입력해주세요.</span>' +
                  '</div>';
        $("body").append(elm);

        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);
        return;
      }

      var data = $("#profile-edit-form").serialize();
      var url = $("#profile-edit-form").attr('action');

      api.post(url,data,function(res){
          if(res['ok']) {
              if (editdata.initial == "yes") {
                  popup("프로필이 생성되었습니다. 우트에 오신걸 환영해요 :)");
                  initiator("/index", false);
              } else {
                  popup("프로필이 수정되었습니다.");
                  initiator("/account/profile?uid=" + udata.uid, false);
              }
          } else {
              popup('모든 내용들을 충실히 작성해주세요.');
          }
      });

    });

    if(typeof FirebasePlugin != 'undefined'){
        FirebasePlugin.getToken(function(token){
           $("#profile-edit-input-devicetoken").val(token);
        });
    }

    return;
  },

  passwordEditCtrl : function(){

      // iOS: blur keyboard by clicking outside area
      $(".profile-contents").off("click").on("click", function(){
          $("input").blur();
          $("textarea").blur();
      });
      $("input").off("click").on("click", function(event){
        event.stopPropagation();
      });
      $("textarea").off("click").on("click", function(event){
        event.stopPropagation();
      });

      $('[name="old_password"]')
        .attr("id", "profile-edit-password-input-current")
        .attr("placeholder", "기존 비밀번호를 입력해주세요");
      $('[name="new_password1"]')
        .attr("id", "profile-edit-password-input-new")
        .attr("placeholder", "8자 이상의 새로운 비밀번호를 입력해주세요");
      $('[name="new_password2"]')
        .attr("id", "profile-edit-password-input-new-confirm")
        .attr("placeholder", "새로운 비밀번호를 다시 한번 입력해주세요");

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
                    '<span>새로운 비밀번호가 일치하는지 확인해주세요.</span>' +
                  '</div>';
        $("body").append(elm);

        setTimeout(function(){
          $("#popup-message").remove();
        }, 5000);
        return;
      }

      var serializedData = $("#profile-edit-password-form").serialize();
      $.ajax({
            url       : serverParentURL + "/account/change_password/",
            type      : 'POST',
            data      : serializedData,
              headers   : {
                      'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
              },
              xhrFields : { withCredentials: true },
            success   : function( response ) {
                            var res = response;
                            if (res.errors) {
                                var elm = '<div id="popup-message">' +
                                            '<span>기존 비밀번호가 일치하는지 확인해주세요.</span>' +
                                          '</div>';
                                $("body").append(elm);

                                setTimeout(function(){
                                  $("#popup-message").remove();
                                }, 5000);
                                return;
                            }
                            if (res['ok']) {
                                popup("비밀번호가 정상적으로 변경되었습니다.");
                                initiator("/account/edit", false);
                            }
                        },
            error     : function( request, status, error ) {}
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

    var miscHandler = function(){
        // More button click event handler
        $(".content-more-button").off('click').on('click',function(){
          var postContentElm = $(this).parent();
          postContentElm.find(".content-showing").css({"display":"none"});
          postContentElm.find(".content-original").css({"display":"block"});
          $(this).remove();
        });

        var swiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination',
          },
        });

        $(".button-misc").off('click').on('click',function(){
            var pid = $(this).data("pid");
            var targetPost = $(this).closest("#posting-item-" + pid);

            // post edit, delete
            if ($(this).data("right") == "yes") {
                pullupMenu('pullup_post_edit?pid=' + pid, function(){

                    // post delete
                    $(".pullup-item-post-delete").off('click').on('click',function(e){
                        e.preventDefault();
                        popup("정말 삭제하시겠습니까?", function(){
                            api.get('/post_delete/' + pid + '/', function(){
                                $("#pullup .background").click();
                                targetPost.remove();
                            });
                        });
                    });

                    // post edit
                    $(".pullup-item-post-edit").off('click').on('click',function(e){
                        initiator("/write/posting/edit?pid=" + pid, true);
                        $("#pullup").css({"display":"none"});
                        $("#template-view").css({"overflow":""});
                        $("body").css({"overflow":""});
                    });

                });

            // post report
            } else {
                pullupMenu('pullup_post_report?pid=' + pid, function(){
                    $(".pullup-item.post-report").off("click").on("click",function(){
                         initiator("/report/post?pid=" + pid, true);
                         $("#pullup").css({"display":"none"});
                         $("#template-view").css({"overflow":""});
                         $("body").css({"overflow":""});
                    });
                });
            }
        });
    }
    miscHandler();

    // Post Edit

    // Post API: Like
    var likeHandler = function(){
      $(".button-like").off('click').on('click', button_like);
    }
    likeHandler();

    // Overlap
    var overlapHandler = function(){
      // Overlap : Comment
      $(".overlap-button-comment").off('click').on('click',function(){
        var pid = $(this).data("pid");

        $("#template-view").css({"overflow":"hidden"});
        $("body").css({"overflow":"hidden"});
        $("body").addClass("body-overlap-view");

        $("#posting-overlap-view").append('<div id="header" class="row">' +
                                            '<div class="header-left overlap-close button col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
                                              '<i class="ion-android-close"></i>' +
                                            '</div>' +
                                            '<div class="header-center block col-lg-16 col-md-16 col-sm-16 col-xs-16">' +
                                              '<span>댓글</span>' +
                                            '</div>' +
                                          '</div>');
        $("#posting-overlap-view").css({"display":"block"});
        $("#posting-overlap-view").addClass("activated");
        anime({
            targets: "#posting-overlap-view",
            translateX: '-100%',
            duration: 300,
            easing: 'easeInOutQuart'
        });

        renderTemplate(serverParentURL + "/comment/comment_list_iframe/post/" + pid, "#posting-overlap-view", function(){

          // iOS: blur keyboard by clicking outside area
          $(".board-detail-contents").off("click").on("click", function(){
              $("input").blur();
              $("textarea").blur();
          });
          $("input").off("click").on("click", function(event){
            event.stopPropagation();
          });
          $("textarea").off("click").on("click", function(event){
            event.stopPropagation();
          });

          // Close Event Handler
          $(".overlap-close").off('click').on('click',function(){
            anime({
              targets: "#posting-overlap-view",
              translateX: '100%',
              duration: 10
            });
            $("#posting-overlap-view").html("");
            $("#posting-overlap-view").removeClass("activated");
            $("#posting-overlap-view").css({"display":"none"});
            $("#template-view").css({"overflow":""});
            $("body").css({"overflow":"inherit"});
            $("body").removeClass("body-overlap-view");
          });

          var commentEventHandler = function(){
              // Post API: Comment - Default

              $("#footer-textarea").on('keydown keyup', function () {
                    $(this).height(1).height( $(this).prop('scrollHeight') );
              });

              $("#footer-textarea-submit").off('click').on('click',function(){
                  if ($("#footer-textarea").val()) {
                      var data = {
                            content : $("#footer-textarea").val(),
                            content_type : $('[name="content_type"]').val(),
                            content_id : $('[name="content_id"]').val()
                      };

                      api.post("/comment/write/",data,function(res){
                          if (res['ok']) {
                              $('.posting-item-comment').append($(res.html).find(".posting-comment-wrap"));
                              $('#footer-textarea').val("").css("height", "48px");
                              commentEventHandler();

                              var heightSum = 0;
                              $(".posting-comment-wrap").each(function(){heightSum = heightSum + $(this).height();});
                              $("#posting-overlap-view .board-contents").animate({ scrollTop: heightSum }, 400);

                              var comment_count = $('#posting-item-' + pid).find('.comment .count');
                              comment_count.text(parseInt(comment_count.text()) + 1);

                              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                                  logCompletedTutorialEvent("comment", true);
                              }
                          }
                      });
                  } else {
                      popup("내용을 입력해주세요.");
                  }
              });

              // Comment Edit Button
              /*
              $(".comment-edit-button").off('click').on('click',function(){
                var cid = $(this).closest(".posting-comment").data("cid");

                $(".posting-comment").removeClass("selected");
                $("#posting-comment-" + cid).addClass("selected");

                // renderTemplate(serverParentURL + "/comment/comment_list_iframe/post/" + cid,"#footer-input",function(){
                $(function(){
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
                      content : $("#footer-textarea").val(),
                      content_type : $('[name="content_type"]').val(),
                      content_id : $('[name="content_id"]').val()
                    };
                    // url for edit needed
                    api.post("/comment/write/",data,function(){
                      location.reload(true);
                    });

                  });

                });

              });
              */

              // Comment Delete Button
              $('.comment-delete-button').off('click').on('click',function(){
                  $this = $(this);

                  popup("정말 삭제하시겠습니까?", function(){
                      if($this.data('reply') == 'no') {
                          var cid = $this.closest(".posting-comment").data('cid');

                          api.get("/comment/delete/" + cid + '/', function(res){
                              console.log(res['msg']);
                              if(res['ok']){

                                  var count_delete = 0;
                                  var comment = $this.closest('.posting-comment-wrap');
                                  comment.find('.posting-comment').each(function(){
                                      if ( $(this).css("display") != "none" ) {
                                          count_delete += 1;
                                      }
                                  });
                                  var count_current = $('#posting-item-' + pid).find('.comment .count');
                                  count_current.text(parseInt(count_current.text()) - count_delete);

                                  comment.hide();
                              }
                          });

                      } else {
                          var rid = $this.closest(".posting-comment").data('rid')
                          api.get("/comment/replycomment_delete/" + rid + '/', function(res){
                              console.log(res['msg']);
                              if(res['ok']){
                                  var comment = $this.closest('.posting-comment');
                                  var count_current = $('#posting-item-' + pid).find('.comment .count');
                                  count_current.text(parseInt(count_current.text()) - 1);
                                  comment.hide();
                              }
                          });

                      }
                  });

              });

              // Comment Recomment Button
              $(".recomment-button").off('click').on('click',function(){
                var cid = $(this).closest(".posting-comment").data("cid");

                $(".posting-comment").removeClass("selected");
                $("#posting-comment-" + cid).addClass("selected");

                // renderTemplate(serverParentURL + "/comment/comment_list_iframe/post/" + cid,"#footer-input",function(){
                $(function() {
                  $("#footer-textarea").focus();
                  $("#footer-textarea").attr("placeholder", "답글 달기...");

                  $("#footer-textarea").on('keydown keyup', function () {
                    $(this).height(1).height( $(this).prop('scrollHeight') );
                  });

                  // Post API: Comment
                  $("#footer-textarea-submit").off('click').on('click',function(){
                      if ( $("#footer-textarea").val() ) {
                        var data = {
                          content : $("#footer-textarea").val(),
                          comment_id : cid,
                        };

                        api.post("/comment/replycomment_write/" + cid + '/', data,function(res){
                          if (res['ok']) {
                              $('#posting-comment-' + cid).closest('.posting-comment-wrap').append($(res.html));
                              $('#footer-textarea').val("");
                              $('#posting-comment-' + cid).removeClass("selected");
                              $("#footer-textarea").attr("placeholder", "댓글 달기...");
                              $('#footer-textarea').val("").css("height", "48px");
                              commentEventHandler();

                              var heightSum = $('.board-contents').height();
                              $("#template-view .board-contents").animate({ scrollTop: heightSum }, 400);

                              var comment_count = $('#posting-item-' + pid).find('.comment .count');
                              comment_count.text(parseInt(comment_count.text()) + 1);

                              if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                                logCompletedTutorialEvent("comment", true);
                              }
                          }
                        });
                    } else {
                        popup("내용을 입력해주세요.");
                    }

                  });

                });
              });
            }
            commentEventHandler();
        });

      });

      // Overlap : Like
      $(".overlap-button-like").off('click').on('click',function(){
        $("#template-view").css({"overflow":"hidden"});
        $("body").css({"overflow":"hidden"});
        $("body").addClass("body-overlap-view");

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
        $("#posting-overlap-view").addClass("activated");
        anime({
            targets: "#posting-overlap-view",
            translateX: '-100%',
            duration: 300,
            easing: 'easeInOutQuart'
        });
        renderTemplate(serverParentURL + "/post_users_liking/" + pid,"#posting-overlap-view",function(){

          // Event Handler
          $(".overlap-close").off('click').on('click',function(){
            anime({
              targets: "#posting-overlap-view",
              translateX: '100%',
              duration: 10
            });
            $("#posting-overlap-view").html("");
            $("#posting-overlap-view").css({"display":"none"});
            $("#posting-overlap-view").removeClass("activated");
            $("#template-view").css({"overflow":""});
            $("body").css({"overflow":"inherit"});
            $("body").removeClass("body-overlap-view");
          });

        });

      });
    }
    overlapHandler();

    // Infinite Scroll
    var infiniteScrollPage = 2;
    var infiniteScroll = function(){
      $("#template-view").unbind("scroll.board").bind("scroll.board",function() {
        var eventScroll = $("#posting-wrapper").height() - $("#template-view").height() + 150;

        if( eventScroll < $("#template-view").scrollTop() ){
          $(this).unbind("scroll.board");

          if($("#posting-wrapper").length > 0){
            $.ajax({
                    method    : "GET",
                    url       : serverParentURL + "/post_list/" + boarddata.topic_code + "?page=" + infiniteScrollPage,
                    xhrFields: {withCredentials: true},
                    success   : function( response ) {

                                if(response){
                                  $("#posting-wrapper").append($.parseHTML(response));
                                  $("woot-click").off('click').on('click',function(){
                                    initiator($(this).attr("href"), true);
                                  });
                                  overlapHandler();
                                  likeHandler();
                                  miscHandler();
                                  infiniteScrollPage += 1;
                                  infiniteScroll();
                                }

                              },
                    error     : function( request, status, error ) {}
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

    $("footer-")

    var pid = $('.button-misc').data("pid");

    // iOS: blur keyboard by clicking outside area
    $(".board-contents").off("click").on("click", function(){
        $("input").blur();
        $("textarea").blur();
    });
    $("input").off("click").on("click", function(event){
      event.stopPropagation();
    });
    $("textarea").off("click").on("click", function(event){
      event.stopPropagation();
    });

    $(".button-misc").off('click').on('click',function(){

    // post edit, delete
    if ($(this).data("right") == "yes") {
        pullupMenu('pullup_post_edit?pid=' + pid, function(){

            // post delete
            $(".pullup-item-post-delete").off('click').on('click',function(e){
                e.preventDefault();

                popup("정말 삭제하시겠습니까?", function(){
                    api.get('/post_delete/' + pid + '/', function(){
                        $("#pullup .background").click();
                        history.back();
                    });
                });
            });

            // post edit
            $(".pullup-item-post-edit").off('click').on('click',function(e){
                initiator("/write/posting/edit?pid=" + pid, true);
                $("#pullup").css({"display":"none"});
                $("#template-view").css({"overflow":""});
                $("body").css({"overflow":""});
            });

        });

        // post report
        } else {
            pullupMenu('pullup_post_report?pid=' + pid, function(){
                    $(".pullup-item.post-report").off("click").on("click",function(){
                         initiator("/report/post?pid=" + pid, true);
                         $("#pullup").css({"display":"none"});
                         $("#template-view").css({"overflow":""});
                         $("body").css({"overflow":""});
                    });
            });
        }
    });

    var boarddata = JSON.parse($("#hiddenInput_boarddata").val() || null);
    $("#header-title").text(boarddata.bname);


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
        $("#posting-overlap-view").addClass("activated");
        anime({
            targets: "#posting-overlap-view",
            translateX: '-100%',
            duration: 300,
            easing: 'easeInOutQuart'
        });
        renderTemplate(serverParentURL + "/post_users_liking/" + pid,"#posting-overlap-view",function(){

          // Event Handler
          $(".overlap-close").off('click').on('click',function(){
            anime({
              targets: "#posting-overlap-view",
              translateX: '100%',
              duration: 10
            });
            $("#posting-overlap-view").html("");
            $("#posting-overlap-view").css({"display":"none"});
            $("#posting-overlap-view").removeClass("activated");
            $("#template-view").css({"overflow":""});
            $("body").css({"overflow":"inherit"});
          });

        });

    });

    // Post API: Like
    $(".button-like").off('click').on('click', button_like);

    // Post API: Comment - Default
    var commentEventHandler = function() {
        // comment
        $("#footer-textarea-submit").off('click').on('click',function(){
          if ( $("#footer-textarea").val() ) {
              var data = {
                content : $("#footer-textarea").val(),
                content_type : $('[name="content_type"]').val(),
                content_id : $('[name="content_id"]').val()
              };
              api.post("/comment/write/",data,function(res){
                  if (res['ok']) {
                      $('.posting-item-comment').append($(res.html).find(".posting-comment-wrap"));
                      $('#footer-textarea').val("").css("height", "48px");
                      commentEventHandler();

                      $("#template-view").animate({ scrollTop: $('.board-contents').height() }, 400);

                      var comment_count = $('#posting-item-' + pid).find('.comment .count');
                      comment_count.text(parseInt(comment_count.text()) + 1);

                      if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                        logCompletedTutorialEvent("comment", true);
                      }
                  }
              });
          } else {
              popup("내용을 입력해주세요.");
          }

        });

        // Comment Edit Button
        /*
        $(".comment-edit-button").off('click').on('click',function(){
          var cid = $(this).closest(".posting-comment").data("cid");

          $(".posting-comment").removeClass("selected");
          $("#posting-comment-" + cid).addClass("selected");

          // renderTemplate(serverParentURL + "/footer-input/comment.edit?cid=" + cid,"#footer-input",function(){
          $(function() {
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
                  parentCid : cid,
                  content : $("#footer-textarea").val(),
                  content_type : $('[name="content_type"]').val(),
                  content_id : $('[name="content_id"]').val()
                };
                // url for edit needed
                api.post("/comment/write/",data,function(){
                  location.reload(true);
                });

            });

          });

        });
        */

        // Comment Recomment Button
        $(".recomment-button").off('click').on('click',function(){
          var cid = $(this).closest(".posting-comment").data("cid");

          $(".posting-comment").removeClass("selected");
          $("#posting-comment-" + cid).addClass("selected");

          // renderTemplate(serverParentURL + "/footer-input/comment.recomment?cid=" + cid,"#footer-input",function(){
          $(function() {
            $("#footer-textarea").focus();
            $("#footer-textarea").attr("placeholder", "답글 달기...");

            $("#footer-textarea").on('keydown keyup', function () {
              $(this).height(1).height( $(this).prop('scrollHeight') );
            });

            // Post API: Comment
            $("#footer-textarea-submit").off('click').on('click',function(){
                if ( $("#footer-textarea").val() ) {
                    var data = {
                      content : $("#footer-textarea").val(),
                      comment_id : cid
                    };

                    api.post("/comment/replycomment_write/" + cid + '/', data,function(res){
                      if (res['ok']) {
                          $('#posting-comment-' + cid).closest('.posting-comment-wrap').append($(res.html));
                          $('#footer-textarea').val("");
                          $('#posting-comment-' + cid).removeClass("selected");
                          $("#footer-textarea").attr("placeholder", "댓글 달기...");
                          $('#footer-textarea').val("").css("height", "48px");
                          commentEventHandler();

                          var heightSum = $('.board-contents').height();
                          $("#template-view .board-contents").animate({ scrollTop: heightSum }, 400);

                          var comment_count = $('#posting-item-' + pid).find('.comment .count');
                          comment_count.text(parseInt(comment_count.text()) + 1);

                          if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                            logCompletedTutorialEvent("comment", true);
                          }
                      }
                    });
              } else {
                  popup("내용을 입력해주세요.");
              }
            });
          });
        });

        // Comment Delete Button
        $('.comment-delete-button').off('click').on('click',function(){
            $this = $(this);

            popup("정말 삭제하시겠습니까?", function(){
                if($this.data('reply') == 'no') {
                    var cid = $this.closest(".posting-comment").data('cid');

                    api.get("/comment/delete/" + cid + '/', function(res){
                        console.log(res['msg']);
                        if(res['ok']){
                            var count_delete = 0;
                            var comment = $this.closest('.posting-comment-wrap');
                            comment.find('.posting-comment').each(function(){
                                if ( $(this).css("display") != "none" ) {
                                    count_delete += 1;
                                }
                            });
                            var count_current = $('#posting-item-' + pid).find('.comment .count');
                            count_current.text(parseInt(count_current.text()) - count_delete);

                            comment.hide();
                        }
                    });

                } else {
                    var rid = $this.closest(".posting-comment").data('rid')
                    api.get("/comment/replycomment_delete/" + rid + '/', function(res){
                        console.log(res['msg']);
                        if(res['ok']){
                            var comment = $this.closest('.posting-comment');
                            var count_current = $('#posting-item-' + pid).find('.comment .count');
                            count_current.text(parseInt(count_current.text()) - 1);
                            comment.hide();
                        }
                    });

                }
            });
        });
    }
    commentEventHandler();

    return;
  },


  gatheringListCtrl : function() {
    var udata = JSON.parse($("#hiddenInput_userdata").val() || null);
    var points_left = parseInt(udata.points_earned) - parseInt(udata.points_used);

    $(".gathering-item").off("click").on("click", function(){
        var item = $(this);
        var gid = item.data("id");

        if ( item.data("join") ) {
            if ( item.data("chaton") ) {
                initiator("/chat?gid=" + gid, true);
            } else {
                initiator("/gathering_detail?gid=" + gid, true);
            }
        } else {
            if ( points_left >= 3 ) {
                initiator("/gathering_detail?gid=" + gid, true);
            } else {
                popup("게더링에 참여하기 위해서는 포인트 3점을 모아야 해요.<br><br><span class='guide-point'>포인트 얻는 방법 확인 >></span>");
                $(".guide-point").off("click").on("click", function(){
                    $("#popup-message").hide();
                    pullupGuideTemplate("pullup_guide_point");
                });
            }
        }
    });

    $(".gathering-example").off("click").on("click",function(){
        pullupGuideTemplate("pullup_guide_gathering");
    });

    return;
  },

  /* Gathering Ctrl */
  gatheringDetailCtrl : function(){
    $("#footer").css({"display":"none"});

    var udata = JSON.parse($("#hiddenInput_userdata").val() || null);
    var points_left = parseInt(udata.points_earned) - parseInt(udata.points_used);

    // gathering sub-tabs
    /*
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
      */

    /* subtract the count of host */
    $("#gathering-stats-like").text(parseInt($("#gathering-stats-like").text() - 1));
    $("#gathering-stats-participate").text(parseInt($("#gathering-stats-participate").text() - 1));

    /* the required number of people */
    var gdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);
    var req_count = gdata.min_num_people - gdata.current_joining_people;
    $('.tobevalid-count').text(req_count);

    // gathering-member alert
    $('#gathering-stats-pre').off('click').on('click', function() {
       popup("게더링 최소 참석 인원이 만족되면 멤버를 확인할 수 있어요.")
    });

    $('#gathering-stats-nor').off('click').on('click', function(e){
      if ( $('#gathering-like-button').data('action') == "on" && $('#gathering-participate-button').data('action') == "on" ){
          popup("좋아요 또는 참석을 눌러야 멤버를 확인할 수 있어요.");
      } else {
          initiator($('#gathering-stats-nor').data('link'), true);
      }
    });

    /* block the access when not joining user enters into the chat when gathering finished */
    $('.button-participate-end').off('click').on('click', function(){
        if ($(this).data('action') == 'on') {
            popup('게더링에 참가하신 분들만 지난 채팅을 볼 수 있습니다.');
        }
    });


    // gathering like
    $(".button-like").off('click').on('click', button_like);

    // gathering join
    $('.button-participate').off('click').on('click', function(){
        var gid = $(this).data("gid");
        var action = $(this).data("action");
        var data = {'gid': gid, 'action': action};
        var button = $(this);
        var url = "/gathering_join/"
        var hdinput = $("#hiddenInput_gatheringdata");

        if (button.hasClass("joined")) { // Already Liked
          popup("정말 참여를 취소하시겠습니까? 사용한 포인트는 되돌려 받지 못해요.",function(){
              // cancel the joining
              api.post(url, data, function (res) {
                if(res['ok']) {
                  var next_action = "on";
                  button.data("action", next_action);
                  button.removeClass("joined");
                  button.html("<span>참여하기</span>")

                  // normal인 경우
                  var count_nor = parseInt($(".gathering-stats-participate").text());
                  $(".gathering-stats-participate").text(count_nor - 1);

                  // pre-stage인 경우
                  var count_pre = parseInt($(".tobevalid-count").text());
                  $(".tobevalid-count").text(count_pre + 1);

                  if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                      logCompletedTutorialEvent("join", false);
                  }

                  initiator("/gathering_list", true);
                }
              });
          });

        // joining
        } else {
          if (points_left >= 3) {
            if(hdinput.data('tochat') == 'pre') {
              popup("최소 진행 조건을 만족하면 채팅방 개설 알림을 보내드려요.<br>**채팅방이 열리기 전 참여하신 웃님에게는 포인트 3점이 면제됩니다.", function(){
                api.post(url, data, function (res) {
                  if(res['ok']) {
                    var next_action = "off";
                    button.data("action", next_action);
                    button.addClass("joined");
                    button.html("<span>참여취소</span>")

                    var count_pre = parseInt($(".tobevalid-count").text());
                    $(".tobevalid-count").text(count_pre - 1);

                    if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                        logCompletedTutorialEvent("join", true);
                    }

                    if( parseInt($(".tobevalid-count").text()) <= 0 ) {
                        initiator("/chat?gid=" + gid, false);
                    }
                  }
                });
              });
            } else {
              if ( parseInt(gdata.current_joining_people) >= parseInt(gdata.max_num_people) ) {
                  popup("현재로선 게더링 참석 인원이 마감되었습니다. 불참자가 발생할 시 참석이 가능합니다.")
              } else {
                  popup("게더링 채팅방으로 이동합니다. 참여에는 포인트 3점이 소모됩니다.", function(){
                    api.post(url, data, function (res) {
                      if(res['ok']) {
                        var next_action = "off";
                        button.data("action", next_action);
                        button.addClass("joined");
                        button.html("<span>참여취소</span>")

                        var count_nor = parseInt($("#gathering-stats-participate").text());
                        $("#gathering-stats-participate").text(count_nor + 1);

                        if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                            logCompletedTutorialEvent("join", true);
                        }

                        initiator("/chat?gid=" + gid, false);
                      }
                    });
                  });
              }
            }
          } else {
              popup("게더링에 참여하기 위해서는 포인트 3점을 모아야 해요.<br><br><span class='guide-point'>포인트 얻는 방법 확인 >></span>");
              $(".guide-point").off("click").on("click", function(){
                  $("#popup-message").hide();
                  pullupGuideTemplate("pullup_guide_point");
              });
          }
        }
    });

    // Gathering More Button Handler
    $("#header-gathering-more-button").off("click").on("click",function(){
      var gdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);
      var gid = gdata.gid;
      if(gdata.is_my == "true"){
          pullupMenu("pullup_gathering_edit?gid=" + gid, function(){
              $(".pullup-item.gathering-edit").off("click").on("click",function(){
                 initiator("/write/gathering/edit?gid=" + gid, true);
                 $("#pullup").css({"display":"none"});
                 $("#template-view").css({"overflow":""});
                 $("body").css({"overflow":""});
              });
              $(".pullup-item.gathering-delete").off("click").on("click",function(){

                    popup("해당 게더링을 정말 삭제하시겠습니까?",function(){
                         api.post("/gathering_delete/" + gid + "/", null, function(){
                             initiator("/gathering_list", false);
                             $("#pullup .background").click();
                         });
                    });

              });
          });
      }else{
          pullupMenu("pullup_gathering_report?gid=" + gid, function(){

              $(".pullup-item.gathering-report").off("click").on("click",function(){

                 initiator("/report/gathering?gid=" + gid, true);
                 $("#pullup").css({"display":"none"});
                 $("#template-view").css({"overflow":""});
                 $("body").css({"overflow":""});

              });

          });
      }
    });

    return;
  },

  /* Gathering Review Ctrl */
  gatheringReviewCtrl : function(){
    var gatheringdata = JSON.parse($("#hiddenInput_gatheringdata").val() || null);
    $("#chat-title").text(gatheringdata.gname);

    $("#footer").css({"display":"none"});
    return;
  },

  /* chatting */
  chatCtrl : function() {
    'use strict';

    // $('some element').on('some keyboard input submit event, last_chat_update);

    // refer to https: //github.com/firebase/friendlychat-web

    // scroll overlap error
    $("#template-view").css({'-webkit-overflow-scrolling': 'auto', 'overflow-y': 'hidden'});

    var chatConfig;
    var lastChatDataTime = "";
    var lastChatDataTimeInfiniteScroll = "";
    var infiniteScrollKey;
    var infiniteScrollEnd = false;

    var last_updated_time = null; // global variable
    var globalGid = ""; // global variable

    function last_chat_update() {
       var now = Date.now();
       if (last_updated_time && (now - 5*60*1000) < last_updated_time) {
             return;
       }

        $.ajax({
            method: "GET",
            url: serverParentURL + "/gathering_last_chat_update/" + globalGid,
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                last_updated_time = now;
            },
            error: function (request, status, error) {
                var elm = '<div id="chat-popup-message">' +
                    '<span>API 서버 연결 오류</span>' +
                    '</div>';
                $("body").append(elm);
                setTimeout(function () {
                    $("#chat-popup-message").remove();
                }, 5000);
            }
        });
    }

    function chatInit() {
        var pathParams = location.href.split("?")[1] || "";
        var pathParamsJson = {};

        if (pathParams != "") {
            var pathParamsArray = pathParams.split("&");
            $.each(pathParamsArray, function (index, value) {
                pathParamsJson[value.split("=")[0]] = value.split("=")[1];
            });
            pathParams = "?" + pathParams;
        }

        var gid = pathParamsJson["gid"];
        globalGid = pathParamsJson["gid"];

        var apiPathConfigInfo = serverParentURL + "/chat/gathering_config_info/";
        var apiPathInfo = serverParentURL + "/chat/gathering_info/";

        if (!gid) {
            var elm = '<div id="chat-popup-message">' +
                '<span>잘못된 접근</span>' +
                '</div>';
            $("body").append(elm);
            setTimeout(function () {
                $("#chat-popup-message").remove();
            }, 5000);
            return false;
        }

        setChatConfig(apiPathConfigInfo + "?gid=" + gid, function() {
            initFirebaseAuth();
            loadMessages();
            infiniteScroll();
        });

        refreshRoomInfo(apiPathInfo + "?gid=" + gid);

        $("#chat-header").addClass("with-subheader");
        $("#chat-subheader").css({
            "display": "block"
        });

        //============================================================
        // Event Handlers
        //------------------------------------------------------------

        $(".overlap-button").off('click').on('click', function () {
            $("#chat-room-overlap").css({
                "display": "block"
            });
            $("#chat-room-overlap-background").css({
                "display": "block"
            });

            anime({
                targets: "#chat-room-overlap",
                translateX: '-100%',
                duration: 500,
                easing: 'easeInOutQuart'
            });

            $("#chat-room-overlap-background").off('click').on('click', function () {
                anime({
                    targets: "#chat-room-overlap",
                    translateX: '100%',
                    duration: 300,
                    easing: 'easeInOutQuart',
                    complete: function () {
                        $("#chat-room-overlap").css({
                            "display": "none"
                        });
                        $("#chat-room-overlap-background").css({
                            "display": "none"
                        });
                    }
                });
            });

            refreshRoomInfo(apiPathInfo + "?gid=" + gid);
        }); // $(".overlap-button").on

    }

    // Enter room and
    function setChatConfig(url, customSuccess) {
        var promise = $.ajax({
            method      : "GET",
            url         : url,
            xhrFields   : { withCredentials: true },
            success     : function (response) {
                return response;
            },
            error       : function (request, status, error) {
                var elm =
                    '<div id="chat-popup-message">' +
                    '<span>API 서버 연결 오류</span>' +
                    '</div>';
                $("body").append(elm);
                setTimeout(function () {
                    $("#chat-popup-message").remove();
                }, 5000);
            }
        });

        promise.then(function (res) {
            chatConfig = res;
            customSuccess();
        });
    }

    // Refresh Room Infos
    function refreshRoomInfo(url) {
        var promise = $.ajax({
            method: "GET",
            url: url,
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                return response;
            },
            error: function (request, status, error) {
                var elm = '<div id="chat-popup-message">' +
                    '<span>API 서버 연결 오류</span>' +
                    '</div>';
                $("body").append(elm);
                setTimeout(function () {
                    $("#chat-popup-message").remove();
                }, 5000);
            }
        });
        promise.then(function (res) {
            var fields = res.fields;
            console.log(fields)
            $(".chat-title").text(fields.title);
            $(".chat-date").text(fields.datetime_kor);
            $(".chat-place").text(fields.address);

            $('.chat-room-overlap-section-sticker').css({"background-image": "url(" + fields.sticker_fullurl + ")"});

            $(".chat-room-overlap-section-participants").find(".title").text("참여자 " + fields.users_joining.length + "명");
            $(".participants-item-wrapper").html("");
            $.each(fields.users_joining,function(index, value){
                var participants_uid = fields.users_joining[index].user_id;
                var participants_username = fields.users_joining[index].nick;
                var participants_avatar = "'http://www.hellowoot.co.kr/static/asset/images/profile_images/" + fields.users_joining[index].profile_image_type + ".png'";
                $(".participants-item-wrapper").append('<woot-click href="/account/profile?uid=' + participants_uid + '"><div class="participants-item"><div class="avatar" style="background-image:url(' + participants_avatar + ');"></div><div class="username">' + participants_username + '</div></div></woot-click>');
            });

            $("woot-click").off("click").on("click", function(){
                $("#template-view").removeAttr("style");
                initiator($(this).attr("href"), true);
            });

            $(".history-back").off("click").on("click", function(){
                $("#template-view").removeAttr("style");
                history.back();
            });

            if(!chatConfig.is_chatting_on){
                $(".chat-footer-textarea-wrapper").css({"display":"none"});
                $(".chat-footer-textarea-wrapper-readonly").css({"display":"block"});
                $("#message-textarea-readolny").attr("placeholder","채팅이 종료된 게더링입니다.");

                $("#chat-room-button-wrapper").css({"display":"none"});
            }
        });
    }

    $('#chat-room-button-like').off('click').on('click', function(){
      var link = $(location).attr('href');
      var gid = link.split("=")[1];
      initiator("/gathering_detail?gid=" + gid, true);
    });

    $('#chat-room-button-cancel').off('click').on('click', function(){
      var link = $(location).attr('href');
      var gid = link.split("=")[1];
      var action = $(this).data("action");
      var data = {'gid': gid, 'action': action};
      var button = $(this);

      popup("참여를 취소하시겠습니까? 참여를 취소해도 포인트는 되돌려 받지 못해요.", function(){
          api.post("/gathering_join/", data, function (res) {
              if(res['ok']) {
                  initiator("/gathering_detail?gid=" + gid, false);
                  $("#template-view").removeAttr("style");
              } else {
                  popup("게더링 상세보기에서 참여를 취소해주세요.")
              }
          });
      });
    });

    function infiniteScroll() {
        $("#chat-room-scroll").unbind("scroll.chat")
            .bind("scroll.chat", function () {
                if (200 <= $("#chat-room-scroll").scrollTop()) {
                    return;
                }

                loadMessagesOnceInfiniteScroll(infiniteScrollKey, 12);

                $(this).unbind("scroll.chat");
                setTimeout(function () {
                    if (infiniteScrollEnd) {
                        $("#chat-room").css({
                            "padding-top": "80px"
                        });
                        var datatime = $($("#chat-room .chat-item")[0]).data("time");
                        $("#chat-room").prepend($.parseHTML(
                            '<div class="chat-item chat-item-notification-time">' +
                            '<div class="chat-notification">' +
                            '<span>' + trimDate(datatime)[0] + '</span>' +
                            '</div>' +
                            '</div>'));
                        return false;
                    } else {
                        return infiniteScroll();
                    }
                }, 1000);
            }); // bind
    }


    function signIn() {
        //firebase.auth().signInAnonymously();
        firebase.auth().signInWithEmailAndPassword(
            chatConfig.firebase.authEmail,
            chatConfig.firebase.authKey
        );
    }

    function signOut() {
        firebase.auth().signOut();
    }

    function initFirebaseAuth() {
        firebase.auth().onAuthStateChanged(authStateObserver);
    }

    // Returns true if a user is signed-in.
    function isUserSignedIn() {
        return !!firebase.auth().currentUser;
    }

    function trimDate(date) {
        var date = new Date(date);
        var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
        var weeklabel = date.getDay();
        var dateLocal = date.toLocaleString('ko-KR');

        var splited = dateLocal.split(" 오전 ");
        if (splited.length > 1) {
            splited[0] = splited[0] + " " + week[weeklabel];
            splited[1] = "오전 " + String(splited[1]).slice(0, -3);
            return splited;
        } else {
            splited = dateLocal.split(" 오후 ");
            splited[0] = splited[0] + " " + week[weeklabel];
            splited[1] = "오후 " + String(splited[1]).slice(0, -3);
            return splited;
        }
    }

    // Loads chat messages history and listens for upcoming ones.
    function loadMessages() {
        var callback = function (snap) {
            if (!infiniteScrollKey) {
                infiniteScrollKey = snap.key;
            }
            var data = snap.val();

            if (trimDate(data.time)[0] != trimDate(lastChatDataTime)[0]) {
                $(messageListElement).append(
                    $.parseHTML(
                        '<div class="chat-item chat-item-notification-time">' +
                        '<div class="chat-notification">' +
                        '<span>' + trimDate(data.time)[0] + '</span>' +
                        '</div>' +
                        '</div>'));
            }
            lastChatDataTime = data.time;
            displayMessage(
                snap.key, data.name, data.uid,
                data.text, data.avatarUrl,
                data.time, data.notification, data.imageUrl, true);
        };

        firebase.database().ref(chatConfig.firebase.instancePath)
            .limitToLast(12).on('child_added', callback);
        firebase.database().ref(chatConfig.firebase.instancePath)
            .limitToLast(12).on('child_changed', callback);
    }


    function loadMessagesOnceInfiniteScroll(keyFrom, count) {
        var callback = function (snap) {
            var array = snap.val();
            var divWrapper = "<div></div>";
            $.each(Object.keys(array), function (index, key) {
                var data = array[key];
                if (index == 0) {
                    if (infiniteScrollKey == key) {
                        infiniteScrollEnd = true;
                    }
                    infiniteScrollKey = key;
                }
                // Chat-notification : Time
                if (!lastChatDataTimeInfiniteScroll) {
                    lastChatDataTimeInfiniteScroll = $(".chat-item-notification-time:first-child").find("span").text();
                }
                $(".chat-item-notification-time:first-child").remove();
                if (trimDate(data.time)[0] != trimDate(lastChatDataTimeInfiniteScroll)[0]) {
                    $(divWrapper).append($.parseHTML('<div class="chat-item chat-item-notification-time">' +
                        '<div class="chat-notification">' +
                        '<span>' + trimDate(data.time)[0] + '</span>' +
                        '</div>' +
                        '</div>'));
                }
                lastChatDataTimeInfiniteScroll = data.time;
                divWrapper = $(divWrapper).append(
                    displayMessage(key, data.name, data.uid, data.text,
                        data.avatarUrl, data.time,
                        data.notification, data.imageUrl, false));
            }); // $.each ends

            $(messageListElement).prepend(divWrapper);
            setTimeout(function () {
                $(divWrapper).find("chat-item").add('visible');
            }, 1);
            setTimeout(function () {
                $("#chat-room-scroll").scrollTop($(divWrapper).height() - 150);
            }, 100);
        };
        firebase.database().ref(chatConfig.firebase.instancePath)
            .orderByKey().endAt(keyFrom).limitToLast(count).once('value').then(callback);
    }

    // Saves a new message on the Firebase DB.
    function saveMessage(messageText) {
        // TODO 8: Push a new message to Firebase.
        var time = new Date();
        var fields = chatConfig.profile.fields;
        return firebase.database().ref(chatConfig.firebase.instancePath).push({
            name: fields.nick || "noname",
            uid: fields.user_id,
            text: messageText,
            avatarUrl: fields.profile_image_url,
            time: String(time),
            notification: false
        }).catch(function (error) {
            console.error('Error writing new message to Firebase Database', error);
        });
    }

    // Saves a new message containing an image in Firebase.
    // This first saves the image in Firebase storage.
    function saveImageMessage(file) {
        var time = new Date();
        var fields = chatConfig.profile.fields;
        firebase.database().ref(chatConfig.firebase.instancePath).push({
            name: fields.nick || "noname",
            uid : fields.user_id,
            text: "이미지 업로드중..",
            avatarUrl   : fields.profile_image_url,
            time        : String(time),
            notification: false,
            imageUrl    : ""
        }).then(function (messageRef) {
            // 2 - Upload the image to Cloud Storage.
            var filePath = fields.user_id + '/' + messageRef.key + '/' + file.name;
            return firebase.storage().ref(filePath).put(file).then(function (fileSnapshot) {
                // 3 - Generate a public URL for the file.
                return fileSnapshot.ref.getDownloadURL().then((url) => {
                    // 4 - Update the chat message placeholder with the image's URL.
                    return messageRef.update({
                        text: "",
                        imageUrl: url,
                        storageUri: fileSnapshot.metadata.fullPath
                    });
                });
            });
        }).catch(function (error) {
            console.error('There was an error uploading a file to Cloud Storage:', error);
        });
    }

    // Saves the messaging device token to the datastore.
    function saveMessagingDeviceToken() {
        // TODO 10: Save the device token in the realtime datastore
    }

    // Requests permissions to show notifications.
    function requestNotificationsPermissions() {
        // TODO 11: Request permissions to send notifications.
    }

    // Triggered when a file is selected via the media picker.
    function onMediaFileSelected(event) {
        event.preventDefault();
        var file = event.target.files[0];

        // Clear the selection in the file picker input.
        imageFormElement.reset();

        // Check if the file is an image.
        if (!file.type.match('image.*')) {
            var data = {
                message: 'You can only share images',
                timeout: 2000
            };
            signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
            return;
        }
        // Check if the user is signed-in
        if (checkSignedInWithMessage()) {
            saveImageMessage(file);
        }
    }

    // Triggered when the send new message form is submitted.
    var onMessageFormSubmitBoolean = false;
    function onMessageFormSubmit(e) {
        e.preventDefault();
        onMessageFormSubmitBoolean = true;
        // Check that the user entered a message and is signed in.
        if (messageInputElement.value && checkSignedInWithMessage()) {
            saveMessage(messageInputElement.value).then(function () {
                // Clear message text field and re-enable the SEND button.
                resetMaterialTextfield(messageInputElement);
                toggleButton();
                last_chat_update();
                messageInputElement.style.height = "25px";
            });
        }
    }

    // Triggers when the auth state change for instance when the user signs-in or signs-out.
    function authStateObserver(user) {
        if (user) {} else {
            // Make users always signed in
            signIn();
        }
    }

    // Returns true if user is signed-in. Otherwise false and displays a message.
    function checkSignedInWithMessage() {
        // Return true if the user is signed in Firebase
        if (isUserSignedIn()) {
            return true;
        }

        // Display a message to the user using a Toast.
        var data = {
            message: 'You must sign-in first',
            timeout: 2000
        };
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return false;
    }

    // Resets the given MaterialTextField.
    function resetMaterialTextfield(element) {
        element.value = '';
        //element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
    }

    // Template for messages.

    var MESSAGE_TEMPLATE =
      '<div class="chat-item chat-item-message">' +
        '<div class="avatar"></div>' +
        '<div class="message">' +
          '<div class="message-info">' +
            '<span class="username"></span>' +
            '<span class="time"></span>' +
          '</div>' +
          '<div class="message-cloud">' +
            '<p></p>' +
            '<div class="message-image"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var NOTIFICATION_TEMPLATE =
      '<div class="chat-item chat-item-notification-time">' +
        '<div class="chat-notification">' +
          '<span></span>' +
        '</div>' +
      '</div>';


    // A loading image URL.
    var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';


    // Displays a Message in the UI.
    function displayMessage(key, username, uid, text, avatarUrl,
        time, notification, imageUrl, appendBool) {

        var div = document.getElementById(key);
        if (!div) { // Not Child_change
            var container = document.createElement('div');
            if (notification) {
                container.innerHTML = NOTIFICATION_TEMPLATE;
            } else {
                container.innerHTML = MESSAGE_TEMPLATE;
            }
            div = container.firstChild;
            div.setAttribute('id', key);
            if (appendBool) {
                $(messageListElement).append(div);
            }
        }

        // Set Username, Avatar, Time
        if (notification) {
            div.querySelector('.chat-notification span').textContent = text;
        } else {
            div.querySelector('.username').textContent = username;
            div.querySelector('.avatar').style.backgroundImage = 'url(' + avatarUrl + ')';
            div.querySelector('.time').textContent = trimDate(time)[1];
            div.setAttribute('data-time', time);

            // Add Message
            var messageElement = div.querySelector('.message-cloud p');
            var imageElement = div.querySelector('.message-cloud .message-image');
            if (text) { // If the message is text.
                messageElement.textContent = text;
                // Replace all line breaks by <br>.
                messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
            } else if (imageUrl) { // If the message is an image.
                var image = document.createElement('img');
                image.addEventListener('load', function () {
                    if (appendBool) {
                        $("#chat-room-scroll").scrollTop(messageListElement.scrollHeight);
                    }
                });
                image.src = imageUrl + '&' + new Date().getTime();
                $(messageElement).remove();
                imageElement.innerHTML = '';
                $(imageElement).append(image);
                $(imageElement).off('click').on('click', function () {
                    $("#chat-room-image").css({
                        "display": "block",
                        "background-image": "url('" + image.src + "')"
                    }).addClass("activated");
                    $("#chat-room-image .chat-room-image-close").off('click').on('click', function () {
                        $("#chat-room-image").css({
                            "display": "none"
                        }).removeClass("activated");
                    });
                });
            }

            if (uid == chatConfig.profile.fields.user_id) {
                $(div).addClass("chat-item-my");
            }

            if (onMessageFormSubmitBoolean){
                $(messageInputElement).focus();
                onMessageFormSubmitBoolean = false;
            }
        }

        // Show the card fading-in and scroll to view the new message.
        setTimeout(function () {
            div.classList.add('visible')
        }, 1);
        if (appendBool) {
            $("#chat-room-scroll").scrollTop(messageListElement.scrollHeight);
        }

        return div;
    }

    // Enables or disables the submit button depending on the values of the input
    // fields.
    function toggleButton() {
        if (messageInputElement.value) {
            submitButtonElement.removeAttribute('disabled');
        } else {
            submitButtonElement.setAttribute('disabled', 'true');
        }
    }

    // Checks that the Firebase SDK has been correctly setup and configured.
    function checkSetup() {
        if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
            window.alert('You have not configured and imported the Firebase SDK. ' +
                'Make sure you go through the codelab setup instructions and make ' +
                'sure you are running the codelab using `firebase serve`');
        }
    }

    // Checks that Firebase has been imported.
    checkSetup();

    // Shortcuts to DOM Elements.
    var messageListElement    = document.getElementById('chat-room');
    var messageFormElement    = document.getElementById('message-form');
    var messageInputElement   = document.getElementById('message-textarea');
    var submitButtonElement   = document.getElementById('message-submit');
    var imageButtonElement    = document.getElementById('submitImage');
    var imageFormElement      = document.getElementById('image-form');
    var mediaCaptureElement   = document.getElementById('mediaCapture');

    /*
    var userPicElement = document.getElementById('user-pic');
    var userNameElement = document.getElementById('user-name');
    var signInSnackbarElement = document.getElementById('must-signin-snackbar');

    // Saves message on form submit.
    */
    messageFormElement.addEventListener('submit', onMessageFormSubmit);
    messageInputElement.addEventListener('keyup', toggleButton);
    messageInputElement.addEventListener('change', toggleButton);

    // Events for image upload.
    imageButtonElement.addEventListener('click', function (e) {
        e.preventDefault();
        mediaCaptureElement.click();
    });
    mediaCaptureElement.addEventListener('change', onMediaFileSelected);

    chatInit();

    $("textarea").on('keydown keyup', function () {
        $(this).height(1).height($(this).prop('scrollHeight'));
    });

    $("#chat-room-scroll").off('click').on('click', function(){
        $("#message-textarea").blur();
    });

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
      }
      else{
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


  /* Report Ctrl */
  reportCtrl : function(){
    $(".report-category-item").off("click").on("click",function(){
        $(".report-category-item").removeClass("selected");
        $(this).addClass("selected");
        var reportCode = $(this).data("code");
        $("#report-code").val(reportCode);
    });

    // iOS: blur keyboard by clicking outside area
    $(".report-form-wrapper").off("click").on("click", function(){
        $("input").blur();
        $("textarea").blur();
    });
    $("input").off("click").on("click", function(event){
      event.stopPropagation();
    });
    $("textarea").off("click").on("click", function(event){
      event.stopPropagation();
    });


    $('form.report').off('submit').on('submit', function(event){
        event.preventDefault();
        var url = $(this).attr('action');
        api.post(url, $(this).serialize(), function(res){
            console.log(res);
            if (res['ok']){
                popup('신고가 정상적으로 접수되었습니다.');
                initiator("/index", false);

                if (plugin_toggle && typeof facebookConnectPlugin != "undefined") {
                    logCompletedTutorialEvent("report", true);
                }
            } else {
                popup("신고 유형을 선택하고 내용을 작성해주세요.");
            }
        });


    });
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
    // Dealing with CSRF token is a complicated issue
    // especially, when you have two domains at hand.
    //
    // https: //docs.djangoproject.com/en/2.1/ref/csrf/
    //   This document didn 't help.
    //
    // With xhrFields: { withCredentials: true }, the problem was solved
    // transparently.withCredentials means that crendential cookes are
    // kept.The exact mechanism should be figured out later!
    function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
      xhrFields: {
        withCredentials: true
      },
    });

  initiator();

  //============================================================
  // Cordova Plugin
  //------------------------------------------------------------
  document.addEventListener("deviceready",function(){

    // webview setCookie error solved by inject-cookie plugin & grantpermission for ios, status bar only for iOS
    if (device.platform == "iOS") {
      wkWebView.injectCookie('http://www.hellowoot.co.kr/');

      // grant alert permission
      window.FirebasePlugin.grantPermission();

      // hide accessory bar
      Keyboard.hideFormAccessoryBar(true);
    }

    FirebasePlugin.onNotificationOpen(function(data){
        console.log(data);
        console.log(data.url);
        if(data.tap){
          //Notification was received on device tray and tapped by the user.
          if(data.url){
            // url preprocessing
            var urlSplit = data.url.split("/");
            var urlType = urlSplit[1];
            var id = urlType.indexOf("account") > -1 ? urlSplit[3] : urlSplit[2];

            // post -> post_detail
            if ( urlType.indexOf("post") > -1 ) {
                initiator("/post_detail?pid=" + id, true);
                // history.pushState(null, null, document.location.pathname + '#');
            }
            // gathering (need to fix the condition of if statement through 'chatting_on')
            else if ( urlType.indexOf("gathering") > -1 ) {
                initiator("/gathering_detail?gid=" + id, true);
            }
            else if ( urlType.indexOf("chat") > -1 ) {
                initiator("/chat?gid=" + id, true);
            }
            // woot -> profile
            else if ( urlType.indexOf("account") > -1 ) {
                initiator("/account/profile?uid=" + id, true);
            }
            // approved
            else {
                console.log("approved");
            }
          }
        }else{
          console.log("foreground");
          //Notification was received in foreground. Maybe the user needs to be notified.
        }
    });

    // clear badge when deviceready
    FirebasePlugin.setBadgeNumber(0);

    // Cordova-plugin-screen-orientation : Orientation Lock
    screen.orientation.lock('portrait');

    // Cordova-plugin-cache-clear : Cache Clear
    window.CacheClear(function(){}, function(){});

    // Update Checker
    if(!getCookie("updateNotCheck")){
      $.ajax({
              method    : "GET",
              url       : serverParentURL + "/misc/updateHTML?currentVersioniOS=" + currentVersioniOS + "&currentVersionAnd=" + currentVersionAnd + "&platform=" + device.platform,
              xhrFields : {withCredentials: true},
              credentials: 'include',
              success   : function( response ) {
                          console.log(response);

                          if(response){
                            $("body").html("");
                            $("body").append(response);
                            console.log("need update");
                          }

                        },
              error     : function( request, status, error ) {

              }
      });
    }

    // Android Back Button Overwrite
    var exitApp = false, intval = setInterval(function (){exitApp = false;}, 1000);
    document.addEventListener("backbutton", function (e){
        e.preventDefault();
        if (exitApp) {
          clearInterval(intval)
          (navigator.app && navigator.app.exitApp()) || (device && device.exitApp())
        }else {
          if($("#posting-overlap-view").hasClass("activated")){
            $(".overlap-close").click();
          }else if($("#chat-room-image").hasClass("activated")){
            $(".chat-room-image-close").click();
          }else{
            exitApp = true
            navigator.app.backHistory();
          }
        }
    }, false);
  });

  // clear badge when resume
  document.addEventListener("resume", onResume, false);
  function onResume() {
      FirebasePlugin.setBadgeNumber(0);
  }

});

window.addEventListener('popstate', function(event) {
  initiator();
});
