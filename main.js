const Widget = (function() {
  "use strict";
  let widgets = null;
  let currentWidget = 0;
  return {
    getAudioSrc: function(widget, audioSelector) {
      return widget.querySelector(audioSelector).src;
    },
    getWidgetSounds: function(widgetIndex) {
      const currentWidget = widgets[widgetIndex];
      let audioSources = { back: "", start: "", main: "", end: "" };

      const back = this.getAudioSrc(currentWidget, ".js_audio-back");
      const start = this.getAudioSrc(currentWidget, ".js_audio-start");
      const main = this.getAudioSrc(currentWidget, ".js_audio-main");
      const end = this.getAudioSrc(currentWidget, ".js_audio-end");

      audioSources = { back, start, main, end };
      return audioSources;
    },
    stopBackSound: function(audioBack, showNextWidget) {
      let timer = setInterval(function() {
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
    playWidgetSounds: function(widget, widgetSounds) {
      const audioBack = widget.querySelector(".js_audio-back");
      const _this = this;
      audioBack.play();

      setTimeout(() => {
        _this.playSoundsQueue(
          [
            new Audio(widgetSounds.start),
            new Audio(widgetSounds.main),
            new Audio(widgetSounds.end)
          ],
          () => {
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
    playSoundsQueue: function(sounds, stopBack) {
      var index = 0;
      const _this = this;
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
    playInOrder: function(audio, callback) {
      audio.play();
      if (callback) {
        audio.addEventListener("ended", callback);
      }
    },

    showWidget: function(widgetIndex) {
      for (let i = 0; i < widgets.length; i++) {
        const widget = widgets[i];
        if (i === widgetIndex) {
          widget.style.display = "block";
        } else {
          widget.style.display = "none";
        }
      }
      const widgetSounds = this.getWidgetSounds(widgetIndex);

      this.playWidgetSounds(widgets[widgetIndex], widgetSounds);
    },
    init: function(widgetSelector) {
      widgets = document.querySelectorAll(widgetSelector);
      this.showWidget(currentWidget);
    }
  };
})();

Widget.init(".js_widget");
