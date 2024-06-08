import { sessionsCollection } from "../cloud_DB/mongo_db_atlas";

export const devicesRepository = {
  async removeDevice(deviceId: string) {
    return await sessionsCollection.findOneAndDelete({
      deviceId,
    });
  },

  async removeDevices(currentSession: string) {
    return await sessionsCollection.deleteMany({
      deviceId: { $ne: currentSession },
    });
  },
};
