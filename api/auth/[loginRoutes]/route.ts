// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

//Different PUT routes related to login / account creation
export async function PUT(
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

//Different POST routes related to login / account creation
export async function POST(
  req: NextRequest,
  { params }: { params: { loginRoutes: string } }
) {
  try {
    switch (params.loginRoutes) {
      case "sendVerification":
        return await sendVerification(req);
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

// Searches a database for an entry and retrieves the values of the inputed fields
// database - the name of the database to search through
// field - the parameter used to search the DB for the account
// value - the value of that parameter
// fields - the name of the fields you want the values of
async function getValues(
  database: string,
  field: string,
  value: string,
  fields: string[]
) {
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

// Searches our database for users account and updates all fields in "update"
// database - the name of the database to search through
// field - the parameter used to search the DB for the account
// value - the value of that parameter
// update - an object with parameter / value pairs
async function updateValues(
  database: string,
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

// Adds entries to a database
// database - the name of the database we're adding entries to
// entries - an array of entries we are adding
async function addEntries(database: string, ...entries: Record<string, any>[]) {
  try {
    /*
     *  Implement DB-logic to add entries to database
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
    const user = await getValues(
      "Accounts",
      "email",
      body.email.toLowerCase(),
      ["password"]
    );
    if (!user) {
      bcrypt.compare(
        body.password,
        "QhU7UmlNS1Cl9ZPQNVUTf9I8hq4Uq9vYHZjSn8YmEVtL5XyG"
      );
      return wrongCredentials();
    }
    //Logs in user if password is correct
    if (await bcrypt.compare(body.password, user.password)) {
      const sessionId = generateString(48);
      await updateValues("Accounts", "email", user.username, {
        sessionId: sessionId,
      });
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
      await updateValues("Accounts", "sessionId", sessionId, {
        sessionId: newSessionId,
      });
    }
    cookieStore.delete("sessionId");
    return success();
  } catch {
    return networkError();
  }
}

//Attempts to send a verification email to user
async function sendVerification(req: NextRequest) {
  try {
    //Checking if credentials are valid
    const body = await req.json();
    let errors = {
      email: "",
      password: "",
    };
    if (!emailRegExp.test(body.email)) {
      errors.email = `Invalid email`;
    }
    if (!passwordRegExp.test(body.password)) {
      errors.password = `Make your password stronger`;
    } else if (body.password !== body.verifyPassword) {
      errors.password = `Passwords do not match`;
    }
    if (errors.email || errors.password) {
      return NextResponse.json({
        errors: { email: errors.email, password: errors.password },
      });
    }
    //Checks to see if account already exists
    let duplicateAccount = await getValues("Accounts", "email", body.email, [
      "email",
    ]);
    if (duplicateAccount) {
      //Returns a false positive but doesn't send any emails
      return success();
    } else {
      const verificationCode = generateString(32);
      bcrypt.hash(body.password, 10, async (err, hashedPassword) => {
        try {
          const user = {
            email: body.email.toLowerCase(),
            password: hashedPassword,
            code: verificationCode,
            date: Date.now(),
          };
          await addEntries("Unverifieds", user);
        } catch (err) {
          return networkError();
        }
      });
      const transporter = nodemailer.createTransport({
        /*
         *  Add Email Provider Here
         */
      });
      const mailOptions = {
        from: `"Website" <noreply@website.com>`,
        to: body.email,
        subject: "Website Email Verification",
        html: `
        </p> Welcome to Website! Click below to finish creating your account. </p> <br>
        <a href='${process.env.protocol}${process.env.domain}/verify/${verificationCode}'>Verify Email</a></p>
        `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return networkError();
        } else {
          return success();
        }
      });
    }
  } catch {
    return networkError();
  }
}
