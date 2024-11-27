# Eval on Cloud

- Based on the work in [this tutorial](https://www.developermindset.com/cloudflare-workers-quickjs-wasm-and-emscripten/)
- Can run any piece of Javascript without async/await
- Can have a piece of data as its context

API:

- Without data: https://evaloncloud.com/?code=return%20Object.keys({a:1,b:2,c:3}).length
- With data: https://evaloncloud.com/?input=https://uithub.com/codefromanywhere/claudeflair&code=return%20Object.keys(data.files)
