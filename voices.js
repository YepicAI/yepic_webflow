var audioElement = document.createElement('audio');
var audioState = "stopped"
var actualAudio = ""

$(".form-tab-voice-wrap").on("click",".form-voice-sample", function () {    
      if (audioState == "stopped") {
            console.log("stopped state");
            actualAudio = $(this).children("div");
            actualAudio.removeClass("play").addClass("pause");
            var audioSrc = $(this).attr("data-src");
            audioElement.setAttribute('src', audioSrc);
            audioElement.play();
            audioState = "playing";
            audioElement.addEventListener('ended', function() {
                  console.log("ended");
                  actualAudio.removeClass("pause").addClass("play");
                  audioElement.currentTime = 0;
                  audioState = "stopped"
            });
      } else {
            console.log("playing state");
            $(this).children("div").removeClass("pause").addClass("play");
            audioElement.pause();
            audioElement.currentTime = 0;
            audioState = "stopped"
      }
});

