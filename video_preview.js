var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    //user.membershipTypeId = $memberstack.membership.status;
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
    if (row === undefined || row === null) return;
    var video_ready = row.current_video_most_recent !== undefined && row.current_video_most_recent !== null && row.current_video_most_recent.trim() != ""
    const html_template = `
    <h1 id="video-title">${row.video_name}</h1>
    <div class="w-embed">
        <video id="video" width="100%" controls="">
	        <source src="${row.current_video_most_recent}" type="video/mp4">
        </video>
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
    var url = `https://app-vktictsuea-nw.a.run.app/video_preview/${recordID}`;
    
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

    // if (gallery_video_index >= video_gallery_result.video_gallery.length) {
    //     var button_load = document.getElementById('button-load');
    //     button_load.style.display = "none";
    // }
}

var video_gallery_result = [];
var gallery_video_index = 0;
var disable_load_click = false;

window.addEventListener("load", async (e) => {
    await get_video_gallery();

    //var button_load = document.getElementById('button-load');

    // button_load.addEventListener("click", async (e) => {
    //     if (disable_load_click) return;
        
    //     disable_load_click = true;
    //     await insert_video_html_batch();
    //     disable_load_click = false;
    // });
});

