window.API = {
    generateResponse: (convo) => {
        if (!Array.isArray(convo) || convo.length < 1) {
            return "I don't know what you are talking about.";
        }

        console.log(convo);
        return "Yey!";
    }
};