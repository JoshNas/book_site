export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "book-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://6dthky6wfe.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_nemrL5jlg",
    APP_CLIENT_ID: "1v13ulbkc12hpljsb8j7nq0vms",
    IDENTITY_POOL_ID: "us-east-1:f5338bab-03e0-445c-8b8f-952089c09223"
  }
};
