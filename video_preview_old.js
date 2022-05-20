
var videoURL;
var urlParams = new URLSearchParams(window.location.search);
var recordID = urlParams.get('record_id');

if (urlParams.has('record_id')) {
  $.ajax({
   url: 'https://us-central1-speech2vid-api.cloudfunctions.net/fetchMemberV?recordID=' + recordID,
    type: 'GET',
    success: function (res) {
         
    	var video = document.getElementById('video');
      var sources = video.getElementsByTagName('source');
      sources[0].src = res.fields['url'];
      video.load();
      
    $('#video-title').html(res.fields['video_name'])
      
      $('#video-download').click(function() {
      	downloadVideo()
      });
    },
    error: function (err) {
    	if (err.status === 404) {
      	$('#video-title').html('Video not found')
      }
    },
  });
  

