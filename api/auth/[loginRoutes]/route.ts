// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

//We use this function to keep all of our login api routes in one nice little file
export async function POST(
  req: NextRequest,
  { params }: { params: { loginRoutes: string } }
) {
  try {
    switch (params.loginRoutes) {
      case "login":
        return await login(req);
      case "logout":
        return await logout(req);
      default:
        return networkError();
    }
  } catch {
    return networkError();
  }
}

//Returns a random string, used for creating passwords and sessions
function generateString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  return result;
}

//RegExps used in validation
const emailRegExp = new RegExp(
  "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,256})$"
);
const passwordRegExp = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
);

/*  Responses:
 *  These are frequently used responses / error messages in the login system
 */
//Response for when the task completed successfully
function success() {
  return NextResponse.json({
    success: true,
  });
}
//Error for when api route breaks during something like a database operation
function networkError() {
  return NextResponse.json({
    errors: "A network error occurred",
  });
}
//Error for when api route breaks when using a form with a password
function networkErrorPassword() {
  return NextResponse.json({
    errors: { password: "A network error occurred" },
  });
}
//Error for when username / password is not valid
function wrongCredentials() {
  return NextResponse.json({
    errors: { password: "Incorrect username or password" },
  });
}

//Searches our database for a users account and retrieves the values of the inputed fields
// field - the parameter used to search the DB for the account
// value - the value of that parameter
// fields - the name of the fields you want the values of
async function getValues(field: string, value: string, fields: string[]) {
  try {
    let result: Record<string, any> = {};
    /**
     * Implement DB-logic to retrieve the values here, placeholder below
     *
     */
    result.userName = "somebody@gmail.com";
    result.password =
      "$2a$10$rKVzaEJI8uJsbIUbCcMPOu8r57.HJfu4odFFsLqT7ucQt8tWF98mC";
    return result;
  } catch {
    return {};
  }
}

//Searches our database for users account and updates all fields in "update"
// field - the parameter used to search the DB for the account
// value - the value of that parameter
// update - an object with parameter / value pairs
async function updateValues(
  field: string,
  value: string,
  update: Record<string, any>
) {
  try {
    /**
     * Implement DB-logic to update fields here
     *
     */
    return true;
  } catch {
    return false;
  }
}

//Attempts to log user in
async function login(req: NextRequest) {
  try {
    const body = await req.json();
    //Checks if email address and password are valid
    if (!emailRegExp.test(body.email) || !passwordRegExp.test(body.password)) {
      return wrongCredentials();
    }
    //Finds the user's account
    const user = await getValues("email", body.email.toLowerCase(), [
      "password",
    ]);
    if (!user) {
      bcrypt.compare(body.password, "QhU7UmlNS1Cl9ZPQNVUTf9I8hq4Uq9vYHZjSn8YmEVtL5XyG");
      return wrongCredentials();
    }
    //Logs in user if password is correct
    if (await bcrypt.compare(body.password, user.password)) {
      const sessionId = generateString(48);
      await updateValues("email", user.username, { sessionId: sessionId });
      const cookieStore = cookies();
      cookieStore.set({
        name: "sessionId",
        value: sessionId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
      });
      return success();
    } else {
      return wrongCredentials();
    }
  } catch {
    return networkErrorPassword();
  }
}

//Logs the user out
async function logout(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    const newSessionId = generateString(48);
    if (sessionId) {
      await updateValues("sessionId", sessionId, { sessionId: newSessionId });
    }
    cookieStore.delete("sessionId");
    return success();
  } catch {
    return networkError();
  }
}
