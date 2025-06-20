// Format URL input before submission, removes whitespace, adds "https(s)://" if it doesn't exist, if URL isn't of a common domain
// it submits without changes (eg. localhost:5000)
function AutofillOnSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    var urlInput = document.getElementById("url");
    var url = urlInput.value.trim();
    // Regular expression to match URLs starting with http:// or https://
    var httpRegex = /^https?:\/\//i;
    // Regular expression to match known top-level domains
    var tldRegex = /\.(com|org|net|edu|gov|mil|info|biz|us|uk|co|ca)$/i;
    // Regular expression to match a trailing "/"
    var trailingSlashRegex = /\/$/;
    if (!httpRegex.test(url)) {
        // If URL does not start with http:// or https://, add "https://"
        url = "https://" + url;
    }
    // Check if the URL contains any known top-level domains or ends with "/"
    if (!tldRegex.test(url) && !trailingSlashRegex.test(url)) {
        // If URL isn't a common top-level domain or ends with a "/", submit without changes
        event.target.submit();
        return; // Exit the function early
    }
    // Update the input value, with our cleaned-up URL
    urlInput.value = url;
    // Now submit the form
    event.target.submit();
}
