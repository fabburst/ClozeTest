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
