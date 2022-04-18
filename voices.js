var audioElement = document.createElement('audio');
var audioState = "stopped"

$(".form-tab-voice-wrap").on("click",".form-voice-sample", function () {
      if (audioState == "stopped") {
            const formVoiceIcon = $(this).children("div").removeClass("play").addClass("pause");
            var audioSrc = $(this).attr("data-src");
            audioElement.setAttribute('src', audioSrc);
            audioElement.play();
            audioState = "playing";
            $('.form-voice-sample-child').each(function() {
                  $(this).removeClass("pause").addClass("play");
              });
      } else {
            audioElement.pause();
            audioElement.currentTime = 0;
            audioState = "stopped"
      }
});

audioElement.addEventListener('ended', function() {
      console.log("INSIDE ENDED");
      setListenButtonState("stopped");
      audioElement.currentTime = 0;
});
