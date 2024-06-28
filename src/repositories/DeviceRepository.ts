import { SessionModel } from "../models";

class DeviceRepository {
  async removeDevice(deviceId: string) {
    return await SessionModel.findOneAndDelete({
      deviceId,
    });
  }

  async removeDevices(currentSessionDeviceId: string, userId: string) {
    return await SessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentSessionDeviceId },
    });
  }
}
export const deviceRepository = new DeviceRepository();
