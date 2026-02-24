# NLP Frontend API
by Khian Victory D. Calderon

## Usage (For vanilla HTML)
1. In your javascript file:
    ```js
    fetch("https://khianvictorycalderon.github.io/NLP-Frontend-API/nlp.js")
        .then(data => data.json)
        .then(data => {
            eval(data);
        });
    ```

## Usage (For React Typescript)
1. Create `src/global.d.ts`:
    ```ts
    export {}; // ensures this file is treated as a module

    declare global {
        interface Window {
            API: {
                generateResponse: (input: string[]) => string;
            };
        }
    }
    ```
2. Then in your `App.tsx` (Using axios):
    ```ts
    const res = await axios.get("https://khianvictorycalderon.github.io/NLP-Frontend-API/nlp.js");
    eval(res.data);

    const conversation = window.API.getResponse(["Hi there"]);
    ```