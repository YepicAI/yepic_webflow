var audioElement = document.createElement('audio');
var audioState = "stopped";
var actualAudio = "";
var lastVoice = "";

$(".form-tab-voice-wrap").on("click",".form-voice-sample", function () {
      if (lastVoice != "" && lastVoice != $(this).attr("data-src")) {
            $('.form-voice-sample-child').each(function() {
                  $(this).removeClass("pause").addClass("play");
            });
            audioElement.pause();
            audioElement.currentTime = 0;
            audioState = "stopped";
      }
      lastVoice = $(this).attr("data-src");
      if (audioState == "stopped") {        
            actualAudio = $(this).children("div");
            actualAudio.removeClass("play").addClass("pause");
            audioElement.setAttribute('src', lastVoice);
            audioElement.play();
            audioState = "playing";
            audioElement.addEventListener('ended', function() {
                  actualAudio.removeClass("pause").addClass("play");
                  audioElement.currentTime = 0;
                  audioState = "stopped"
            });
      } else {
            $(this).children("div").removeClass("pause").addClass("play");
            audioElement.pause();
            audioElement.currentTime = 0;
            audioState = "stopped"
      }
});
