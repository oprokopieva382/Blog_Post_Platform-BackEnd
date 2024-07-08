import { injectable } from "inversify";
import { SessionModel } from "../models";

@injectable()
export class DeviceRepository {
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
