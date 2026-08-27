// Locks in variables

    const flashcardForm = document.getElementById('flashcardForm');
    const yourNotes = document.getElementById('yourNotes');

    const yourTerm = document.getElementById('yourTerm');
    const yourDef = document.getElementById('yourDef');

    const editIndex = document.getElementById('editIndex');

    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');

    const setsContainer = document.getElementById('setsContainer');

    const setLibrary = document.getElementById('notesArea');
    const flashcardArea = document.getElementById('flashcardArea');

    const currentSetTitle = document.getElementById('currentSetTitle');

    const setModal =
        document.getElementById('setPopUp');
    const setNameInput =
        document.getElementById('setNameInput');


    /* ----------------------------------Load flashcard set--------------------------*/


    let flashcardSets =
        JSON.parse(localStorage.getItem('flashcardSets'));


    let currentSetId = null;


    /*----------------------------------Save flashcard data----------------------------*/

    function saveSets() {

        localStorage.setItem(
            'flashcardSets',
            JSON.stringify(flashcardSets)
        );
    }


    /* =====================================
       CREATE SET MODAL
    ===================================== */

    function createSetPopup() {

        setNameInput.value = "";

        setModal.style.display = "flex";

        setTimeout(() => {
            setNameInput.focus();
        }, 100);

    }


    function closePopup() {

        setModal.style.display = "none";

    }


    /* =====================================
       CREATE SET
    ===================================== */

    function createSet() {

        const name =
            setNameInput.value.trim();

        if (!name) {

            alert("Please enter a name for your set.");

            return;

        }

        const id =
            "set-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8);

        flashcardSets[id] = {
            name: name,
            cards: []
        };
        saveSets();
        closePopup();
        renderSets();
        openSet(id);
    }


    /* =====================================
       RENDER SET LIBRARY
    ===================================== */

    function renderSets() {
        setsContainer.innerHTML = "";
        const setIds =
            Object.keys(flashcardSets);
        if (setIds.length === 0) {
            setsContainer.innerHTML = `
                <div>
                    You don't have any flashcard sets yet.
                    <br><br>
                    Click <strong>+ New Notes</strong> to get started.
                </div>
            `;
            return;
        }

        setIds.forEach(id => {
            const set =
                flashcardSets[id];
            const cardCount =
                set.cards.length;
            const card =
                document.createElement("div");

            card.className = "set-card";


            if (id === currentSetId) {

                card.classList.add("active");

            }


            card.innerHTML = `

                <h3>${escapeHTML(set.name)}</h3>

                <p>
                    ${cardCount}
                    ${cardCount === 1 ? "card" : "cards"}
                </p>

                <div class="set-actions">

                    <button
                        class="rename-set-btn"
                        onclick="renameSet(event, '${id}')">
                        <img src="../../../aesthetic_tools/images/icons/Edit.png" alt="rename">
                        Rename
                    </button>

                    <button
                        class="delete-set-btn"
                        onclick="deleteSet(event, '${id}')">
                        Delete
                    </button>

                </div>
            `;


            card.addEventListener("click", () => {

                openSet(id);

            });


            setsContainer.appendChild(card);

        });

    }


    /* =====================================
       OPEN SET
    ===================================== */

    function openSet(id) {

        currentSetId = id;

        const set =
            flashcardSets[id];


        if (!set) return;

        setLibrary.style.display = "none";

        flashcardArea.style.display = "block";

        currentSetTitle.innerText = set.name;

        resetCardForm();

        renderCards();

    }


    /* =====================================
       RETURN TO SET LIBRARY
    ===================================== */

    function exitCurrent() {

        currentSetId = null;

        flashcardArea.style.display = "none";

        setLibrary.style.display = "block";

        resetCardForm();

        renderSets();

    }


    /* =====================================
       RENDER FLASHCARDS
    ===================================== */

    function renderCards() {

        yourNotes.innerHTML = "";


        if (!currentSetId) return;


        const cards =
            flashcardSets[currentSetId].cards;


        if (cards.length === 0) {

            yourNotes.innerHTML = `
                <div class="no-cards">
                    No flashcards yet.
                    <br><br>
                    Add one above!
                </div>
            `;

            return;

        }


        cards.forEach((card, index) => {

            const wrapper = document.createElement("div");

            wrapper.className = "flashcard-wrapper";

            wrapper.innerHTML = `
            <div class="flashcard-item" onclick="flipCard(this)">
                <span class="card-subtitle">Click to Flip</span>
                <div class="card-text">${card.term}</div>
            </div>
            <div class="card">
              <div class="edit-button">
                <button onclick="editCard(${index})">Edit</button>
              </div>
              <div class="delete-button">
                <button onclick="deleteCard(${index})">Delete</button>
              </div>
            </div>
        `;

        // Store actual data items on the DOM node when flipping to view cards
        wrapper.querySelector('.flashcard-item').dataset.term = card.term;
        wrapper.querySelector('.flashcard-item').dataset.definition = card.definition;



            yourNotes.appendChild(wrapper);

        });

    }


    /* =====================================
       FLIP CARD
    ===================================== */

    function flipCard(card) {

        const textElement =
            card.querySelector(".card-text");


        card.classList.toggle("flipped");


        if (card.classList.contains("flipped")) {

            textElement.innerText =
                card.dataset.definition;

        } else {

            textElement.innerText =
                card.dataset.term;

        }

    }


    /* =====================================
       ADD / EDIT CARD
    ===================================== */

    flashcardForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            if (!currentSetId) {

                alert("Please select a flashcard set first.");

                return;

            }


            const term =
                yourTerm.value.trim();

            const definition =
                yourDef.value.trim();


            const index =
                editIndex.value;


            const cards =
                flashcardSets[currentSetId].cards;


            if (index === "") {

                /*
                    ADD CARD
                */

                cards.push({

                    term: term,

                    definition: definition

                });

            } else {

                /*
                    UPDATE CARD
                */

                cards[index] = {

                    term: term,

                    definition: definition

                };

            }


            saveSets();

            resetCardForm();

            renderCards();

            renderSets();

        }
    );


    /* =====================================
       EDIT CARD
    ===================================== */

    function editCard(index) {

        const card =
            flashcardSets[currentSetId].cards[index];


        yourTerm.value =
            card.term;

        yourDef.value =
            card.definition;


        editIndex.value =
            index;


        formTitle.innerText =
            "Edit Flashcard";

        submitBtn.innerText =
            "Save Changes";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* =====================================
       DELETE CARD
    ===================================== */

    function deleteCard(index) {

        if (!confirm(
            "Are you sure you want to delete this flashcard?"
        )) {

            return;

        }


        flashcardSets[currentSetId].cards.splice(
            index,
            1
        );


        saveSets();

        renderCards();

        renderSets();

    }


    /* =====================================
       RESET CARD FORM
    ===================================== */

    function resetCardForm() {

        flashcardForm.reset();

        editIndex.value = "";

        formTitle.innerText =
            "Add New Flashcard";

        submitBtn.innerText =
            "Add Card";

    }


    /* =====================================
       RENAME SET
    ===================================== */

    function renameSet(event, id) {

        event.stopPropagation();


        const currentName =
            flashcardSets[id].name;


        const newName =
            prompt(
                "Enter a new name for this set:",
                currentName
            );


        if (!newName) return;


        const trimmedName =
            newName.trim();


        if (!trimmedName) return;


        flashcardSets[id].name =
            trimmedName;


        saveSets();

        renderSets();


        if (currentSetId === id) {

            currentSetTitle.innerText =
                trimmedName;

        }

    }


    /* =====================================
       DELETE SET
    ===================================== */

    function deleteSet(event, id) {

        event.stopPropagation();


        const set =
            flashcardSets[id];


        const confirmed =
            confirm(
                `Delete "${set.name}" and all ${set.cards.length} flashcards inside it?`
            );


        if (!confirmed) return;


        delete flashcardSets[id];


        saveSets();


        if (currentSetId === id) {

            showSetLibrary();

        } else {

            renderSets();

        }

    }


    /* =====================================
       ESCAPE HTML
       Prevents HTML being injected into
       set names.
    ===================================== */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }


    /* =====================================
       CLOSE MODAL WHEN CLICKING OUTSIDE
    ===================================== */

    setModal.addEventListener(
        "click",
        function(e) {

            if (e.target === setModal) {

                closePopup();

            }

        }
    );


    /* =====================================
       ENTER KEY CREATES SET
    ===================================== */

    setNameInput.addEventListener(
        "keydown",
        function(e) {

            if (e.key === "Enter") {

                e.preventDefault();

                createSet();

            }

        }
    );


    /* =====================================
       INITIAL LOAD
    ===================================== */

    renderSets();