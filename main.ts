/*

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "code": "(n, index, array) => n * n",
    "item": 5,
    "index": 4,
    "array": [1, 2, 3, 4, 5]
  }' \
  https://test-deno-96-2cgrydzhqbd3.deno.dev

  // {"result": 25}


  A PROMISE ALSO WORKS

  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "code": "async (n, index, array) => { 
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      return n * n; 
    }",
    "item": 5,
    "index": 4,
    "array": [1, 2, 3, 4, 5]
  }' \
  https://test-deno-96-xw3dmmrgsn1m.deno.dev

*/

Deno.serve(async (request: Request) => {
  try {
    const {
      code,
      item,
      index,
      array,
    }: { code: string; item: any; index: number; array: any[] } =
      await request.json();

    if (
      code === undefined ||
      item === undefined ||
      index === undefined ||
      array === undefined
    ) {
      return new Response(
        JSON.stringify({
          status: 400,
          result: undefined,
        }),
        { status: 400 },
      );
    }

    const fullCode = `(async () => {
  try {
    const fn = ${code};
    return {
      status: 200,
      result: await fn(${JSON.stringify(item)}, ${index}, ${JSON.stringify(
      array,
    )})
    };
  } catch (err) {
    return {
      status: err.cause || 500,
      result: undefined,
      error: err.message
    };
  }
})()`;

    const evaluated = await eval(fullCode);
    console.log({ fullCode, evaluated });

    return new Response(JSON.stringify(evaluated), {
      status: evaluated.status,
    });
  } catch (e: any) {
    console.error(e);
    return new Response(
      JSON.stringify({
        status: e.cause || 500,
        result: undefined,
      }),
      { status: e.cause || 500 },
    );
  }
});
