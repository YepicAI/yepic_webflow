var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    user.membershipTypeId = $memberstack.membership.status;
});

var video_gallery_result = [];
var gallery_video_index = 0;
var disable_load_click = false;

function title_case(str) {
    if (str === undefined || str === null || str === '') return '';
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function download_url(url, filename) {
    await fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(console.error);
}

async function download_speech(ele, voice_api_provider, voice_provider, voice, script) {
    if (ele === undefined) return;
    if (voice_api_provider === undefined || voice_api_provider === null || voice_api_provider.trim() === '') voice_api_provider = "aflorithmic";
    if (voice_provider === undefined || voice_provider === null || voice_provider.trim() === '') voice_provider = "azure";
    if (voice === undefined || voice === null || voice.trim() === '') return;
    if (script === undefined || script === null || script.trim() === '') return;
    
    console.log('ok');
    // template error messages
    var error_connection = "Connection problem. Please try again or contact support. Sorry for the inconvenience.";
    var error_moderation = "Content moderation system has flagged the script as potentially unacceptable. Therefore, sorry it cannot be downloaded. Please request the file from Customer Services.";


    // call audio preview api
    //var url = 'http://127.0.0.1:5000/api/v0/speech';
    var url = 'https://app-vktictsuea-nw.a.run.app/api/v0/speech';
    var moderator_blocked = false;

    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "voice_api_provider":voice_api_provider,
                "voice_provider":voice_provider,
                "voice":voice,
                "script":script,
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MemberStack.getToken()}`,
            },
        });

        let response_json = await response.json();

        console.log(response_json);

        if (response_json.signed_url !== null && response_json.signed_url !== undefined && response_json.signed_url.trim() !== '') {
            ele
            let signed_url = response_json.signed_url;
            let download_name = new URL(signed_url).pathname.split('/').pop();
            //await download_url(signed_url, download_name);
            ele.removeAttribute("onclick");
            ele.href = signed_url;
            ele.click();
            return;
        }

        moderator_blocked = response_json.response_status_message === "content moderator error" || response_json.response_status_message === "content not accepted";
    }
    catch (error) {
        console.log(error);
    }

    // this only executes if there was an error
    alert(moderator_blocked ? error_moderation : error_connection);
}

async function get_video_gallery() {
    let url = 'https://app-vktictsuea-nw.a.run.app/api/v0/videos';

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + MemberStack.getToken(),
        },
    });

    var result = await response.json();

    if (result.status !== 'success' && result.response_status !== 'success') return;

    video_gallery_result = result;

    await insert_video_html_batch();
}

async function rename_video(video_request_uuid, video_name) {
    if (video_request_uuid === undefined || video_request_uuid === null || video_request_uuid === '') return;
    if (video_name === undefined || video_name === null || video_name === '') return;
    let token = MemberStack.getToken();
    if (token === undefined || token === null || token === '') return;

    let url = `https://app-vktictsuea-nw.a.run.app/api/v0/videos/${video_request_uuid}`;

    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            "video_name": video_name
        })
    });

    var result = await response.json();

    if (result.status !== 'success' && result.response_status !== 'success') return;

    window.location.reload();
}

async function set_video_access(video_request_uuid, video_access) {
    if (video_request_uuid === undefined || video_request_uuid === null || video_request_uuid === '') return;
    if (video_access === undefined || video_access === null || video_access === '') return;
    if (video_access !== 'Public' && video_access !== 'Private') return;
    let token = MemberStack.getToken();
    if (token === undefined || token === null || token === '') return;

    let url = `https://app-vktictsuea-nw.a.run.app/api/v0/videos/${video_request_uuid}`;

    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            "video_access": video_access
        })
    });

    var result = await response.json();

    if (result.status !== 'success' && result.response_status !== 'success') return;

    window.location.reload();
}

async function delete_video(video_request_uuid) {
    if (video_request_uuid === undefined || video_request_uuid === null || video_request_uuid === '') return;
    let token = MemberStack.getToken();
    if (token === undefined || token === null || token === '') return;

    let url = `https://app-vktictsuea-nw.a.run.app/api/v0/videos/${video_request_uuid}`;

    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    var result = await response.json();

    if (result.status !== 'success' && result.response_status !== 'success') return;

    window.location.reload();
}

async function insert_video_html_batch() {
    buffer_size = 5;

    for (var index = gallery_video_index; index < video_gallery_result.video_gallery.length && index < gallery_video_index + buffer_size; index++) {
        insert_video_html(index, video_gallery_result.video_gallery.length - index, video_gallery_result.video_gallery[index]);
    }

    gallery_video_index += buffer_size;

    if (gallery_video_index >= video_gallery_result.video_gallery.length) {
        var button_load = document.getElementById('button-load');
        button_load.style.display = "none";
    }
}

function video_query_string(row)
{
    let items = ['avatar', 'voice', 'voice_provider', 'voice_api_provider', 'script', 'video_name'];

    var queryString = Object.keys(row).map((key) => {
        if (items.includes(key))
        {
            return encodeURIComponent(key) + '=' + encodeURIComponent(row[key])
        }
    }).filter((a)=>a).join('&');

    return queryString;
}

function insert_video_html(index, reverse_index, row) {
    var video_ready = row.current_video_most_recent !== undefined && row.current_video_most_recent !== null && row.current_video_most_recent.trim() != "";
    const del_msg = `Delete video #${reverse_index}?\\nTitle: ${row.video_name}\\n`;
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
                                    <h2 class="t-16-bold-cap">Video Title (#${reverse_index})</h2>
                                    <p id="videoName" class="p-template">${row.video_name}</p>
                                </div>
                                <div>
                                    <h2 class="t-16-bold-cap">Script</h2>
                                    <p id="script" class="p-template">${row.script}</p>
                                    <a download target="_blank" onclick="var index=${index}; download_speech(this, video_gallery_result.video_gallery[index].voice_api_provider,video_gallery_result.video_gallery[index].voice_provider,video_gallery_result.video_gallery[index].voice,video_gallery_result.video_gallery[index].script); return false;" href="#">Download Audio (Beta)</a>
                                </div>
                                <div class="tab-buttons">
                                    <a href=${JSON.stringify(row.unique_webpage)} class="button w-inline-block">
                                        <div>Preview</div>
                                    </a>
                                    <a href="createvideo?avatar=${video_query_string(row)}" class="button-light unavailable w-inline-block">
                                        <div>Edit</div>
                                    </a>
                                    <a href=${JSON.stringify(row.download_url)} class="button button-gallery-share w-inline-block">
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
                                        <div class="t-preview-var">Avatar: ${title_case(row.actor)}<br/></div>
                                        <div class="t-preview-var">Voice: ${title_case(row.voice_provider)} ${title_case(row.voice)}<br/></div>
                                        <div class="t-preview-var">Date: ${new Date(Date.parse(row.date_created)).toLocaleDateString()}<br/></div>
                                        <div class="t-preview-var">Time: ${new Date(Date.parse(row.date_created)).toLocaleTimeString()}<br/></div>
                                        <div>Production status: ${video_ready ? "Ready" : "Queued"}<br/></div>
                                        <div>Moderation status: ${row.script_approval ? "Accepted" : "Marked for moderation"}<br/></div>
                                        <div>Video Preview Page: ${row.video_access === 'Public' ? 'Public' : 'Private'}</a><br/></div>
                                        <div><a onclick="var index=${index}; set_video_access(video_gallery_result.video_gallery[index].video_request_uuid, '${row.video_access === 'Public' ? 'Private' : 'Public'}'); return false;" href="#">Make ${row.video_access === 'Public' ? "Private" : "Public"}</a><br/></div>
                                        <div><a onclick="var index=${index}; var prompt_result=prompt('Rename video (#${reverse_index})?',video_gallery_result.video_gallery[index].video_name); rename_video(video_gallery_result.video_gallery[index].video_request_uuid, prompt_result); return false;" href="#">Rename video</a><br/></div>
                                        <div><a onclick="var index=${index}; if (confirm('Delete video #${reverse_index}?')) delete_video(video_gallery_result.video_gallery[index].video_request_uuid); return false;" href="#">Delete Video</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    `;
    let html_template_string = $.parseHTML(html_template)
    $("#myvideolist").append(html_template_string);
}

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
