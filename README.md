# Eval on Cloud

- Based on the work in [this tutorial](https://www.developermindset.com/cloudflare-workers-quickjs-wasm-and-emscripten/)
- Can run any piece of Javascript without async/await
- Can have a piece of data as its context

API:

- Without data: https://evaloncloud.com/eval?code=return%20Object.keys({a:1,b:2,c:3}).length
- With data\*: https://evaloncloud.com/eval?input=https://uithub.com/codefromanywhere/claudeflair&code=return%20Object.keys(data.files)

* when passing data, ensure the URL resolves with a JSON object

Limitations:

- Does seem to get out of memory pretty fast, much faster than a regular cloudflare worker
- Very limited in what you can run
