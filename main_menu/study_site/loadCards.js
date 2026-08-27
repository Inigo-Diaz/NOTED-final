    const setsContainer = document.getElementById('setsContainer');

    const flashcardSets =
        JSON.parse(localStorage.getItem('flashcardSets')) || {};

    function escapeHTML(value) {
        const element = document.createElement('div');
        element.textContent = value;
        return element.innerHTML;
    }

    function renderSets() {
        const setIds = Object.keys(flashcardSets);

        if (setIds.length === 0) {
            setsContainer.innerHTML = `
                <div>
                    You don't have any flashcard sets yet.
                </div>
            `;
            return;
        }

        setsContainer.innerHTML = setIds.map(id => {
            const set = flashcardSets[id];
            const cardCount = Array.isArray(set.cards) ? set.cards.length : 0;

            return `
                <div class="set-card" data-set-id="${escapeHTML(id)}">
                    <h3>${escapeHTML(set.name)}</h3>
                    <p>
                        ${cardCount}
                        ${cardCount === 1 ? "card" : "cards"}
                    </p>
                </div>
            `;
        }).join('');

        setsContainer.querySelectorAll('.set-card').forEach(card => {
            card.addEventListener('click', () => {
                const selectedSet = flashcardSets[card.dataset.setId];

                localStorage.setItem(
                    'selectedStudySet',
                    JSON.stringify(selectedSet)
                );
                window.location.href = 'minigames/minigames_menu.html';
            });
        });
    }

    renderSets();