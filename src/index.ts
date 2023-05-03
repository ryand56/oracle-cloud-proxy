import express from "express";
const app = express();

type Region = "af-johannesburg-1" | "ap-chuncheon-1" | "ap-hyderabad-1" |
"ap-melbourne-1" | "ap-mumbai-1" | "ap-osaka-1" | "ap-seoul-1" |
"ap-singapore-1" | "ap-sydney-1" | "ap-tokyo-1" | "ca-montreal-1" |
"ca-toronto-1" | "eu-amsterdam-1" | "eu-frankfurt-1" | "eu-madrid-1" |
"eu-marseille-1" | "eu-milan-1" | "eu-paris-1" | "eu-stockholm-1" |
"eu-zurich-1" | "il-jerusalem-1" | "me-abudhabi-1" | "me-dubai-1" |
"me-jeddah-1" | "mx-queretaro-1" | "sa-santiago-1" | "sa-saopaulo-1" |
"sa-vinhedo-1" | "uk-cardiff-1" | "uk-london-1" | "us-ashburn-1" |
"us-chicago-1" | "us-phoenix-1" | "us-sanjose-1";

interface ErrorResponse {
    code: string;
    message: string;
}

interface FileObject {
    name: string;
}

interface ListFilesResponse {
    objects?: FileObject[];
}

// Oracle Cloud variables
const OC_REGION = process.argv[2] as Region;
const OC_NAMESPACE = process.argv[3];
const OC_BUCKET = process.argv[4];

const originUrl = `https://objectstorage.${OC_REGION}.oraclecloud.com/n/${OC_NAMESPACE}/b/${OC_BUCKET}/o/`;

app.get("/", async (req, res) => {
    // List Files
    const result = await fetch(originUrl);

    const ok = result.ok;
    const statusCode = result.status;
    const statusText = result.statusText;
    const body: ListFilesResponse | ErrorResponse = await result.json();

    return res.json(body);
});

app.get("/:file", async (req, res) => {
    // Get File
    const result = await fetch(originUrl + req.params.file);

    const ok = result.ok;
    const statusCode = result.status;
    const statusText = result.statusText;
    const body = result.body;

    return ok ? res.send(body) : res.status(statusCode).send(statusText);
});

app.listen(8080, () => {
    console.log("Running!\n");
    console.log("Region:", OC_REGION);
    console.log("Namespace:", OC_NAMESPACE);
    console.log("Bucket:", OC_BUCKET);
});