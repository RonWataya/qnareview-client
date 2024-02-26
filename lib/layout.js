
document.addEventListener('DOMContentLoaded', (event) => {
    // Attach click event listener to the close button
    document.getElementById('closeSuggestions').addEventListener('click', function () {
        // Hide the suggestions container
        document.getElementById('suggestions').style.display = 'none';
    });
});
