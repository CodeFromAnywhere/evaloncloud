import { shouldInterruptAfterDeadline } from "quickjs-emscripten";

import type { QuickJSWASMModule } from "quickjs-emscripten";
import {
  newQuickJSWASMModule,
  DEBUG_SYNC as baseVariant,
  newVariant,
} from "quickjs-emscripten";
import cloudflareWasmModule from "./DEBUG_SYNC.wasm";
import cloudflareWasmModuleSourceMap from "./DEBUG_SYNC.wasm.map.txt";

const cloudflareVariant = newVariant(baseVariant, {
  wasmModule: cloudflareWasmModule,
  wasmSourceMapData: cloudflareWasmModuleSourceMap,
});

let QuickJS: QuickJSWASMModule | undefined;

addEventListener("fetch", async (event) => {
  event.respondWith(serverResponse(event));
});

const getCodeString = async (urlOrString: string) => {
  if (urlOrString.startsWith("https://") || urlOrString.startsWith("http://")) {
    const codeResponse = await fetch(urlOrString);
    if (!codeResponse.ok) {
      return new Response(await codeResponse.text(), {
        status: codeResponse.status,
      });
    }

    const codeString = await codeResponse.text();
    return codeString;
  }

  return urlOrString;
};

const serverResponse = async (event: FetchEvent) => {
  try {
    const url = new URL(event.request.url);
    const input = url.searchParams.get("input");
    const code = url.searchParams.get("code");
    if (!code) {
      return new Response(
        "Please provide ?code=URL&input=URL to run code with input.",
        { status: 400 },
      );
    }

    const codeString = await getCodeString(code);
    let inputString = "";
    if (input) {
      const inputResponse = await fetch(input, {
        headers: { accept: "application/json" },
      });
      if (!inputResponse.ok) {
        return new Response(await inputResponse.text(), {
          status: inputResponse.status,
        });
      }
      inputString = await inputResponse.text();
    }

    QuickJS = await newQuickJSWASMModule(cloudflareVariant);

    const runtime = QuickJS.newRuntime({
      interruptHandler: shouldInterruptAfterDeadline(Date.now() + 60000),
      maxStackSizeBytes: 0,
      memoryLimitBytes: 1024 * 1024 * 100,
    });

    const vm = runtime.newContext();

    const rawHandle = vm.newString(inputString);
    rawHandle.consume((handle) => vm.setProp(vm.global, "raw", handle));

    // Eval code in a way that you always have access to "data" and must pass `return something`
    const result = vm.evalCode(`(()=>{

      function inputFn(data){
      ${codeString}
      }

      const data = JSON.parse(raw);

      return JSON.stringify(inputFn(data),undefined,2);
    })()`);

    const resolvedHandle = vm.unwrapResult(result);
    const final = vm.getString(resolvedHandle);

    return new Response(final, {
      headers: { "content-type": "application/json;charset=utf8" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(`Something went wrong: ${e.message}`, { status: 500 });
  }
};
