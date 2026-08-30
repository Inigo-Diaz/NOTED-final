        const selectedSet = JSON.parse(localStorage.getItem('selectedStudySet'));
        const setName = document.getElementById('setName');
        const setSummary = document.getElementById('setSummary');

        if (selectedSet) {
            const cardCount = Array.isArray(selectedSet.cards) ? selectedSet.cards.length : 0;
            setName.textContent = selectedSet.name || 'Study Set';
            setSummary.textContent = `${cardCount} ${cardCount === 1 ? 'card' : 'cards'} available for study.`;
        } else {
            setSummary.textContent = 'No study set selected.';
        }