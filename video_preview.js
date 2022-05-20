var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    user.membershipTypeId = $memberstack.membership.status;
});

function title_case(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function insert_video_html(index, row) {
    var video_ready = row.current_video_most_recent !== undefined && row.current_video_most_recent !== null && row.current_video_most_recent.trim() != ""
    const html_template = `
    <h1 id="video-title">${row.video_name}</h1>
    <div class="w-embed">
        <video id="video" width="100%" controls="">
	        <source src="${row.current_video_most_recent}" type="video/mp4">
        </video>
    </div>

    <div>
        <p id="script" class="p-template">${row.script}</p>
        </div>

    <div>
        <a href="${row.download_url}" class="button button-gallery-share w-inline-block">
            <div class="w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="19.079" height="19.079">
                <path d="m9.54 13.779 5.3-6.36h-3.18V0H7.42v7.419H4.24Zm-7.419 3.18v-8.48H.001v8.479a2.126 2.126 0 0 0 2.12 2.12h14.838a2.126 2.126 0 0 0 2.12-2.119v-8.48h-2.12v8.479Z" fill="currentColor"></path>
            </svg></div>
        </a>
    </div>

    <div class="margin-bottom margin-s">
        <div class="t-preview-var">Avatar: ${title_case(row.actor)}<br/><br/></div>
        <div class="t-preview-var">Voice: ${title_case(row.voice_provider)} ${title_case(row.voice)}<br/><br/></div>
        <div class="t-preview-var">Creation date: ${new Date(Date.parse(row.date_created)).toLocaleString()}<br/><br/></div>
        <div>Production status: ${video_ready ? "Ready" : "Queued"}<br/><br/></div>
        <div>Moderation status: ${row.script_approval ? "Accepted" : "Marked for moderation"}<br/><br/></div>
    </div>
    `;

    //var html_template_string = $.parseHTML(html_template);
    element = document.querySelector('.container.a-center');
    element.innerHTML = html_template;
}

async function get_video_gallery() {
    var urlParams = new URLSearchParams(window.location.search);
    var recordID = urlParams.get('record_id');

    //var url = 'https://europe-west2-speech2vid-api.cloudfunctions.net/react-gallery';
    var url = `https://app-vktictsuea-nw.a.run.app/video_gallery/${recordID}`;
    
    let response = await fetch(url, {
        method: 'POST',
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

