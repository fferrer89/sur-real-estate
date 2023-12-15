// Immediately Invoked Function Expression (IIFE)
(function () {
    const CURRENT_PATH = window.location.pathname; // eg: /listings/656dfb9b1c785c4c9a324a98
    // Parse CURRENT_PATH and retrieve the listingId, which is a path variable in the current url
    const CURRENT_PATH_VARS = CURRENT_PATH.split('/');
    const LISTING_ID = CURRENT_PATH_VARS[2];

    const postDepositForm = document.getElementById('post-deposit-form');
    const postVisitForm = document.getElementById('post-visit-form');
    const postCommentForm = document.getElementById('post-comment-form');
    const postMessageForm = document.getElementById('post-message-form');

    const postMessageReplyForms = document.getElementsByClassName('post-message-reply-form');

    if (postDepositForm) {
        let formAction = postDepositForm.getAttribute('action');
        let newFormAction = formAction.replace(':listingId', LISTING_ID);
        postDepositForm.setAttribute('action', newFormAction);
    }
    if (postVisitForm) {
        let formAction = postVisitForm.getAttribute('action');
        let newFormAction = formAction.replace(':listingId', LISTING_ID);
        postVisitForm.setAttribute('action', newFormAction);
    }
    if (postCommentForm) {
        let formAction = postCommentForm.getAttribute('action');
        let newFormAction = formAction.replace(':listingId', LISTING_ID);
        postCommentForm.setAttribute('action', newFormAction);
        postCommentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const comment = document.querySelector("#comment");
            const listingId = document.querySelector("#listingId");
            let formData = {comment:comment.value};

            const response = await fetch(newFormAction,
                {
                    method:"POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
            if (!response.ok) {
                throw new Error(`${response.status} -${response.statusText}`)
            }
            console.log(response);
            const commentList = document.querySelector("#comments-list");
            let resText = await response.text();
            comment.value = '';
            const noCommentsMessage = document.querySelector("#no-comments-message");

            if (noCommentsMessage) {
                noCommentsMessage.remove();
            }
            commentList.insertAdjacentHTML("beforeend", resText);
        });
    }
    if (postMessageForm) {
        let formAction = postMessageForm.getAttribute('action');
        let newFormAction = formAction.replace(':listingId', LISTING_ID);
        postMessageForm.setAttribute('action', newFormAction);
    }
    if (postMessageReplyForms) {
        console.log(postMessageReplyForms);
        let formAction, newFormAction;
        for (let postMessageReplyForm of postMessageReplyForms) {
            formAction = postMessageReplyForm.getAttribute('action');
            newFormAction = formAction.replace(':listingId', LISTING_ID);
            postMessageReplyForm.setAttribute('action', newFormAction);
        }
    }
    const loginMessage = document.getElementsByClassName('login-message');
    let inputElements = document.getElementsByTagName('input');
    let buttonElements = document.getElementsByTagName('button');
    if (loginMessage.length > 0) {
        for (let inputElement of inputElements) {
            inputElement.disabled = true;
        }
        for (let buttonElement of buttonElements) {
            buttonElement.disabled = true;
        }
    }
})();
