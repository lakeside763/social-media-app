import mongoose from "mongoose";
import User from "../models/user";
import clientRequest from "./client";
import { redisClient, server } from "../server";
import notificationQueue from "../queues/notification.queue";

describe('user test', () => {

  beforeAll(async () => {
    await mongoose.connect(`${process.env.DB_URI}`)
    
  });

  afterEach(async () => {
    await User.deleteMany({});
  })

  test('true is truthy', () => {
    console.log(process.env.DB_URI)
    expect(true).toBeTruthy()
  })

  test('should create new user', async () => {
    const userData = {
      firstName: "James",
      lastName: "Smith",
      username: 'testuser',
      password: 'password123'
    };

    const response = await clientRequest('/users', 'post', userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('firstName', 'James');
  })

  afterAll(async () => {
    await mongoose.disconnect();
    await redisClient.quit();
    await notificationQueue.close();
    server.close()
    jest.clearAllMocks();
  }) 

})