async function check_email_addr_new(email_addr) {
    // returns true if email addr is unregistered

    var url = 'https://airtable-db-dot-speech2vid-api.nw.r.appspot.com/checkEmail/' + email_addr;

    let response = await fetch(url, {
        method: 'GET',
    });

    var result = await response.text();

    var is_email_addr_new = (result.trim() === 'true');

    return is_email_addr_new;
}

async function check_email_addr_valid(email_addr, allow_free = false) {
    // returns true if email addr valid

    var url = 'https://moderator-2xzgrl4rma-uc.a.run.app/email';

    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({text:email_addr}),
        headers: {
            "Content-Type": "application/json",
            "token": "575CDCE36ABB516771A658B055A61BAF657E1B8E",
        },        
    });
    
    var result = await response.json();

    console.log(result);

    var is_email_addr_accepted = true;

    if (result.deliverability == 'UNDELIVERABLE') is_email_addr_accepted = false;
    //else if (!result.email_validation) is_email_addr_accepted = false;
    else if (result.is_disposable_email) is_email_addr_accepted = false;
    else if (!allow_free && result.is_free_email) is_email_addr_accepted = false;
    else if (!result.is_valid_format) is_email_addr_accepted = false;
    //else if (result.quality_score <= 0.01) is_email_addr_accepted = false;
    else if (result.status !== 'success') is_email_addr_accepted = false;
    
    return is_email_addr_accepted;
}


var signup_form = document.getElementById("email-form");
var signup_submit = document.querySelector('#email-form input[type="submit"]');
var signup_validation_active = false;
var signup_validation_done = false;

signup_form.addEventListener("submit", async (e) => {
    if (signup_validation_done)
    {
        signup_validation_done = false;
        return true;
    }

    e.stopPropagation();
    e.preventDefault();
    if (signup_validation_active) 
    {
        return false;
    }

    signup_validation_active = true;

    var email_addr = document.getElementById('Email').value;

    console.log(email_addr);
    

    var is_email_addr_new = await check_email_addr_new(email_addr);
    var is_email_addr_accepted = await check_email_addr_valid(email_addr, true);
    console.log('is_email_addr_new = ' + is_email_addr_new);
    console.log('is_email_addr_accepted = ' + is_email_addr_accepted);

    var form_validated = is_email_addr_new && is_email_addr_accepted;

    if (form_validated)
    {
        signup_validation_active = false;
        signup_validation_done = true;
        signup_submit.click();
        return false;
    }

    var validation_errors = [];

    if (!is_email_addr_new)
    {
        validation_errors.push("That email address is already registered.");
    }

    if (!is_email_addr_accepted)
    {
        validation_errors.push("That email address is not accepted.");
    }

    if (validation_errors.length > 0)
    {
        alert(validation_errors.join(" "))
    }

    signup_validation_active = false;
});
