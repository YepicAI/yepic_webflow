
var selectors = {};
var submit_enabled = true;
var pre_error_style = {};

function is_empty(value) {
    return (value === undefined || value === null || value === '' || String(value).trim().length === 0);
}

async function set_selectors() {
    selectors = {
        'submit': "#wf-form-Royal-AIness > input",
        'background_templates': "div.ai-jubilee-grid label.ai-radio-parent.w-radio",
        'background_template_grid': "#wf-form-Royal-AIness > div:nth-child(1) > div.ai-jubilee-grid",
        'background_element': "#home > div.container.container-ainess > div.ai-form-container > div.flex-form-ai > div._w-50._w-100-tab > div > div > div > div.preview-bg",
        'friend_name': "#Friend-s-Name",
        'your_name': "#Your-Name",
        'event_name': "#Event-Name",
        'event_location': "#Event-Location",
        'event_date': "#wf-form-Royal-AIness > div:nth-child(2) > div.grid-ai-input > div:nth-child(5) > fieldset > input",
        'event_time': "#wf-form-Royal-AIness > div:nth-child(2) > div.grid-ai-input > div:nth-child(6) > fieldset > input",
        'your_email': "#Your-Email",
        'email_agree': "#email-agree",
        'own_account': "#own-account",
    };
}


async function cache_styles() {
    for (const [selector_key, selector] of Object.entries(selectors)) {
        let elements = document.querySelectorAll(selector);
        let styles = [];
        for (let element of elements) {
            styles.push(element.style);
        }
        pre_error_style[selector] = styles;
    }
}

async function set_template_click_events() {
    let elements = document.querySelectorAll(selectors.background_templates);

    for (let src of elements) {
        src.addEventListener("click", async (e) => {
            let dest = document.querySelector(selectors.background_element);

            let background_image = getComputedStyle(src).getPropertyValue('background-image');
            dest.style.backgroundImage = background_image;
        });
    }
}

async function set_reset_error_click_events() {
    for (const [selector_key, selector] of Object.entries(selectors)) {
        var elements = document.querySelectorAll(selector);

        for (let element of elements) {
            element.addEventListener("click", async (e) => {
                if (selector in pre_error_style) {
                    element.style = pre_error_style[selector];
                }
            });
        }
    }
}

async function set_submit_click_events() {
    let src = document.querySelector(selectors.submit);

    src.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!submit_enabled) { return; }
        submit_enabled = false;

        let background_element = document.querySelector(selectors.background_element);
        let background_image = getComputedStyle(background_element).getPropertyValue('background-image');
        let background_url = background_image.slice(4, -1).replace(/['"]/g, "");
        if (background_url == 'https://assets-global.website-files.com/612117669239223c914f3574/615f79777d8281d870ce0722_transparent.png') { background_url = ''; }

        let element_friend_name = document.querySelector(selectors.friend_name);
        let element_your_name = document.querySelector(selectors.your_name);
        let element_event_name = document.querySelector(selectors.event_name);
        let element_event_location = document.querySelector(selectors.event_location);
        let element_event_date = document.querySelector(selectors.event_date);
        let element_event_time = document.querySelector(selectors.event_time);
        let element_your_email = document.querySelector(selectors.your_email);
        let element_email_agree = document.querySelector(selectors.email_agree);
        let element_own_account = document.querySelector(selectors.own_account);

        var form_valid = true;
        var error_style = 'thin solid red';

        // validate special cases
        if (is_empty(background_url)) {
            form_valid = false;
            let grid = document.querySelector(selectors.background_template_grid);
            grid.style.border = error_style;
        }

        // validate regular input fields
        let required_elements = [
            element_friend_name,
            element_your_name,
            element_event_name,
            element_event_location,
            element_event_date,
            element_event_time,
            element_your_email,
        ];

        for (let element of required_elements) {
            if (is_empty(element.value)) {
                form_valid = false;
                element.style.border = error_style;
            }
        }

        if (!form_valid) {
            submit_enabled = true;
            return;
        }

        let form_vars = {
            'background_url': background_url,
            'friend_name': element_friend_name.value,
            'your_name': element_your_name.value,
            'event_name': element_event_name.value,
            'event_location': element_event_location.value,
            'event_date': element_event_date.value,
            'event_time': element_event_time.value,
            'your_email': element_your_email.value,
            'email_agree': element_email_agree.checked,
            'own_account': element_own_account.checked,
        };

        console.log(form_vars);

        try {
            let url = 'https://app-vktictsuea-nw.a.run.app/api/v0/royal_invite';

            let response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(form_vars),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            var result = await response.json();

            if (response.status === 200) {
                let ele1 = document.querySelector(".w-form-done");
                if (ele1!=null) ele1.style.display = 'block';
                
                let ele2 = document.querySelector(".form-wrap-inner");
                if (ele2!=null) ele2.style.display = 'none';
            }        
            else
            {
                alert("Form error: " + result.response_status_message);
            }
        }
        catch (err) {
            console.log(err);
        }

        submit_enabled = true;
    });
}

window.addEventListener("load", async (e) => {
    await set_selectors();
    await cache_styles();
    await set_template_click_events();
    await set_submit_click_events();
    await set_reset_error_click_events();

    try {
        let sel = '#ai-temp-1 > div';
        let ele = document.querySelector(sel);
        if (ele != null) ele.click();
    }
    catch (err) {
        console.log(err);
    }
});
