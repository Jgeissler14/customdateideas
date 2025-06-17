# customdateideas

This project now uses **Next.js** so it can be exported as a static site and hosted on Amazon S3. A sample AWS Lambda function is included for generating date ideas via the OpenAI API.

## Development

```bash
npm install
npm run dev
```

## Build & Export

To generate the static files that can be uploaded to S3:

```bash
npm run build
```

The exported site will be in the `out/` directory.

## AWS Lambda

The `lambda/generateDateIdeas.ts` file contains a handler compatible with AWS Lambda. Deploy this function and configure an API Gateway endpoint. Update the frontend to call the endpoint instead of the default API route if hosting the site on S3.
