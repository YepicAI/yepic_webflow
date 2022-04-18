

var audioElement = document.createElement('audio');
var pauseSymbol = "url(https://assets-global.website-files.com/603a1632f3d4a6c0f66872b9/6080782b0edbdbe9c0e96234_pause.svg)";
var playSymbol = "url(https://assets-global.website-files.com/603a1632f3d4a6c0f66872b9/60815d642f83b515282a9b1b_play.svg)";

$(".form-tab-voice-wrap").on("click",".form-voice-sample", function () {
      
      console.log("asd");
      const formVoiceIcon = $(this).children("div").removeClass("play").addClass("pause");
      var audioSrc = $(this).attr("data-src");
      audioElement.setAttribute('src', audioSrc);
      audioElement.play()   
});
