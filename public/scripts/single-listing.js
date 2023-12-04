// Immediately Invoked Function Expression (IIFE)
(function () {
    const CURRENT_PATH = window.location.pathname; // eg: /listings/656dfb9b1c785c4c9a324a98
    // Parse CURRENT_PATH and retrieve the listingId, which is a path variable in the current url
    const CURRENT_PATH_VARS = CURRENT_PATH.split('/');
    const LISTING_ID = CURRENT_PATH_VARS[2];
    console.log('LISTING_ID: ' + LISTING_ID);
    const postCommentForm = document.getElementById('post-comment-form');
    if (postCommentForm) {
        let formAction = postCommentForm.getAttribute('action');
        console.log('formAction: ' + formAction);
        let newFormAction = formAction.replace(':listingId', LISTING_ID);
        console.log('newFormAction: ' + newFormAction);
        // get the action property
        // substitute the ':listingId'
        postCommentForm.setAttribute('action', newFormAction);
    }


})();
