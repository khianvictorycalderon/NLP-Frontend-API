// Memory for conversation and learned words
let memory = [];

// Simple tokenizer
function tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
}

// POS-ish categorizer
function categorize(tokens) {
    const verbs = ["like", "love", "hate", "enjoy", "prefer", "need", "know", "think", "see"];
    const subjects = ["i", "you", "we", "they", "he", "she"];
    const nouns = tokens.filter(t => !verbs.includes(t) && !subjects.includes(t));
    const foundVerbs = tokens.filter(t => verbs.includes(t));
    const foundSubjects = tokens.filter(t => subjects.includes(t));
    return { subjects: foundSubjects, verbs: foundVerbs, nouns: nouns };
}

// Simple ELIZA-style reflections
const reflections = {
    "i": "you",
    "me": "you",
    "my": "your",
    "am": "are",
    "you": "I",
    "your": "my"
};

function reflect(word) {
    return reflections[word] || word;
}

// Dynamic ELIZA-style templates
const templates = [
    "Why do you think {input}?",
    "How does {input} make you feel?",
    "Can you explain why {input}?",
    "What does it mean that {input}?",
    "I see, tell me more about {input}."
];

function dynamicEliza(input) {
    const tokens = tokenize(input);
    const reflected = tokens.map(reflect).join(" ");

    // Pick a random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace("{input}", reflected);
}

// Dynamic NLP sentence generator
function generateDynamicSentence(lastInput) {
    const tokens = tokenize(lastInput);
    memory.push(...tokens); // store words

    const { subjects, verbs, nouns } = categorize(tokens);

    const subj = subjects[0] || ["I", "You", "We"][Math.floor(Math.random() * 3)];
    const verb = verbs[0] || ["like", "enjoy", "think"][Math.floor(Math.random() * 3)];
    const obj = nouns[0] || memory[Math.floor(Math.random() * memory.length)] || "things";

    const connectors = ["and", "but", "so", "because"];
    let sentence = `${capitalize(subj)} ${verb} ${obj}`;

    if (Math.random() > 0.5 && memory.length > 1) {
        const conj = connectors[Math.floor(Math.random() * connectors.length)];
        const extraWord = memory[Math.floor(Math.random() * memory.length)];
        sentence += ` ${conj} ${extraWord}`;
    }

    return sentence + ".";
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Frontend-only API combining dynamic ELIZA + NLP
window.API = {
    generateResponse: (convo) => {
        if (!Array.isArray(convo) || convo.length < 1) return "Hmm… tell me more.";
        const lastInput = convo[convo.length - 1];

        // Randomly choose between dynamic ELIZA or NLP-style
        if (Math.random() > 0.5) {
            return dynamicEliza(lastInput);
        } else {
            return generateDynamicSentence(lastInput);
        }
    }
};