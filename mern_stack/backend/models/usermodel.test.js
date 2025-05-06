const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('./userModel');
// filepath: mern_stack/backend/models/userModel.test.js

jest.mock('bcrypt');
jest.mock('validator');

describe('User Model Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('signup method', () => {
        test('should throw error if email or password is missing', async () => {
            await expect(User.signup('', 'password')).rejects.toThrow('All fields must be filled');
            await expect(User.signup('email@example.com', '')).rejects.toThrow('All fields must be filled');
        });

        test('should throw error if email is invalid', async () => {
            validator.isEmail.mockReturnValue(false);
            await expect(User.signup('invalid-email', 'Password123!')).rejects.toThrow('Email is not valid');
        });

        test('should throw error if password is not strong enough', async () => {
            validator.isEmail.mockReturnValue(true);
            validator.isStrongPassword.mockReturnValue(false);
            await expect(User.signup('email@example.com', 'weak')).rejects.toThrow('Password not strong enough');
        });

        test('should throw error if email already exists', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'email@example.com' });
            validator.isEmail.mockReturnValue(true);
            validator.isStrongPassword.mockReturnValue(true);
            await expect(User.signup('email@example.com', 'Password123!')).rejects.toThrow('email already in use');
        });

        test('should create a new user if validation passes', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            jest.spyOn(User, 'create').mockResolvedValue({ email: 'email@example.com', password: 'hashedPassword' });

            const user = await User.signup('email@example.com', 'Password123!');
            expect(User.findOne).toHaveBeenCalledWith({ email: 'email@example.com' });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 'salt');
            expect(User.create).toHaveBeenCalledWith({ email: 'email@example.com', password: 'hashedPassword' });
            expect(user).toEqual({ email: 'email@example.com', password: 'hashedPassword' });
        });
    });

    

    describe('login method', () => {
        test('should throw error if email or password is missing', async () => {
            await expect(User.login('', 'password')).rejects.toThrow('All fields must be filled');
            await expect(User.login('email@example.com', '')).rejects.toThrow('All fields must be filled');
        });

        test('should throw error if email is incorrect', async () => {
            User.findOne = jest.fn().mockResolvedValue(null);
            await expect(User.login('wrong@example.com', 'Password123!')).rejects.toThrow('Incorrect email');
        });

        test('should throw error if password is incorrect', async () => {
            const mockUser = { email: 'email@example.com', password: 'hashedPassword' };
            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            await expect(User.login('email@example.com', 'WrongPassword')).rejects.toThrow('Incorrect Password!');
        });

        test('should return user if email and password are correct', async () => {
            const mockUser = { email: 'email@example.com', password: 'hashedPassword' };
            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);

            const user = await User.login('email@example.com', 'Password123!');
            expect(User.findOne).toHaveBeenCalledWith({ email: 'email@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
            expect(user).toEqual(mockUser);
        });
    });
});