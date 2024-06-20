import { deviceDTO } from "../DTO";
import { sessionsCollection } from "../cloud_DB/mongo_db_atlas";
import { SessionsDBType } from "../cloud_DB/mongo_db_types";
import { DeviceViewModel } from "../models";

export const devicesQueryRepository = {
  async getAllDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices: SessionsDBType[] = await sessionsCollection
      .find({ userId })
      .toArray();
    const devicesToView = devices.map((d) => deviceDTO(d));

    return devicesToView;
  },
};
