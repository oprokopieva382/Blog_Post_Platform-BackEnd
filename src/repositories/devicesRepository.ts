import { SessionModel } from "../models1";

export const devicesRepository = {
  async removeDevice(deviceId: string) {
    return await SessionModel.findOneAndDelete({
      deviceId,
    });
  },

  async removeDevices(currentSessionDeviceId: string, userId: string) {
    return await SessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentSessionDeviceId },
    });
  },
};
