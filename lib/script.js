// Question and Answer function with context ID handling
document.getElementById('questionBox').addEventListener('input', function () {

    const inputText = this.value;
    if (inputText.length > 1) {
        fetch(`http://ec2-3-88-156-72.compute-1.amazonaws.com:2000/api/questions?s=${encodeURIComponent(inputText)}`)
            .then(response => response.json())
            .then(data => {
                let suggestionsHTML = '';
                data.forEach(item => {
                    // Assuming each item now also includes a contextId
                    suggestionsHTML += `<div onclick="selectQuestion('${item.question.replace(/'/g, "\\'")}', '${item.answer.replace(/'/g, "\\'")}', '${item.contextId}')">${item.question}</div>`;
                });
                const suggestionsDiv = document.getElementById('suggestions');
                suggestionsDiv.innerHTML = suggestionsHTML;
                if (data.length > 0) {
                    suggestionsDiv.style.display = 'block';
                }
            });
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
});


function selectQuestion(question, answer, contextId) {
    document.getElementById('questionBox').value = question;
    document.getElementById('answerBox').value = answer;
    // Save contextId to use for loading context
    document.getElementById('answerBox').setAttribute('data-context-id', contextId);
    document.getElementById('suggestions').style.display = 'none';
    // Enable the Load Context link once a question is selected
    document.getElementById('loadContextBtn').classList.remove('disabled-link');
}

document.getElementById('closeSuggestions').addEventListener('click', function () {
    document.getElementById('suggestions').style.display = 'none';
});

// Load context function with dynamic contextId
document.getElementById('loadContextBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default anchor action

    const contextId = document.getElementById('answerBox').getAttribute('data-context-id');

    fetch(`http://ec2-3-88-156-72.compute-1.amazonaws.com:2000/api/context/${contextId}`)
        .then(response => response.json())
        .then(data => {
            const contextList = document.querySelector('.my-context-list');
            contextList.innerHTML = ''; // Clear existing list

            data.forEach(item => {
                const docId = item.DOC_ID.toString().trim(); // Assuming DOC_ID is your document identifier
                const paragId = item.PARAG_ID.toString().trim(); // Assuming PARAG_ID is your paragraph identifier
                const paragText = item.PARAG_TEXT || 'No paragraph text'; // Get paragraph text, or default text if not available
                const uniqueId = `${docId}-${paragId}`;

                // Create the list item if it doesn't already exist
                if (!document.querySelector(`.my-context-list [data-unique-id="${uniqueId}"]`)) {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-unique-id', uniqueId); // Set the unique identifier as an attribute
                    listItem.dataset.docId = docId; // Store the docId as dataset
                    listItem.dataset.paragId = paragId; // Store the paragId as dataset

                    // Modified to include paragraph text in the list item's text content
                    listItem.textContent = `Doc ${docId}: ${paragId} - ${paragText}`;

                    const removeCheckbox = document.createElement('input');
                    removeCheckbox.type = 'checkbox';
                    removeCheckbox.classList.add('mr-10');
                    removeCheckbox.dataset.docId = docId;
                    removeCheckbox.dataset.paragId = paragId;
                    listItem.appendChild(removeCheckbox);

                    contextList.appendChild(listItem);
                }
            });

            document.getElementById('loadContextBtn').classList.add('disabled-link');
        })
        .catch(error => console.error('Error loading context:', error));
});

///////

//Clear answers and questions
document.getElementById('clearAnswer').addEventListener('click', function () {
    document.getElementById('questionBox').value = '';
    document.getElementById('answerBox').value = '';
    document.getElementById('answerBox').removeAttribute('data-context-id');

    // Disable the Load Context link
    document.getElementById('loadContextBtn').classList.add('disabled-link');
});

//documents
document.addEventListener('DOMContentLoaded', function () {
    const documentSelect = document.getElementById('documentSelect');
    const searchInput = document.getElementById('searchPhrase');
    const paragraphList = document.querySelector('.my-paragraph-list');
    const contextList = document.getElementById('contextList');
    const addToContextBtn = document.getElementById('addToContextBtn');

    function loadDocuments() {
        fetch('http://ec2-3-88-156-72.compute-1.amazonaws.com:2000/getDocuments')
            .then(response => response.json())
            .then(documents => {
                documents.forEach(doc => {
                    const option = document.createElement('option');
                    option.value = doc.DOC_ID;
                    option.textContent = doc.TITLE;
                    documentSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading documents:', error));
    }

    function loadParagraphs(docId) {
        fetch(`http://ec2-3-88-156-72.compute-1.amazonaws.com:2000/getParagraphs?docId=${docId}`)
            .then(response => response.json())
            .then(paragraphs => displayParagraphs(paragraphs))
            .catch(error => console.error('Error:', error));
    }

    function displayParagraphs(paragraphs) {
        paragraphList.innerHTML = ''; // Clear current list

        paragraphs.forEach(paragraph => {
            const li = document.createElement('li');
            li.className = 'paragraph-item';
            const div = document.createElement('div');
            div.className = 'my-contact-cont';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.setAttribute('data-doc-id', paragraph.DOC_ID);
            input.setAttribute('data-parag-id', paragraph.PARAG_ID);
            const span = document.createElement('span');
            span.textContent = `Parag ${paragraph.PARAG_ID}: ${paragraph.PARAG_TEXT.substring(0, 10000)}`;

            div.appendChild(input);
            div.appendChild(span);
            li.appendChild(div);
            paragraphList.appendChild(li);
        });
        // Call the function to grey out paragraphs already in context
        updateParagraphListWithExistingContext();
    }

    function filterParagraphs(searchTerm) {
        const paragraphs = document.querySelectorAll('.paragraph-item');
        paragraphs.forEach(paragraph => {
            const text = paragraph.innerText.toLowerCase();
            paragraph.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    documentSelect.addEventListener('change', function () {
        loadParagraphs(this.value);
    });

    searchInput.addEventListener('input', function () {
        filterParagraphs(this.value.toLowerCase());
    });

    addToContextBtn.addEventListener('click', function () {
        const selectedParagraphs = document.querySelectorAll('.my-paragraph-list input[type="checkbox"]:checked:not([data-in-context])');
        selectedParagraphs.forEach(checkbox => {
            const docId = checkbox.getAttribute('data-doc-id');
            const paragId = checkbox.getAttribute('data-parag-id');
            const uniqueId = `${docId}-${paragId}`;
    
            // Retrieve the paragraph text. Assuming the text is the sibling span's content.
            const paragTextSpan = checkbox.nextElementSibling; // The span that holds the paragraph text.
            const paragText = paragTextSpan.textContent;
    
            // Check if the uniqueId already exists in the context list
            if (!document.querySelector(`#contextList [data-unique-id="${uniqueId}"]`)) {
                let docEntry = document.createElement('li');
                docEntry.setAttribute('data-unique-id', uniqueId); // Set a unique identifier attribute
                docEntry.dataset.docId = docId; // Store the docId as dataset
                docEntry.dataset.paragId = paragId; // Store the paragId as dataset
    
                // Format to match the loadContext display: "Doc ID: Paragraph ID Paragraph text"
                docEntry.textContent = `Doc ${docId}: ${paragId} - ${paragText}`;
    
                const removeCheckbox = document.createElement('input');
                removeCheckbox.type = 'checkbox';
                removeCheckbox.classList.add('mr-10');
                removeCheckbox.dataset.docId = docId;
                removeCheckbox.dataset.paragId = paragId;
                docEntry.appendChild(removeCheckbox);
    
                contextList.appendChild(docEntry);
    
                checkbox.closest('li').style.backgroundColor = '#D3D3D3';
                checkbox.setAttribute('data-in-context', 'true');
            }
        });
    });
    ;


    contextList.addEventListener('change', function (e) {
        if (e.target.type === 'checkbox' && e.target.checked) {
            const docId = e.target.dataset.docId;
            const paragId = e.target.dataset.paragId;
            let docEntry = Array.from(contextList.children).find(entry => entry.dataset.docId === docId && entry.textContent.includes(paragId));
            if (docEntry) {
                docEntry.remove();

                const correspondingCheckbox = document.querySelector(`.my-paragraph-list input[data-doc-id="${docId}"][data-parag-id="${paragId}"]`);
                if (correspondingCheckbox) {
                    correspondingCheckbox.closest('li').style.backgroundColor = '';
                    correspondingCheckbox.removeAttribute('data-in-context');
                    correspondingCheckbox.checked = false;
                }
            }
        }
    });

    paragraphList.addEventListener('change', function (e) {
        if (e.target.type === 'checkbox' && !e.target.checked && e.target.getAttribute('data-in-context') === 'true') {
            const docId = e.target.getAttribute('data-doc-id');
            const paragId = e.target.getAttribute('data-parag-id');

            // Remove corresponding entry from contextList
            let correspondingCheckboxInContext = contextList.querySelector(`input[data-doc-id="${docId}"][data-parag-id="${paragId}"]`);
            if (correspondingCheckboxInContext) {
                correspondingCheckboxInContext.closest('li').remove();
            }

            e.target.closest('li').style.backgroundColor = '';
            e.target.removeAttribute('data-in-context');
        }
    });

    //Update paragraphs already loaded
    function updateParagraphListWithExistingContext() {
        const contextItems = document.querySelectorAll('.my-context-list li');
        contextItems.forEach(contextItem => {
            const docId = contextItem.dataset.docId;
            const paragId = contextItem.dataset.paragId;
            const paragraphCheckbox = document.querySelector(`.my-paragraph-list input[data-doc-id="${docId}"][data-parag-id="${paragId}"]`);
            if (paragraphCheckbox) {
                paragraphCheckbox.closest('li').style.backgroundColor = '#D3D3D3'; // Grey out the paragraph
                paragraphCheckbox.setAttribute('data-in-context', 'true'); // Mark as in context
            }
        });
    }

    loadDocuments();
});


