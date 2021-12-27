// mock App service

export const AppService = jest.fn().mockReturnValue({
  getHello: jest
    .fn()
    .mockResolvedValue(
      'Welcome to the *** jamming API ***. See how it works: <a href="http://localhost:5000/api-docs/">http://localhost:5000/api-docs/</a>',
    ),
});
