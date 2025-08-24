class NatsWrapper {
  client = {
    publish: jest
      .fn()
      .mockImplementation(
        (subjcet: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  };
}

export const natsWrapper = new NatsWrapper();
