var audio_preview_state = '';

var video_request_model = {
    actor: 'Alex', // submit from create video page
    voice: '', // submit from create video page 
    voice_api_provider: '', // submit from create video page
    voice_provider: '', // submit from create video page
    script: '', // submit from create video page
    custom_audio_file: '', // if user submitted a custom audio upload
    audio_file: '', // backend generated - for gallery
    current_video_most_recent: '', // backend generated - for gallery
    audio_fea_link: '', // backend only
    avatar_type: 'full-body', // submit from create video page
    background_url: 'https://storage.googleapis.com/yepicai-backend.appspot.com/regularBackgrounds/office-background-FHD.png', // submit from create video page
    script_approval: '', // backend generated - for gallery
    create_video: '', // backend generated - for gallery
    watermarked: '', // backend generated - for gallery
    avatar_size: '', // submit from create video page
    avatar_position: 'centre', // submit from create video page
    avatar_circle_background: '', // submit from create video page
    avatar_circle_background_rim: '', // submit from create video page
    avatar_size_circle: '', // submit from create video page
    vm_status: '', // backend generated for debugging only
    memberstack_id: '', // taken from JWT token
    video_name: '', // submit from create video page
    unique_webpage: '', // backend generated - for gallery
    date_created: '', // backend generated - for gallery
    date_modified: '', // not used by frontend
    download_url: '', // backend generated - for gallery
    preview_image_url: '', // not currently used e.g. 'https://assets-global.website-files.com/603a1632f3d4a6c0f66872b9/6082b99fff1618b81cc1b433_khamal-p-500.png'
};

async function get_audio_preview(voice, voice_provider, voice_api_provider) {
    var url = 'https://app-vktictsuea-nw.a.run.app/tts_request';

    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'voice': voice, 'voice_provider':voice_provider, 'voice_api_provider':voice_api_provider }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + MemberStack.getToken(),
        },
    });

    var result = await response.json();

    console.log(result);
    //if (result.status !== 'success') return;
};

async function submit_video_request() {
    var url = 'https://app-vktictsuea-nw.a.run.app/video_request';

    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(video_request_model),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + MemberStack.getToken(),
        },
    });

    var result = await response.json();

    console.log(result);

    //if (result.status !== 'success') return;
};


window.addEventListener("load", async (e) => {
    audio_preview_button = document.getElementById('button-audio-preview');
    create_video_button = document.getElementById('button-create-video');


    // on preview click
    audio_preview_button.addEventListener("click", async (e) => {
        if (audio_preview_state !== '') return;

        var voice = '';
        var voice_provider = '';
        var voice_api_provider = '';

        await get_audio_preview(voice, voice_provider, voice_api_provider);
    });

    // on create video click
    create_video_button.addEventListener("click", async (e) => {
        await submit_video_request();
    });

    var actor_select_buttons = document.querySelectorAll('#actor-selection a[data-actor]');
    
    for (let i = 0; i < actor_select_buttons.length; i++) {
        actor_select_buttons[i].addEventListener("click", async (e) => {
            t = e.currentTarget;
            video_request_model.actor = t.getAttribute('data-actor');
        }); // ,true});
    }
    
    var voice_select_buttons = document.querySelectorAll('div[data-voice][data-voice-provider][data-voice-api-provider].form-voice');

    for (let i = 0; i < voice_select_buttons.length; i++) {
        voice_select_buttons[i].addEventListener("click", async (e) => {
            t = e.currentTarget;
            video_request_model.voice = t.getAttribute('data-voice');
            video_request_model.voice_provider = t.getAttribute('data-voice-provider');
            video_request_model.voice_api_provider = t.getAttribute('data-voice-api-provider');
        }); // ,true});
    }

});
