document.addEventListener('DOMContentLoaded', function () {
    const generateClozeBtn = document.getElementById('generate-cloze');
    const originalText = document.getElementById('original-text');
    const clozeText = document.getElementById('cloze-text');

    generateClozeBtn.addEventListener('click', function () {
        const text = originalText.value;
        const words = text.split(' ');

        clozeText.innerHTML = '';

        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word;
            span.addEventListener('click', () => {
                span.classList.toggle('hidden-word');
            });
            clozeText.appendChild(span);
            clozeText.appendChild(document.createTextNode(' ')); // Adds space between words
        });
    });
});