/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var chatConfig;
var lastChatDataTime = "";
var lastChatDataTimeInfiniteScroll = "";
var infiniteScrollKey;

// Initiate
function chatInit() {

  var pathParams      = location.search.replace("?","") || "";
  var pathParamsJson  = {};

  if(pathParams != ""){

    var pathParamsArray = pathParams.split("&");

    $.each(pathParamsArray,function(index,value){

      pathParamsJson[value.split("=")[0]] = value.split("=")[1];

    });

    pathParams = "?" + pathParams;

  }

  //============================================================
  // Get Chat/Firebase Infos
  //------------------------------------------------------------

  var cid     = pathParamsJson["cid"];
  var apiPath = "http://127.0.0.1:8000/api/v1/get/chatInfo";

  if(!cid){

    var elm = '<div id="popup-message">' +
                '<span>잘못된 접근</span>' +
              '</div>';

    $("body").append(elm);

    setTimeout(function(){ 
      $("#popup-message").remove();
    }, 5000);

    return false;

  }else{

    var res;
    var promise = $.ajax({

            method    : "GET",
            url       : apiPath + "?cid=" + cid,
            xhrFields : {withCredentials: true},
            success   : function( response ) {
                        return response;
                      },
            error     : function( request, status, error ) {

                        var elm = '<div id="popup-message">' +
                                    '<span>API 서버 연결 오류</span>' +
                                  '</div>';

                        $("body").append(elm);

                        setTimeout(function(){ 
                          $("#popup-message").remove();
                        }, 5000);

                      }

    });

    promise.then(function(res){

      chatConfig = JSON.parse(res);
      $(".chat-title").text(chatConfig.room.title);
      $(".chat-date").text(chatConfig.room.date);
      $(".chat-place").text(chatConfig.room.place);
      $(".chat-description").append($.parseHTML(chatConfig.room.description));


      initFirebaseAuth();
      loadMessages();

    });

  }

  //============================================================
  // Infinite Scroll
  //------------------------------------------------------------
  
  var infiniteScroll = function(){

    $("#chat-room-scroll").unbind("scroll.chat").bind("scroll.chat",function() {

        if( 200 > $("#chat-room-scroll").scrollTop() ){

          loadMessagesOnceInfiniteScroll(infiniteScrollKey,12);
          $(this).unbind("scroll.chat");

          setTimeout(function(){ 
            return infiniteScroll();
          }, 1000);

        }

      });
    }

  infiniteScroll();

  //============================================================
  // Event Handlers
  //------------------------------------------------------------

  $(".history-back").off('click').on('click',function(){
    history.back(1);
    //window.shouldClose=true;
  });
  
  $(".overlap-button").off('click').on('click',function(){

    $("#chat-room-overlap").css({"display":"block"});
    $("#chat-room-overlap-background").css({"display":"block"});

    anime({
      targets: "#chat-room-overlap",
      translateX: '-100%',
      duration: 500,
      easing: 'easeInOutQuart'
    });

    $("#chat-room-overlap-background").off('click').on('click',function(){
      anime({
        targets: "#chat-room-overlap",
        translateX: '100%',
        duration: 300,
        easing: 'easeInOutQuart',
        complete: function(){
          $("#chat-room-overlap").css({"display":"none"});
          $("#chat-room-overlap-background").css({"display":"none"});
        }
      });
    });

    // Refresh Room Infos
    var res;
    var promise = $.ajax({

            method    : "GET",
            url       : apiPath + "?cid=" + cid,
            xhrFields : {withCredentials: true},
            success   : function( response ) {
                        return response;
                      },
            error     : function( request, status, error ) {

                        var elm = '<div id="popup-message">' +
                                    '<span>API 서버 연결 오류</span>' +
                                  '</div>';

                        $("body").append(elm);

                        setTimeout(function(){ 
                          $("#popup-message").remove();
                        }, 5000);

                      }

    });

    promise.then(function(res){

      var roomInfos = JSON.parse(res.room);
      $(".chat-title").text(roomInfos.title);
      $(".chat-date").text(roomInfos.date);
      $(".chat-place").text(roomInfos.place);
      $(".chat-description").html("").append($.parseHTML(roomInfos.description));

    });    

  });
  

}

// Signs-in Friendly Chat.
function signIn() {
  //firebase.auth().signInAnonymously();
  firebase.auth().signInWithEmailAndPassword(chatConfig.firebase.authEmail, chatConfig.firebase.authKey);
}

// Signs-out of Friendly Chat.
function signOut() {
  // TODO 2: Sign out of Firebase.
    firebase.auth().signOut();

}

// Initiate firebase auth.
function initFirebaseAuth() {
  // TODO 3: Initialize Firebase.
  firebase.auth().onAuthStateChanged(authStateObserver);
}


// Returns true if a user is signed-in.
function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
    return !!firebase.auth().currentUser;

}

function trimDate(date) {

  var date      = new Date(date);
  var week      = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
  var weeklabel = date.getDay();
  var dateLocal = date.toLocaleString('ko-KR');

  var splited = dateLocal.split(" 오전 ");
  if(splited.length > 1){
    splited[0] = splited[0] + " " + week[weeklabel];
    splited[1] = "오전 " + String(splited[1]).slice(0,-3);
    return splited;
  }else{
    splited = dateLocal.split(" 오후 ");
    splited[0] = splited[0] + " " + week[weeklabel];
    splited[1] = "오후 " + String(splited[1]).slice(0,-3);
    return splited;
  }

}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {

  // Loads the last 12 messages and listen for new ones.
  var callback = function(snap) {

    if (!infiniteScrollKey) {
      infiniteScrollKey = snap.key;
    }

    var data = snap.val();

    // Chat-notification : Time
    if(trimDate(data.time)[0] != trimDate(lastChatDataTime)[0]){
      $(messageListElement).append($.parseHTML('<div class="chat-item chat-item-notification-time">' +
                                                  '<div class="chat-notification">' +
                                                    '<span>' + trimDate(data.time)[0] + '</span>' +
                                                  '</div>' +
                                                '</div>'));
    }
    
    lastChatDataTime = data.time;

    displayMessage(snap.key, data.name, data.uid, data.text, data.avatarUrl, data.avatarColor, data.time, data.notification, data.imageUrl, true);

  };

  firebase.database().ref(chatConfig.firebase.instancePath).limitToLast(12).on('child_added', callback);
  firebase.database().ref(chatConfig.firebase.instancePath).limitToLast(12).on('child_changed', callback);

}


function loadMessagesOnceInfiniteScroll( keyFrom, count ) {

  var callback = function(snap) {

    var array = snap.val();
    var divWrapper = "<div></div>";

    $.each(Object.keys(array),function(index,key){

      var data = array[key];

      if(index == 0){
        infiniteScrollKey = key;
      }

      // Chat-notification : Time
      if(!lastChatDataTimeInfiniteScroll){
        lastChatDataTimeInfiniteScroll = $(".chat-item-notification-time:first-child").find("span").text();
      }
      $(".chat-item-notification-time:first-child").remove();
      if(trimDate(data.time)[0] != trimDate(lastChatDataTimeInfiniteScroll)[0]){
        $(divWrapper).append($.parseHTML('<div class="chat-item chat-item-notification-time">' +
                                            '<div class="chat-notification">' +
                                                '<span>' + trimDate(data.time)[0] + '</span>' +
                                            '</div>' +
                                          '</div>'));
      }

      lastChatDataTimeInfiniteScroll = data.time;

      divWrapper = $(divWrapper).append(displayMessage(key, data.name, data.uid, data.text, data.avatarUrl, data.avatarColor, data.time, data.notification, data.imageUrl, false));

    });
    
    $(messageListElement).prepend(divWrapper);

    setTimeout(function() {$(divWrapper).find("chat-item").add('visible')}, 1);
    setTimeout(function() {$("#chat-room-scroll").scrollTop($(divWrapper).height() - 150);}, 100);

  };

  firebase.database().ref(chatConfig.firebase.instancePath).orderByKey().endAt(keyFrom).limitToLast(count).once('value').then(callback);

}

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  // TODO 8: Push a new message to Firebase.

  var time = new Date();
  return firebase.database().ref(chatConfig.firebase.instancePath).push({

    name          : chatConfig.user.username,
    uid           : chatConfig.user.uid,
    text          : messageText,
    avatarUrl     : chatConfig.user.avatarUrl,
    avatarColor   : chatConfig.user.avatarColor,
    time          : String(time),
    notification  : false

  }).catch(function(error) {

    console.error('Error writing new message to Firebase Database', error);

  });

}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {

  var time = new Date();
  firebase.database().ref(chatConfig.firebase.instancePath).push({

    name          : chatConfig.user.username,
    uid           : chatConfig.user.uid,
    avatarUrl     : chatConfig.user.avatarUrl,
    avatarColor   : chatConfig.user.avatarColor,
    time          : String(time),
    notification  : false,
    imageUrl      : LOADING_IMAGE_URL

  }).then(function(messageRef) {
    // 2 - Upload the image to Cloud Storage.
    var filePath = chatConfig.user.uid + '/' + messageRef.key + '/' + file.name;
    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image's URL.
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath
        });

      });

    });

  }).catch(function(error) {
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
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    
  } else {

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

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Displays a Message in the UI.
function displayMessage(key, username, uid, text, avatarUrl, avatarColor, time, notification, imageUrl, appendBool) {

  var div = document.getElementById(key);
  
  if (!div) { // Not Child_change
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    if(appendBool){
      $(messageListElement).append(div);
    }
  }

  // Set Username, Avatar, Time
  div.querySelector('.username').textContent          = username;
  div.querySelector('.avatar').style.backgroundImage  = 'url(' + avatarUrl + ')';
  div.querySelector('.avatar').style.backgroundColor  = avatarColor;
  div.querySelector('.time').textContent              = trimDate(time)[1];

  // Add Message
  var messageElement = div.querySelector('.message-cloud p');
  var imageElement   = div.querySelector('.message-cloud .message-image');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      if(appendBool){
        $("#chat-room-scroll").scrollTop(messageListElement.scrollHeight);
      }
    });
    image.src = imageUrl + '&' + new Date().getTime();
    $(messageElement).remove();
    imageElement.innerHTML = '';
    $(imageElement).append(image);
  }

  if(uid == chatConfig.user.uid){
      $(div).addClass("chat-item-my");
      messageInputElement.focus();
  }

  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  if(appendBool){
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
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

chatInit();