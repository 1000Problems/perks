// Ambient declarations for optional runtime deps — `sharp` and
// `@aws-sdk/client-s3`. Both are dynamically imported and only required
// when the image processor or admin upload UI runs. Declaring them as
// loose modules lets typecheck pass without forcing every contributor
// to install ~70MB of native deps just to run the app or tests.
//
// At runtime, the dynamic import either succeeds (deps installed) or
// throws a clear error message in storage.ts / process-image.ts.

declare module "sharp" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp: any;
  export default sharp;
}

declare module "@aws-sdk/client-s3" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const S3Client: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const PutObjectCommand: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const HeadObjectCommand: any;
}
