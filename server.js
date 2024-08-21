import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

Deno.serve(async (request) => {
  const pathname = new URL(request.url).pathname;
  console.log(`パス: ${pathname}`);
  
  if (request.method === "POST" && pathname === "/api/hello") {
    try {
      const data = await request.json();
      console.log("受信したデータ:", data);

      // 処理後のレスポンスを返す
      return new Response(JSON.stringify({
          result: 'データが正常に送信されました'
      }));
    } catch (error) {
      console.error("データの処理中にエラーが発生しました:", error);
      return new Response("データの処理中にエラーが発生しました", { status: 500 });
    }
  }

  // 静的ファイルを提供する
  return serveDir(request, {
    fsRoot: "./public/",
    urlRoot: "",
    enableCors: true,
  });
});
