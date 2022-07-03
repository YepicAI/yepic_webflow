var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    user.membershipTypeId = $memberstack.membership.status;
});

function title_case(str) {
    if (str === undefined || str === null || str === '') return '';
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function insert_video_html(index, row) {
    var video_ready = row.current_video_most_recent !== undefined && row.current_video_most_recent !== null && row.current_video_most_recent.trim() != "";
    const del_msg = `Delete video #${index}?\\nTitle: ${row.video_name}\\n`;
    const html_template = `
                    <div class="video-item">
                    <div class="gallery-video-left">
                        <div class="video-preview">
                            <video controls>
                                <source src="${row.current_video_most_recent}">
                            </video>
                            <div class="eye-wrap"></div>
                        </div>
                        <div class="display-flex dir-vert justify-sb">
                            <div>
                                <h2 class="t-16-bold-cap">Video Title (#${index})</h2>
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
                                    <div class="t-preview-var">Avatar: ${title_case(row.actor)}<br/><br/></div>
                                    <div class="t-preview-var">Voice: ${title_case(row.voice_provider)} ${title_case(row.voice)}<br/><br/></div>
                                    <div class="t-preview-var">Creation date: ${new Date(Date.parse(row.date_created)).toLocaleString()}<br/><br/></div>
                                    <div>Production status: ${video_ready ? "Ready" : "Queued"}<br/><br/></div>
                                    <div>Moderation status: ${row.script_approval ? "Accepted" : "Marked for moderation"}<br/><br/></div>
                                    <div><a onclick="if (confirm('${del_msg}')) delete_video('${row.video_request_uuid}');" href="#">Delete Video</a></div>
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
    //var url = 'https://europe-west2-speech2vid-api.cloudfunctions.net/react-gallery';
    var url = 'https://app-vktictsuea-nw.a.run.app/video_gallery/';
    
    let response = await fetch(url, {
        method: 'POST',
        //body: JSON.stringify({ 'id': user.id }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + MemberStack.getToken(),
        },
    });

    var result = await response.json();

    //console.log(result);
    //console.log(result.status);
    //console.log(result.video_gallery);

    if (result.status !== 'success' && result.response_status !== 'success') return;

    video_gallery_result = result;

    await insert_video_html_batch();
}


async function delete_video(video_request_uuid) {
    if (video_request_uuid === undefined || video_request_uuid === null || video_request_uuid === '') return;
    let token = MemberStack.getToken();
    if (token === undefined || token === null || token === '') return;

    //let url = 'https://europe-west2-speech2vid-api.cloudfunctions.net/react-gallery';
    //let url = 'https://app-vktictsuea-nw.a.run.app/video_gallery/';
    let url = `https://127.0.0.1:5000/delete_video_request/${video_request_uuid}`
    
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    var result = await response.json();

    if (result.status !== 'success' && result.response_status !== 'success') return;

    location.reload();
}

async function insert_video_html_batch() {
    buffer_size = 5;

    for (var index = gallery_video_index; index < video_gallery_result.video_gallery.length && index < gallery_video_index + buffer_size; index++) {
        insert_video_html(video_gallery_result.video_gallery.length - index, video_gallery_result.video_gallery[index]);
    }

    gallery_video_index += buffer_size;

    if (gallery_video_index >= video_gallery_result.video_gallery.length) {
        var button_load = document.getElementById('button-load');
        button_load.style.display = "none";
    }
}

var video_gallery_result = [];
var gallery_video_index = 0;
var disable_load_click = false;

window.addEventListener("load", async (e) => {
    await get_video_gallery();

    var button_load = document.getElementById('button-load');

    button_load.addEventListener("click", async (e) => {
        if (disable_load_click) return;
        
        disable_load_click = true;
        await insert_video_html_batch();
        disable_load_click = false;
    });
});
