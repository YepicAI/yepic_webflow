var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    user.membershipTypeId = $memberstack.membership.status;
});

var currentGetMoreIndex = 0;
var data = [];

function addVideoToPage(video) {
    video_name = video.video_name
    script = video.script
    actor = video.actor
    video_created = video.video_created
    video_url = video.video_url
    unique_webpage = video.unique_webpage
    download_url = video.download_url
    const Item = `
                    <div class="video-item">
                    <div class="gallery-video-left">
                        <div class="video-preview">
                            <video controls>
                                <source src="${video_url}">
                            </video>
                            <div class="eye-wrap"></div>
                        </div>
                        <div class="display-flex dir-vert justify-sb">
                            <div>
                                <h2 class="t-16-bold-cap">Video Title</h2>
                                <p id="videoName" class="p-template">${video_name}</p>
                            </div>
                            <div>
                                <h2 class="t-16-bold-cap">Script</h2>
                                <p id="script" class="p-template">${script}</p>
                            </div>
                            <div class="tab-buttons">
                                <a href="${unique_webpage}" class="button w-inline-block">
                                    <div>Preview</div>
                                </a>
                                <a href="#" class="button-light unavailable w-inline-block">
                                    <div>Edit</div>
                                </a>
                                <a href="${download_url}" class="button button-gallery-share w-inline-block">
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
                                    <div id="actor">${actor}</div>
                                </div>
                                <div class="margin-bottom margin-s">
                                    <div class="t-preview-var">Created on:</div>
                                    <div id="createdOn">${video_created}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
    `;
    var videoElementHtmlString = $.parseHTML(Item)
    $("#myvideolist").append(videoElementHtmlString);
}

function loadVideosFromIndex(firstIndex, data) {
    for (let index = firstIndex; index < data.pages.length; index++) {
        const videoList = data.pages[index];
        if (typeof videoList !== 'undefined' && videoList.length > 0) {
            currentGetMoreIndex = index+1;
            for (const video of videoList) {
                addVideoToPage(video);
            }
            break;
        }
    }
}

// ------------------  LOAD FIRST PAGE VIDEOS -----------------
function LoadFirstPageVideos() {
    $.getJSON('https://airtable-db-dot-speech2vid-api.nw.r.appspot.com//video/user/' + user.id, function(fetchData) {
        data = fetchData;
        loadVideosFromIndex(currentGetMoreIndex, data);
    });
}
setTimeout(LoadFirstPageVideos, 1000);

$("#button-load").click(function () {
    loadVideosFromIndex(currentGetMoreIndex, data);
});
