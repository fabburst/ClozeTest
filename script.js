document.addEventListener('DOMContentLoaded', function () {
    const generateClozeBtn = document.getElementById('generate-cloze');
    const originalText = document.getElementById('original-text');
    const clozeText = document.getElementById('cloze-text');
    const validateWordsBtn = document.getElementById('validate-words');
    const resetBtn = document.getElementById('reset');
    const toggleOriginalTextBtn = document.getElementById('toggle-original-text');
    const originalTextContainer = document.getElementById('original-text-container');
    const menuContainer = document.getElementById('mode-select');
    const outputContainer = document.getElementById('output-container');

    let selectedWords = [];
    
    document.getElementById('toggle-dark-mode').addEventListener('click', function() {
        let icon = this.querySelector('i');
        if (icon.classList.contains('fa-sun')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
    // Ajoutez ce code ici
    document.getElementById('toggle-dark-mode').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
    generateClozeBtn.addEventListener('click', function () {
        const text = originalText.value;
        const words = text.split(' ');

        clozeText.innerHTML = '';
        selectedWords = [];

        const selectedMode = document.getElementById('mode-select').value;

        if (selectedMode === 'hide') {
            words.forEach(word => {
                const span = document.createElement('span');
                span.innerText = word;
                span.addEventListener('click', () => {
                    span.classList.toggle('selected-word');
                    if (span.classList.contains('selected-word')) {
                        selectedWords.push(word);
                    } else {
                        const wordIndex = selectedWords.indexOf(word);
                        if (wordIndex !== -1) {
                            selectedWords.splice(wordIndex, 1);
                        }
                    }
                });
                clozeText.appendChild(span);
                clozeText.appendChild(document.createTextNode(' ')); // Adds space between words
            });
            validateWordsBtn.style.display = 'block';
        } else if (selectedMode === 'type') {
            words.forEach(word => {
                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('word-input');
                input.size = word.length;
                input.addEventListener('change', function () {
                    if (normalizeText(input.value.trim()) === normalizeText(word)) { // Normalize and trim
                        input.style.backgroundColor = 'lightgreen';
                        input.disabled = true;
                        input.value = word;
                    } else {
                        input.style.backgroundColor = 'lightcoral';
                    }
                });
                clozeText.appendChild(input);
                clozeText.appendChild(document.createTextNode(' ')); // Adds space between words
            });
            validateWordsBtn.style.display = 'none';
        }

        // Hide the input container
        document.getElementById('input-container').style.display = 'none';

        // Show the output container
        outputContainer.style.display = 'block';

        // Show the toggle button
        toggleOriginalTextBtn.style.display = 'block';
        originalTextContainer.style.display = 'none';
        resetBtn.style.display = 'block';
    });

    validateWordsBtn.addEventListener('click', function () {
        const text = originalText.value;
        const words = text.split(' ');

        clozeText.innerHTML = '';

        words.forEach(word => {
            if (selectedWords.includes(word)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('word-input');
                input.size = word.length;
                input.addEventListener('change', function () {
                    if (normalizeText(input.value.trim()) === normalizeText(word)) { // Normalize and trim
                        input.style.backgroundColor = 'lightgreen';
                        input.disabled = true;
                        input.value = word;
                    } else {
                        input.style.backgroundColor = 'lightcoral';
                    }
                });
                clozeText.appendChild(input);
            } else {
                const span = document.createElement('span');
                span.innerText = word;
                clozeText.appendChild(span);
            }
            clozeText.appendChild(document.createTextNode(' ')); // Adds space between words
        });

        validateWordsBtn.style.display = 'none';
    });

    resetBtn.addEventListener('click', function () {
        originalText.value = '';
        clozeText.innerHTML = '';
        validateWordsBtn.style.display = 'none';
        selectedWords = [];
        document.getElementById('input-container').style.display = 'flex';
        toggleOriginalTextBtn.style.display = 'none';
        originalTextContainer.style.display = 'none';
        outputContainer.style.display = 'none';
        resetBtn.style.display = 'none';
    });

    toggleOriginalTextBtn.addEventListener('click', function () {
        if (originalTextContainer.style.display === 'none') {
            originalTextContainer.style.display = 'block';
            originalTextContainer.innerText = originalText.value;
            toggleOriginalTextBtn.innerText = 'Masquer le texte original';
        } else {
            originalTextContainer.style.display = 'none';
            toggleOriginalTextBtn.innerText = 'Afficher le texte original';
        }
    });

    function normalizeText(text) {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[.,?():;]+/g, '') // Remove specific punctuations
            .replace(/^\s*[.,?():;]+\s*|\s*[.,?():;]+\s*$/g, '') // Remove punctuations at the beginning and end of the word, with or without spaces
            .toLowerCase()
            .replace(/'/g, ''); // Replace apostrophes
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const originalText = document.getElementById('original-text');
    const clozeText = document.getElementById('cloze-text');
    const validateWordsButton = document.getElementById('validate-words');
    const toggleOriginalTextButton = document.getElementById('toggle-original-text');
    const resumeLink = document.getElementById('resume-link');
    const generateButton = document.getElementById('generate-cloze');
    const resetButton = document.getElementById('reset');

    // Function to save the current state
    function saveState(userIP) {
        const state = {
            originalText: originalText.value,
            clozeText: clozeText.innerHTML,
            showOriginalTextButton: toggleOriginalTextButton.style.display,
            validateWordsButton: validateWordsButton.style.display,
        };
        localStorage.setItem(`clozeTextState_${userIP}`, JSON.stringify(state));
    }

    // Function to load the saved state
    function loadState(userIP) {
        const savedState = localStorage.getItem(`clozeTextState_${userIP}`);
        if (savedState) {
            const state = JSON.parse(savedState);
            originalText.value = state.originalText;
            clozeText.innerHTML = state.clozeText;
            toggleOriginalTextButton.style.display = state.showOriginalTextButton;
            validateWordsButton.style.display = state.validateWordsButton;

            // Reinitialize cloze text with event listeners
            reinitializeClozeText();
        }
    }

    // Reinitialize cloze text with event listeners
    function reinitializeClozeText() {
        const spans = clozeText.querySelectorAll('span');
        spans.forEach(span => {
            span.addEventListener('click', function() {
                this.classList.toggle('selected-word');
            });
        });
    }

    // Get user IP and store it
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;
            localStorage.setItem('userIP', userIP);
            
            // Show the resume link if there is a saved state
            if (localStorage.getItem(`clozeTextState_${userIP}`)) {
                resumeLink.style.display = 'block';
                resumeLink.href = `#${userIP}`;
            }

            // Load state if the URL contains the user IP
            if (window.location.hash === `#${userIP}`) {
                loadState(userIP);
            }

            // Save state on button clicks
            generateButton.addEventListener('click', () => saveState(userIP));
            resetButton.addEventListener('click', () => saveState(userIP));
            validateWordsButton.addEventListener('click', () => saveState(userIP));
            toggleOriginalTextButton.addEventListener('click', () => saveState(userIP));

            // Load original text when clicking on resume link
            resumeLink.addEventListener('click', (event) => {
                event.preventDefault();
                const savedState = localStorage.getItem(`clozeTextState_${userIP}`);
                if (savedState) {
                    const state = JSON.parse(savedState);
                    originalText.value = state.originalText;
                    clozeText.innerHTML = '';
                    toggleOriginalTextButton.style.display = 'none';
                    validateWordsButton.style.display = 'none';

                    // Afficher le champ de texte avec le texte original
                    document.getElementById('input-container').style.display = 'block';
                    document.getElementById('output-container').style.display = 'none';
                }
            });
        });
});

document.addEventListener('DOMContentLoaded', (event) => {
    // Fonction pour coller le texte depuis le presse-papiers
    document.getElementById('paste-text-btn').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('original-text').value = text;
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    });

    // Supprimer l'ancienne fonction qui proposait de coller en cliquant dans la zone de texte
    document.getElementById('original-text').removeAttribute('onclick');
});

function selectAllText(textareaId) {
    // Récupérer la zone de texte par son ID
    var textarea = document.getElementById(textareaId);
    
    // Vérifier si la zone de texte existe
    if (textarea) {
        // Sélectionner tout le texte dans la zone de texte
        textarea.select();
        
        // Pour certains navigateurs (comme iOS), vous devrez aussi exécuter la commande copy
        document.execCommand('copy');
    }
}

function returnToSelection() {
    // Simuler le clic sur le lien de retour à la sélection
    document.getElementById('resume-link').click();
}

function deleteText(textareaId) {
    // Récupérer la zone de texte par son ID
    var textarea = document.getElementById(textareaId);
    
    // Vérifier si la zone de texte existe
    if (textarea) {
        // Effacer le contenu de la zone de texte
        textarea.value = '';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('remove-linebreaks-btn').addEventListener('click', removeLineBreaks);
});

function removeLineBreaks() {
    var inputText = document.getElementById("original-text").value;
    var outputText = inputText.replace(/(\r\n|\n|\r)/gm, " "); // Pour supprimer tous les sauts de ligne
    document.getElementById("original-text").value = outputText;
}

function removeSomeLineBreaks() {
    var inputText = document.getElementById("original-text").value;
    var outputText = inputText.replace(/([^\r\n])(\r\n|\n|\r)([^\r\n])/g, "$1 $3"); // Pour préserver les paragraphes
    document.getElementById("original-text").value = outputText;
};
// Ajouter des événements au clic sur les boutons de la barre d'outils
document.getElementById('back-to-selection-btn').addEventListener('click', function() {
    returnToSelection();
});

document.getElementById('select-all-btn').addEventListener('click', function() {
    selectAllText('original-text');
});

document.getElementById('delete-text-btn').addEventListener('click', function() {
    deleteText('original-text');
});
document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = document.getElementById('welcome-text');
    const resetButton = document.getElementById('reset');

    // Afficher le texte de bienvenue pendant 10 secondes
    setTimeout(() => {
        welcomeText.style.display = 'none';
    }, 10000);

    // Stocker l'IP de l'utilisateur dans le localStorage
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;
            localStorage.setItem('userIP', userIP);
        });

    // Masquer le texte de bienvenue si l'utilisateur a déjà cliqué sur réinitialiser
    resetButton.addEventListener('click', () => {
        const storedIP = localStorage.getItem('userIP');
        if (storedIP) {
            welcomeText.style.display = 'none';
        }
    });
});
