// Thin storage abstraction. Cloudflare R2 via the S3-compatible API.
// Keys come from R2_* env vars. When env vars are missing (local dev
// without R2 set up), `available()` returns false and the processor
// falls back to a "would upload" no-op so tests can run.
//
// Swap target: replace the implementation with @vercel/blob if R2 is
// retired. The interface is the part that callers depend on.

interface PutOptions {
  key: string;
  body: Uint8Array;
  contentType: string;
  cacheControl?: string;
}

export interface ImageStorage {
  available: () => boolean;
  put: (opts: PutOptions) => Promise<{ url: string }>;
  exists: (key: string) => Promise<boolean>;
}

function publicUrlFor(key: string): string {
  const base = process.env.R2_PUBLIC_BASE;
  if (!base) throw new Error("R2_PUBLIC_BASE not set");
  const trimmed = base.replace(/\/+$/, "");
  return `${trimmed}/${key}`;
}

class R2Storage implements ImageStorage {
  available(): boolean {
    return Boolean(
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_BASE,
    );
  }

  async put(opts: PutOptions): Promise<{ url: string }> {
    if (!this.available()) {
      throw new Error("R2 storage not configured. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE.");
    }
    // Dynamic import keeps @aws-sdk/client-s3 out of the user-facing
    // bundle — only the admin upload route lands on it. The package is
    // a regular dependency; webpack still resolves it at build time.
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const accountId = process.env.R2_ACCOUNT_ID;
    if (!accountId) throw new Error("R2_ACCOUNT_ID not set");
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: opts.key,
        Body: opts.body,
        ContentType: opts.contentType,
        CacheControl: opts.cacheControl ?? "public, max-age=31536000, immutable",
      }),
    );
    return { url: publicUrlFor(opts.key) };
  }

  async exists(key: string): Promise<boolean> {
    if (!this.available()) return false;
    const { S3Client, HeadObjectCommand } = await import("@aws-sdk/client-s3");
    const accountId = process.env.R2_ACCOUNT_ID!;
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    try {
      await client.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
}

let _storage: ImageStorage | null = null;

export function getStorage(): ImageStorage {
  if (!_storage) _storage = new R2Storage();
  return _storage;
}
