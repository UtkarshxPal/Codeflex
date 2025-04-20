// const { expressjwt: jwt } = require("express-jwt");
// const jwksRsa = require("jwks-rsa");

// const checkJwt = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://dev-xxypqz17owod60e4.us.auth0.com/.well-known/jwks.json`,
//   }),

//   audience: "http://localhost:3000/",
//   issuer: `https://dev-xxypqz17owod60e4.us.auth0.com/`,
//   algorithms: ["RS256"],
// });

// module.exports = checkJwt;

const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  audience: "http://localhost:3000/",
  issuerBaseURL: "https://dev-xxypqz17owod60e4.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

module.exports = jwtCheck;
