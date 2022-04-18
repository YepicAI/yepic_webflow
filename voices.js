var audioElement = document.createElement('audio');
var audioState = "stopped"

$(".form-tab-voice-wrap").on("click",".form-voice-sample", function () {
      if (audioState == "stopped") {
            console.log("stopped state");
            const formVoiceIcon = $(this).children("div").removeClass("play").addClass("pause");
            var audioSrc = $(this).attr("data-src");
            audioElement.setAttribute('src', audioSrc);
            audioElement.play();
            audioState = "playing";
            audioElement.addEventListener('ended', function() {
                  $(this).removeClass("pause").addClass("play");
                  audioElement.currentTime = 0;
                  audioState = "stopped"
            });
      } else {
            console.log("playing state");
            $(this).removeClass("pause").addClass("play");
            audioElement.pause();
            audioElement.currentTime = 0;
            audioState = "stopped"
      }
});

