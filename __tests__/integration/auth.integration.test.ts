import { ConnectMongoDB } from "../../src/cloud_DB";
import { authService, emailService } from "../../src/services";
import { user } from "./seeder";
import { ObjectId } from "mongodb";
import { dropCollections } from "../e2e/dropCollections";
import { ApiError } from "../../src/helper/api-errors";

describe("auth tests", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    //await dropCollections();
  });

  describe("USER REGISTRATION", () => {
    const registerUser = authService.registerUser;

    emailService.sendEmail = jest
      .fn()
      .mockImplementation((email: string, code: string) => {
        return true;
      });

    it("1- should register user and return status code 204", async () => {
      const result = await registerUser(user);

      expect(result).toEqual({
        _id: expect.any(ObjectId),
        login: user.login,
        email: user.email,
        password: expect.any(String),
        createdAt: expect.any(String),
        emailConfirmation: {
          confirmationCode: expect.any(String),
          expirationDate: expect.any(Date),
          isConfirmed: false,
        },
      });

      expect(emailService.sendEmail).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it("2- shouldn't register user and if the user with the given email or login already exists return status code 400", async () => {
      await registerUser(user);
      try {
        await registerUser(user);
      } catch (error) {
        //console.log("Caught error:", error);
        const apiError = error as ApiError;
        expect(apiError).toBeDefined();
        expect(apiError.status).toBe(400);
        expect(apiError.errorsMessages).toBeDefined();
        expect(apiError.errorsMessages).toHaveLength(1);
        expect(apiError.errorsMessages[0]).toBe(
          "Registration failed. User already exists."
        );
      }
    });
  });

  describe("USER REGISTRATION CONFIRMATION", () => {
    const registerUser = authService.registerUser;

    emailService.sendEmail = jest
      .fn()
      .mockImplementation((email: string, code: string) => {
        return true;
      });

    it("1- should confirm user registration and return status code 204", async () => {
      const result: any = await registerUser(user);

      expect(result.emailConfirmation).toBeDefined();
      const data = {
        code: result.emailConfirmation.confirmationCode,
      };
      const userConfirmed = await authService.confirmUser(data);

      expect(userConfirmed?.emailConfirmation.isConfirmed).toBe(true);
    });

    it.skip("2- shouldn't confirm user registration if the confirmation code is incorrect, expired or already been applied & return status code 400", async () => {});
  });
});
