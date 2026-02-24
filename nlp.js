window.API = {
    generateResponse: (input) => {
        if (!Array.isArray(input)) {
            console.error("getResponse input is not an array!");
            return "Could not resolve conversation!";
        }

        return "Yey!";
    }
}