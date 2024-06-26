import { deviceDTO } from "../DTO";
import { SessionsDBType } from "../cloud_DB/mongo_db_types";
import { DeviceViewModel } from "../type-models";
import { SessionModel } from "../models";

export const devicesQueryRepository = {
  async getAllDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices: SessionsDBType[] = await SessionModel.find({
      userId,
    }).lean();

    return devices.map((d) => deviceDTO(d));
  },
};
