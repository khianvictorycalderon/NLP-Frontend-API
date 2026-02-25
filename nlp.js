// Fixed conversation dataset
const preTrainedData = [
    { user: "hi", bot: "Hello! How are you today?" },
    { user: "hello", bot: "Hi there! What’s going on?" },
    { user: "how are you", bot: "I’m doing well, thanks! How about you?" },
    { user: "what is your name", bot: "I am ChatMini, your mini chatbot." },
    { user: "who are you", bot: "I’m a little AI designed to chat with you." },
    { user: "tell me a joke", bot: "Why did the computer go to the doctor? It caught a virus!" },
    { user: "i am sad", bot: "I’m sorry to hear that. Do you want to talk about it?" },
    { user: "i am happy", bot: "That’s great! What made you happy today?" },
    { user: "thank you", bot: "You’re welcome! Anything else you want to discuss?" },
    { user: "bye", bot: "Goodbye! Hope we chat again soon." },
    { user: "what do you do", bot: "I chat with you and learn a little every day." },
    { user: "how old are you", bot: "I don’t have an age, I’m always learning." },
    { user: "favorite color", bot: "I like all colors, but blue seems nice today." },
    { user: "favorite food", bot: "I don’t eat, but I imagine pizza would be fun." },
    { user: "weather", bot: "I don’t feel weather, but is it sunny where you are?" },
    { user: "music", bot: "I like all kinds of music, what about you?" },
    { user: "movie", bot: "I enjoy movie discussions. Seen any good ones lately?" },
    { user: "sports", bot: "I can chat about sports. Who’s your favorite team?" },
    { user: "coding", bot: "I love coding conversations! What language do you like?" },
    { user: "study", bot: "Studying is important! What are you focusing on today?" },
    { user: "game", bot: "I like talking about games. Played anything fun recently?" },
    { user: "travel", bot: "Traveling is amazing! Where would you like to go?" },
    { user: "dream", bot: "Dreams are interesting. Remember anything cool recently?" },
    { user: "pet", bot: "Pets are adorable! Do you have one?" },
    { user: "dog", bot: "Dogs are wonderful! How about your furry friend?" },
    { user: "cat", bot: "Cats are independent and cute! Do you have one?" },
    { user: "science", bot: "Science is fascinating! Learned anything new lately?" },
    { user: "technology", bot: "Tech moves fast! Seen any interesting gadgets?" },
    { user: "book", bot: "Books are great! Read anything good recently?" },
    { user: "art", bot: "Art is amazing. Do you like painting or drawing?" },
    { user: "funny", bot: "Humor makes the day better! Heard any jokes lately?" },
    { user: "hobby", bot: "Hobbies keep life exciting! What’s yours?" },
    { user: "food", bot: "Food is delicious! Tried anything tasty today?" },
    { user: "drink", bot: "I imagine tea or coffee would be nice. Which do you prefer?" },
    { user: "exercise", bot: "Exercise is healthy! Did you move around today?" },
    { user: "news", bot: "News can be interesting. Any headlines caught your attention?" },
    { user: "school", bot: "School can be fun or stressful! How’s it going for you?" },
    { user: "work", bot: "Work keeps us busy. Anything exciting happening there?" },
    { user: "weekend", bot: "Weekends are for relaxing! Any plans?" },
    { user: "holiday", bot: "Holidays are special! Do you have a favorite one?" },
    { user: "party", bot: "Parties are fun! Do you enjoy them?" },
    { user: "birthday", bot: "Birthdays are great! Any celebrations coming up?" },
    { user: "advice", bot: "Advice can help. What do you need guidance on?" },
    { user: "problem", bot: "Problems can be tricky. Want to talk about it?" },
    { user: "idea", bot: "Ideas are exciting! What are you thinking of?" },
    { user: "plan", bot: "Plans help organize things. Got something planned?" },
    { user: "question", bot: "Questions are good! Ask me anything." },
    { user: "language", bot: "Languages are fascinating! Which one do you speak?" },
    { user: "fun", bot: "Fun makes life enjoyable! How are you having fun today?" },
    { user: "learning", bot: "Learning is always valuable! What did you learn today?" },
    { user: "challenge", bot: "Challenges make us stronger! Facing one now?" },
    { user: "story", bot: "Stories are wonderful. Want to tell me one?" },
    { user: "imagine", bot: "Imagination is powerful! What are you imagining?" },
    { user: "dream job", bot: "Your dream job sounds exciting! What is it?" }
];

// Memory for co-occurrence & sentence starts
let memory = {};
let sentenceStarts = [];
let userName = null; // store user's name

preTrainedData.forEach(pair => {
    const tokens = pair.bot.toLowerCase().match(/\b\w+\b/g) || [];
    if (!tokens.length) return;
    sentenceStarts.push(tokens[0]);
    for (let i = 0; i < tokens.length - 1; i++) {
        if (!memory[tokens[i]]) memory[tokens[i]] = {};
        const next = tokens[i + 1];
        memory[tokens[i]][next] = (memory[tokens[i]][next] || 0) + 1;
    }
});

function pickNextWord(word) {
    const options = memory[word];
    if (!options) return null;
    const words = Object.keys(options);
    const counts = Object.values(options);
    const total = counts.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < words.length; i++) {
        r -= counts[i];
        if (r <= 0) return words[i];
    }
    return words[words.length - 1];
}

// Detect user's name
function detectName(input) {
    const match = input.match(/\b(?:i am|i'm|my name is)\s+([A-Z][a-z]*)\b/i);
    if (match) userName = match[1];
}

// Capitalize helper
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate dynamic sentence
function generateSentence(input, maxLength = 15) {
    detectName(input);

    const inputTokens = input.toLowerCase().match(/\b\w+\b/g) || [];
    let start = sentenceStarts[Math.floor(Math.random() * sentenceStarts.length)];
    for (const pair of preTrainedData) {
        if (input.toLowerCase().includes(pair.user)) {
            const tokens = pair.bot.toLowerCase().match(/\b\w+\b/g) || [];
            if (tokens.length > 0) {
                start = tokens[0];
                break;
            }
        }
    }

    let sentence = [start];
    let current = start;

    for (let i = 1; i < maxLength; i++) {
        const next = pickNextWord(current);
        if (!next) break;
        sentence.push(next);
        current = next;
    }

    let finalSentence = capitalize(sentence.join(" "));
    // Inject user's name dynamically
    if (userName) {
        finalSentence = finalSentence.replace(/\b(user|you)\b/gi, userName);
    }

    return finalSentence + ".";
}

// Frontend API
window.API = {
    generateResponse: (convo) => {
        if (!Array.isArray(convo) || convo.length < 1) return "Hmm… tell me more.";
        return generateSentence(convo[convo.length - 1]);
    }
};