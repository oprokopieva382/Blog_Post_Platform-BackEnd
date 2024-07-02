import { SessionsDBType } from "../cloud_DB";
import { DeviceViewModel } from "../type-models";

class DeviceDTO {
  static transform(device: SessionsDBType): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.deviceName,
      lastActiveDate: device.iat,
      deviceId: device.deviceId,
    };
  }
}
export { DeviceDTO };
