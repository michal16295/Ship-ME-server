// Declaration of methods here
const POST = "POST";
const GET = "GET";
const PUT = "PUT";

// List of addresses that guest is allowed to visit (not logged in user)
const guest = [
  { url: "/", method: GET },
  { url: "/users/register", method: POST },
  { url: "/users/login", method: POST },
  { url: "/userCompany/userCompanies", method: GET },
  { url: "/api/models/*", method: GET },
];

module.exports.guest = guest;
