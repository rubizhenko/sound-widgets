"use strict";

var queue = [];
var message = '<section class="js_widget"> <audio id="startMusic" src="sounds/start.mp3"></audio> <audio id="voiceMusic" src="sounds/main.mp3"></audio> <div class="container-fluid"> <div class="row text-center"> <div class="col-md-4 col-md-offset-4"><img src="img/source.gif"></div></div><div class="row text-center"> <div class="col-md-4 col-md-offset-4"> <p>{{name}}-{{amount}}грн</p></div><div class="row text-center"> <div class="col-md-4 col-md-offset-4"> <p>{{message}}</p></div></div></div></div></section><script>var startMusic=$("#startMusic").get(0);var voiceMusic=$("#voiceMusic").get(0);var playStartPromise=startMusic.play();if(playStartPromise!==undefined){playStartPromise.then(function(){console.log("startMusic без помилок");startMusic.onended=function(){console.log("Запуск озвучки");setTimeout(function(){playVoicePromise=voiceMusic.play();if(playVoicePromise!==undefined){playVoicePromise.then(function(){console.log("voiceMusic без помилок")}).catch(function(error){console.log("voiceMusic з помилками")})}},500)}}).catch(function(error){console.log("startMusic з помилками");playVoicePromise=voiceMusic.play();if(playVoicePromise!==undefined){playVoicePromise.then(function(){console.log("voiceMusic без помилок")}).catch(function(error){console.log("voiceMusic з помилками")})}})}</script>';


var controller = makeWidgetsQueue(queue);
var delay = 5000;
var _total = 0;
var fakeWebSocketMessage = setInterval(function () {
  queue.push("<span class=\"huge\">" + ++_total + "</span> " + message);
  controller.init();
}, 500);

function makeWidgetsQueue(queue) {
  var isNotExecuted = true;
  return {
    init: function init() {
      var _this = this;

      if (isNotExecuted && queue.length) {
        isNotExecuted = false;
        var firstWidget = queue[0];
        var canPlayCount = 0;
        $("body").append(firstWidget);

        var widget = $(".js_widget");
        var audioTags = widget.find("audio");
        audioTags.on("canplay", function () {
          canPlayCount++;
        });
        audioTags.on("ended", function () {
          canPlayCount--;
          if (canPlayCount) {
            _this.showNext();
          }
        });
      }
    },
    showNext: function showNext() {
      var _this2 = this;

      setTimeout(function () {
        queue.shift();
        isNotExecuted = true;
        $("body").empty();
        _this2.init();
      }, delay);
    }
  };
}