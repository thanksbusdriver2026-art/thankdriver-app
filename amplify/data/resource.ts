import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Driver: a.model({
    name: a.string().required(),
    email: a.string().required(),
  })
  .authorization(allow => [
    allow.publicApiKey().to(['read', 'create'])
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
