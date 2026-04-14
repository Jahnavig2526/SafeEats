const base = "http://localhost:4000";
const email = `demo.${Date.now()}@safeeats.app`;
const password = "Secret123!";

const asJson = (x) => JSON.stringify(x);

const post = async (path, body, headers = {}) => {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: asJson(body),
  });

  const text = await response.text();
  let data = { raw: text };
  try {
    data = JSON.parse(text);
  } catch {}

  return { status: response.status, ok: response.ok, data };
};

const get = async (path, headers = {}) => {
  const response = await fetch(`${base}${path}`, { headers });
  const text = await response.text();
  let data = { raw: text };
  try {
    data = JSON.parse(text);
  } catch {}

  return { status: response.status, ok: response.ok, data };
};

const run = async () => {
  const health = await get("/health");
  const send = await post("/auth/send-otp", { email });
  const otp = send.data.devOtp;

  const verify = await post("/auth/verify-otp", { email, token: otp });
  const verificationToken = verify.data.verificationToken;

  const register = await post("/auth/register", { email, password, verificationToken });
  const login = await post("/auth/login", { email, password, verificationToken });

  const accessToken = login.data.accessToken;
  const me = await get("/auth/me", { authorization: `Bearer ${accessToken}` });

  const result = {
    email,
    health,
    sendOtp: {
      status: send.status,
      ok: send.ok,
      message: send.data.message,
      hasDevOtp: Boolean(otp),
    },
    verifyOtp: {
      status: verify.status,
      ok: verify.ok,
      hasVerificationToken: Boolean(verificationToken),
    },
    register: {
      status: register.status,
      ok: register.ok,
      message: register.data.message,
    },
    login: {
      status: login.status,
      ok: login.ok,
      hasAccessToken: Boolean(login.data.accessToken),
      hasRefreshToken: Boolean(login.data.refreshToken),
    },
    me: {
      status: me.status,
      ok: me.ok,
      user: me.data.user || null,
    },
  };

  console.log(JSON.stringify(result, null, 2));
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
