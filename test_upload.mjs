import fs from "fs";

async function testUpload() {
  const blob = new Blob([new Uint8Array(fs.readFileSync("package.json"))], {
    type: "text/plain",
  });
  const formData = new FormData();
  formData.append("file", blob, "test.txt");

  const res = await fetch("https://api.kientrucmaihuong.com/api/upload", {
    method: "POST",
    body: formData,
  });

  const status = res.status;
  const text = await res.text();
  console.log("STATUS:", status);
  console.log("RESPONSE:", text);
}

testUpload();
