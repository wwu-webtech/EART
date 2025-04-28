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
        // If not, submit the form without appending ".com"
        event.target.submit();
        return; // Exit the function early
    }
    // Update the input value
    urlInput.value = url;
    // Now submit the form
    event.target.submit();
}
