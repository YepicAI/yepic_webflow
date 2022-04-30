var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    user.membershipTypeId = $memberstack.membership.status;
});

function insert_video_html(row) {
    // var meta_record_id
    // var actor_raw
    // var actor
    // var voice
    // var voice_api_provider
    // var voice_provider
    // var script
    // var custom_audio_file
    // var audio_file
    // var current_video_most_recent
    // var audio_fea_link
    // var avatar_type
    // var background_url
    // var script_approval
    // var create_video
    // var watermarked
    // var avatar_size
    // var avatar_position
    // var avatar_circle_background
    // var avatar_circle_background_rim
    // var avatar_size_circle
    // var vm_status
    // var memberstack_id
    // var video_name
    // var background_image
    // var unique_webpage
    // var created_date
    // var last_modified
    // var download_url

    const html_template = `
                    <div class="video-item">
                    <div class="gallery-video-left">
                        <div class="video-preview">
                            <video controls>
                                <source src="${row.unique_webpage}">
                            </video>
                            <div class="eye-wrap"></div>
                        </div>
                        <div class="display-flex dir-vert justify-sb">
                            <div>
                                <h2 class="t-16-bold-cap">Video Title</h2>
                                <p id="videoName" class="p-template">${row.video_name}</p>
                            </div>
                            <div>
                                <h2 class="t-16-bold-cap">Script</h2>
                                <p id="script" class="p-template">${row.script}</p>
                            </div>
                            <div class="tab-buttons">
                                <a href="${row.unique_webpage}" class="button w-inline-block">
                                    <div>Preview</div>
                                </a>
                                <a href="#" class="button-light unavailable w-inline-block">
                                    <div>Edit</div>
                                </a>
                                <a href="${row.download_url}" class="button button-gallery-share w-inline-block">
                                    <div class="w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="19.079" height="19.079">
                                            <path d="m9.54 13.779 5.3-6.36h-3.18V0H7.42v7.419H4.24Zm-7.419 3.18v-8.48H.001v8.479a2.126 2.126 0 0 0 2.12 2.12h14.838a2.126 2.126 0 0 0 2.12-2.119v-8.48h-2.12v8.479Z" fill="currentColor"></path>
                                        </svg></div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-video-right">
                        <div class="separator-vidgallery display-none-tab"></div>
                        <div class="display-flex dir-vert _w-100">
                            <div class="t-16-bold-cap">Details</div>
                            <div class="properties-wrap">
                                <div class="margin-bottom margin-s">
                                    <div class="t-preview-var">Actor:</div>
                                    <div id="actor">${row.actor}</div>
                                </div>
                                <div class="margin-bottom margin-s">
                                    <div class="t-preview-var">Created on:</div>
                                    <div id="createdOn">${row.created_date}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
    `;
    var html_template_string = $.parseHTML(html_template)
    $("#myvideolist").append(html_template_string);
}

async function get_video_gallery() {
    var url = 'https://europe-west2-speech2vid-api.cloudfunctions.net/react-gallery';

    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({'id': user.id}),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + MemberStack.getToken(),
        },        
    });
    
    var result = await response.json();

    console.log(result);
    console.log(result.status);
    console.log(result.video_gallery);

    if (result.status !== 'success') return;

    for (var index = 0; index < result.video_gallery.length; index++) {
        insert_video_html(result.video_gallery[index]);
    }
}

window.addEventListener("load", async (e) => {
    await get_video_gallery(); 
});
