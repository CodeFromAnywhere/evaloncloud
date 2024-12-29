This Deno server makes use of the fact that Deno Deploy allows the use of `eval`. It takes an (asynchronous) map function and an item, index, array, and executes it as if it were a map. It will await promises and also handle errors nicely by assuming the Error cause is the status.

Previous eval experiments:

- [v1 - Run untrusted code using QuickJS WASM on Cloudflare](https://github.com/codefromanywhere/evaloncloud-v1)
- [v2 - Eval untrusted code from URL on Deno with caching](https://github.com/codefromanywhere/evaloncloud-v2)

[Docs](https://codefromanywhere_evaloncloud.githuq.com/index.html)
