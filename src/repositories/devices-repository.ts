import { sessionsCollection } from "../cloud_DB/mongo_db_atlas";

export const devicesRepository = {
  async removeDevice(deviceId: string) {
    return await sessionsCollection.findOneAndDelete({
      deviceId,
    });
  },

  async removeDevices(currentSessionDeviceId: string, userId: string) {
    return await sessionsCollection.deleteMany({
      userId,
      deviceId: { $ne: currentSessionDeviceId },
    });
  },
};
