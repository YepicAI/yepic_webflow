var emailIsNew = true;
var formSubmitted = false;
var status = false;
//var quality_score = false;
var deliverability = false;
var is_valid_format = false;
var is_free_email = false;
var is_disposable_email = false;
//var email_validation = false;

// function checkNewEmail(email) {

//     $.ajax({
//         async: false,
//         type: 'GET',
//         url: "https://airtable-db-dot-speech2vid-api.nw.r.appspot.com/checkEmail/" + email,
//         success: function (data) {
//             emailIsNew = data;
//         }
//     });
//     console.log("Email is" + emailIsNew);
// }

function emailModerator(email) {
    $.ajax({
        async: false,
        url: "https://moderator-2xzgrl4rma-uc.a.run.app/email",
        type: "POST",
        data: JSON.stringify({
            text: email
        }),
        processData: false,
        headers: {
            "Content-Type": "application/json",
            "token": "575CDCE36ABB516771A658B055A61BAF657E1B8E",
        },
        success: function (data) {

            
            quality_score = data.quality_score;
            deliverability = data.deliverability;
            is_valid_format = data.is_valid_format;
            is_free_email = data.is_free_email;
            is_disposable_email = data.is_disposable_email;
            
        },
        error: function () {
            alert("Something went wrong, try again!");
        },
    });


}

var stateChanged = false;
var VL = {};

var formValues = {
    actor: null
};

$('.signup-div .forms').show();
$('.signup-div .forms .form-step-1').show();
$('.signup-div .forms .form-step-2').hide();
$('.form-step-3').hide();
$('#actor-selection .actor-select:first-child').click();

$('#actor-selection').on('click', '.actor-select', function () {
    formValues.actor = $(this).attr('data-actor');
    $('#actor-selection .actor-select').css({
        borderColor: "transparent"
    });
    $($(this)).css({
        borderColor: "#345791"
    });
})

$('a[data-name="form-continue"]').on('click', function () {
    var formErrors = false;

    $('.form-step-1 form #referral-script').css('border-color', '#345791');
    formValues.script = $('.form-step-1 form #referral-script').val();

    if (formValues.script.length < 3) {
        formErrors = true;
        $('.form-step-1 form #referral-script').css('border-color', 'red').css("border-style", "solid").css("border-width", "2px");
    }
    if (!formValues.actor) {
        formErrors = true;
        $('#actor-selection').css('border-color', 'red').css("border-style", "solid").css("border-width", "2px");
    }

    if (!formErrors) {

        $('.signup-div .forms .form-step-1').hide();
        $('.form-step-1').hide();
        $('.signup-div .forms .form-step-2').show();
    }

    return false;
})

$('a[data-name="form-submit"]').on('click', function () {

    var formErrors = false;
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    $('.form-step-2 form #referral-name').css('border-color', '#345791');
    $('.form-step-2 form #referral-email').css('border-color', '#345791');
    $('.form-step-2 form #referral-company').css('border-color', '#345791');

    formValues.name = $('.form-step-2 form #referral-name').val();
    formValues.email = $('.form-step-2 form #referral-email').val();

    formValues.company = $('.form-step-2 form #referral-company').val();
    formValues.how = $('.form-step-2 form #referral-how').val();

    res_data = emailModerator(formValues.email)
    //checkNewEmail(formValues.email)

    if (formValues.name.length < 3) {
        formErrors = true;
        $('.form-step-2 form #referral-name').css('border-color', 'red');
    }

    if (is_disposable_email) {
        formErrors = true;
        $('.form-step-2 form #referral-email').css('border-color', 'red');
        alert("Disposable emails are not allowed.")
    }
    if (is_free_email) {
        formErrors = true;
        $('.form-step-2 form #referral-email').css('border-color', 'red');
        alert("Please use a corporate email.")
    }

    if (!is_valid_format) {
        formErrors = true;
        $('.form-step-2 form #referral-email').css('border-color', 'red');
        alert("Plese enter a valid email.")
    }

    if (!emailIsNew) {
        formErrors = true;
        $('.form-step-2 form #referral-email').css('border-color', 'red');
        alert("Email is already in use.")
    }

    if (!regex.test(formValues.email)) {
        formErrors = true;
        $('.form-step-2 form #referral-email').css('border-color', 'red');
    }

    if (formValues.company.length < 3) {
        formErrors = true;
        $('.form-step-2 form #referral-company').css('border-color', 'red');
    }

    if (!formErrors && !formSubmitted) {
        formSubmitted = true;
        sendRequest();
    }

    return false;
})

function sendRequest() {

    $.ajax({
        url: 'https://hook.integromat.com/oudct5x6br3lxu9r7xmvnrfyxyy88rbw',
        type: 'POST',
        data: formValues,
        success: function (res) {
            if (emailIsNew == true) {
                $('.forms').hide();
                $('.form-step-2').hide();
                $('.form-step-3').show();
            } else if (emailIsNew == false) {
                $('.forms').hide();
                $('.form-step-2').hide();
                $('.form-step-3b').show();
            }
        },
        error: function (err) {},
    });
}