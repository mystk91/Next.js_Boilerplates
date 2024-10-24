// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

//RegExps used in validation
const emailRegExp = new RegExp(
  "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,256})$"
);
const passwordRegExp = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
);

// Retrieves the account from our database as an object
// field - the parameter used to search the DB for the account, typically "email" or "username"
// value - the value of the field
async function getAccount(field: string, value: string) {
  /**
   * Implement DB-logic to retrieve user here, placeholder below
   *
   */
  let user = {
    username: "somebody@gmail.com",
    password: "$2a$10$rKVzaEJI8uJsbIUbCcMPOu8r57.HJfu4odFFsLqT7ucQt8tWF98mC",
  };
  return user;
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

//Error for when username / password is not valid
function wrongCredentials() {
  return NextResponse.json({
    errors: { password: "Incorrect username or password" },
  });
}

//Error for when api route breaks
function networkError() {
  return NextResponse.json({
    errors: { password: "A network error occurred" },
  });
}

//Response for when the task completed successfully
function success() {
  return NextResponse.json({
    success: true,
  });
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
    const user = await getAccount("email", body.email.toLowerCase());
    if (!user) {
      return wrongCredentials();
    }
    //Logs in user if password is correct
    if (await bcrypt.compare(body.password, user.password)) {
      let session = generateString(48);
      /**
       * Implement DB-logic to update users session parameter here
       *
       */
      const response = success();
      response.cookies.set("sessionId", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    } else {
      return wrongCredentials();
    }
  } catch {
    return networkError();
  }
}

//Logs the user out
async function logout(req: NextRequest) {
  //To be done
}

