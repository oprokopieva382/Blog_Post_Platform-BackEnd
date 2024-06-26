import { SessionsDBType } from "../cloud_DB";
import { DeviceViewModel } from "../type-models";

export const deviceDTO = (device: SessionsDBType): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.deviceName,
    lastActiveDate: device.iat,
    deviceId: device.deviceId,
  };
};
