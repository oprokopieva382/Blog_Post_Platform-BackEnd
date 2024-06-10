import { sessionsCollection } from "../cloud_DB/mongo_db_atlas";
import { SessionsDBType } from "../cloud_DB/mongo_db_types";
import { DeviceViewModel } from "../models";

export const devicesQueryRepository = {
  async getAllDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices: SessionsDBType[] = await sessionsCollection
      .find({ userId })
      .toArray();
    const devicesToView = devices.map((d) => this._deviceDTO(d));

    return devicesToView;
  },

  _deviceDTO(device: SessionsDBType): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.deviceName,
      lastActiveDate: device.iat,
      deviceId: device.deviceId,
    };
  },
};
