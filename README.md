# Eval on Cloud

> A Simple JS Cloud Runtime API For Your AI Agent

- Based on the work in [this tutorial](https://www.developermindset.com/cloudflare-workers-quickjs-wasm-and-emscripten/)
- Can run any piece of Javascript without async/await
- Can have a piece of data as its context

Usecases

- Allow your AI Agent to execute code:
  - process data
  - verify a piece of code to work
  - create a frontend that also has some 'backend', dynamically

API:

- https://evaloncloud.com/CODE
- https://evaloncloud.com/CODE-URL
- https://evaloncloud.com/CODE?input=JSON-URL

Examples:

- Without data`*`: https://evaloncloud.com/return%20Object.keys({a:1,b:2,c:3}).length
- With data`**`: https://evaloncloud.com/return%20Object.keys(data.files)?input=https://uithub.com/codefromanywhere/claudeflair

`*` = the code can also be a URL resolving to a piece of JS

`**` = when passing data, ensure the URL resolves with a JSON object

Limitations:

- Does seem to get out of memory pretty fast, much faster than a regular cloudflare worker
- Very limited in what you can run

## Ideas:

# Search + Generate Code

An API such as: https://evaloncloud.com/do/NL_Descriptor/from/URL that would use vector search + LLM for matching. If match, use that code. If no match, generate new code and use that, adding it to the vector.

The input format matters though. Let's think about how I can ensure the right format is there before it applies the function. I feel like we need Myelin: a normalisation of any datastructure into a more generic format.
