    /*
        Data structure:

        {
            "set-id": {
                name: "Biology",
                cards: [
                    {
                        term: "...",
                        definition: "..."
                    }
                ]
            }
        }
    */



            const flashcard = document.createElement("div");

            flashcard.className = "flashcard";


            const subtitle =
                document.createElement("span");

            subtitle.className =
                "card-subtitle";

            subtitle.innerText =
                "Click to Flip";


            const text =
                document.createElement("div");

            text.className =
                "card-text";

            text.innerText =
                card.term;


            flashcard.appendChild(subtitle);

            flashcard.appendChild(text);


            flashcard.dataset.term =
                card.term;

            flashcard.dataset.definition =
                card.definition;


            flashcard.addEventListener(
                "click",
                () => flipCard(flashcard)
            );


            const actions =
                document.createElement("div");

            actions.className =
                "card-actions";


            const editButton =
                document.createElement("button");

            editButton.className =
                "btn-edit";

            editButton.innerText =
                "Edit";


            editButton.addEventListener(
                "click",
                () => editCard(index)
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "btn-delete";

            deleteButton.innerText =
                "Delete";


            deleteButton.addEventListener(
                "click",
                () => deleteCard(index)
            );


            actions.appendChild(editButton);

            actions.appendChild(deleteButton);


            wrapper.appendChild(flashcard);

            wrapper.appendChild(actions);

















            


      window.addEventListener('DOMContentLoaded', () => {
      // 1. Retrieve the stringified data using the key
      const savedDataString = localStorage.getItem('flashcardSets');

      // 2. Check if the data actually exists
      if (savedDataString) {
          // 3. Parse the string back into a JavaScript object
          const userData = JSON.parse(savedDataString);

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

          // 4. Use the data to update your HTML elements
      } else {
          console.log("No user data found in localStorage.");
      }
});