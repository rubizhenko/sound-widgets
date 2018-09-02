var Widget = (function() {
  "use strict";

  var widgets = null;
  var currentWidget = 0;
  return {
    getAudioSrc: function getAudioSrc(widget, audioSelector) {
      return widget.querySelector(audioSelector).src;
    },
    getWidgetSounds: function getWidgetSounds(widgetIndex) {
      var currentWidget = widgets[widgetIndex];
      var audioSources = { back: "", start: "", main: "", end: "" };

      var back = this.getAudioSrc(currentWidget, ".js_audio-back");
      var start = this.getAudioSrc(currentWidget, ".js_audio-start");
      var main = this.getAudioSrc(currentWidget, ".js_audio-main");
      var end = this.getAudioSrc(currentWidget, ".js_audio-end");

      audioSources = { back: back, start: start, main: main, end: end };
      return audioSources;
    },
    stopBackSound: function stopBackSound(audioBack, showNextWidget) {
      var timer = setInterval(function() {
        audioBack.volume -= 0.1;
        if (audioBack.volume <= 0.3) {
          clearInterval(timer);
          audioBack.pause();
          audioBack.volume = 1;
          audioBack.currentTime = 0;
          showNextWidget();
        }
      }, 300);
    },
    playWidgetSounds: function playWidgetSounds(widget, widgetSounds) {
      var audioBack = widget.querySelector(".js_audio-back");
      var _this = this;
      audioBack.play();

      setTimeout(function() {
        _this.playSoundsQueue(
          [
            new Audio(widgetSounds.start),
            new Audio(widgetSounds.main),
            new Audio(widgetSounds.end)
          ],
          function() {
            _this.stopBackSound(audioBack, function() {
              currentWidget++;
              if (currentWidget < widgets.length) {
                _this.showWidget(currentWidget);
              }
            });
          }
        );
      }, 3000);
    },
    playSoundsQueue: function playSoundsQueue(sounds, stopBack) {
      var index = 0;
      var _this = this;
      function recursivePlay() {
        if (index === sounds.length - 1) {
          _this.playInOrder(sounds[index], function() {
            setTimeout(stopBack, 2000);
          });
        } else {
          _this.playInOrder(sounds[index], function() {
            index++;
            recursivePlay();
          });
        }
      }
      recursivePlay();
    },
    playInOrder: function playInOrder(audio, callback) {
      audio.play();
      if (callback) {
        audio.addEventListener("ended", callback);
      }
    },

    showWidget: function showWidget(widgetIndex) {
      for (var i = 0; i < widgets.length; i++) {
        var widget = widgets[i];
        if (i === widgetIndex) {
          widget.style.display = "block";
        } else {
          widget.style.display = "none";
        }
      }
      var widgetSounds = this.getWidgetSounds(widgetIndex);

      this.playWidgetSounds(widgets[widgetIndex], widgetSounds);
    },
    init: function init(widgetSelector) {
      widgets = document.querySelectorAll(widgetSelector);
      this.showWidget(currentWidget);
    }
  };
})();

Widget.init(".js_widget");
