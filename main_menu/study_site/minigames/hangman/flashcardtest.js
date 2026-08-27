const defaultFlashcards = [
    {
        term: "Photosynthesis",
        def: "The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."
    },
    {
        term: "Mitosis",
        def: "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus."    
    },
    {
        term: "Ecosystem",
        def: "A biological community of interacting organisms and their physical environment."
    },
    {
        term: "Gravity",
        def: "The force that attracts a body toward the center of the earth, or toward any other physical body having mass."
    },
    {
        term: "Evolution",
        def: "The process by which different kinds of living organisms are thought to have developed and diversified from earlier forms during the history of the earth." 
    }
];

const selectedSet = JSON.parse(localStorage.getItem('selectedStudySet'));
const testFlashcard = selectedSet && Array.isArray(selectedSet.cards) && selectedSet.cards.length > 0
    ? selectedSet.cards
    : defaultFlashcards;

