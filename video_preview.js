var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
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

function insert_error() {
    const html_template = `
    <h1 id="video-title"></h1>
    <p id="p_error">Video not found.</p>
    `;

    element = document.querySelector('.container.a-center');
    element.innerHTML = html_template;
}

function insert_video_html(index, row) {
    if (row === undefined || row === null) return;
    
    const html_template = `
    <h1 id="video-title">${row.video_name}</h1>
    <div class="w-embed">
        <video id="video" width="100%" controls="">
	        <source src="${row.current_video_most_recent}" type="video/mp4">
        </video>
    </div>
    `;

    element = document.querySelector('.container.a-center');
    element.innerHTML = html_template;
}

async function get_video_gallery() {
    var urlParams = new URLSearchParams(window.location.search);
    var recordID = urlParams.get('record_id');

    // var url = `https://app-vktictsuea-nw.a.run.app/video_preview/${recordID}`;
    var url = `https://app-vktictsuea-nw.a.run.app/api/v0/videos/${recordID}`;

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

    if (video_gallery_result.video_gallery === undefined || video_gallery_result.video_gallery === null || video_gallery_result.video_gallery.length === 0) {
        await insert_error();
    }
    else {
        await insert_video_html_batch();
    }
}

async function insert_video_html_batch() {
    buffer_size = 5;

    for (var index = gallery_video_index; index < video_gallery_result.video_gallery.length && index < gallery_video_index + buffer_size; index++) {
        insert_video_html(video_gallery_result.video_gallery.length - index, video_gallery_result.video_gallery[index]);
    }

    gallery_video_index += buffer_size;
}

var video_gallery_result = [];
var gallery_video_index = 0;
var disable_load_click = false;

window.addEventListener("load", async (e) => {
    await get_video_gallery();
});

