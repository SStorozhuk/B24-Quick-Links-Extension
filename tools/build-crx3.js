const fs = require("node:fs");
const crypto = require("node:crypto");

function encodeVarint(value) {
  const bytes = [];
  let remainder = BigInt(value);

  while (remainder >= 0x80n) {
    bytes.push(Number((remainder & 0x7fn) | 0x80n));
    remainder >>= 7n;
  }

  bytes.push(Number(remainder));
  return Buffer.from(bytes);
}

function bytesField(fieldNumber, value) {
  const key = encodeVarint((BigInt(fieldNumber) << 3n) | 2n);
  return Buffer.concat([key, encodeVarint(value.length), value]);
}

function uint32LE(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value, 0);
  return buffer;
}

function buildCrx3(zipPath, keyPath, outputPath) {
  const zip = fs.readFileSync(zipPath);
  const privateKey = fs.readFileSync(keyPath);
  const publicKey = crypto.createPublicKey(privateKey);
  const publicKeyDer = publicKey.export({ type: "spki", format: "der" });
  const crxId = crypto.createHash("sha256").update(publicKeyDer).digest().subarray(0, 16);
  const signedHeaderData = bytesField(1, crxId);
  const signedPayload = Buffer.concat([
    Buffer.from("CRX3 SignedData\0", "ascii"),
    uint32LE(signedHeaderData.length),
    signedHeaderData,
    zip
  ]);
  const signature = crypto.sign("sha256", signedPayload, {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  });
  const proof = Buffer.concat([
    bytesField(1, publicKeyDer),
    bytesField(2, signature)
  ]);
  const header = Buffer.concat([
    bytesField(2, proof),
    bytesField(10000, signedHeaderData)
  ]);
  const crx = Buffer.concat([
    Buffer.from("Cr24", "ascii"),
    uint32LE(3),
    uint32LE(header.length),
    header,
    zip
  ]);

  if (!crypto.verify("sha256", signedPayload, publicKey, signature)) {
    throw new Error("CRX3 signature verification failed");
  }

  fs.writeFileSync(outputPath, crx);
}

const [zipPath, keyPath, outputPath] = process.argv.slice(2);

if (!zipPath || !keyPath || !outputPath) {
  process.stderr.write("Usage: node tools/build-crx3.js <extension.zip> <private-key.pem> <output.crx>\n");
  process.exit(1);
}

buildCrx3(zipPath, keyPath, outputPath);
process.stdout.write(`Created ${outputPath}\n`);
