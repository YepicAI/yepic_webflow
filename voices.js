

var audioElement = document.createElement('audio');

$(".form-tab-voice-wrap").on("click",".form-voice-sample", function () {
      console.log("asd");

      const formVoiceIcon = $(this).children("div");
      var audioSrc = $(this).attr("data-src");
      console.log(audioSrc);
      var pauseSymbol = "url(https://assets-global.website-files.com/603a1632f3d4a6c0f66872b9/6080782b0edbdbe9c0e96234_pause.svg)";
      var playSymbol = "url(https://assets-global.website-files.com/603a1632f3d4a6c0f66872b9/60815d642f83b515282a9b1b_play.svg)";
});
