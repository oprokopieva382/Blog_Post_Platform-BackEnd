import { DeviceDTO } from "../DTO";
import { SessionsDBType } from "../cloud_DB/mongo_db_types";
import { DeviceViewModel } from "../type-models";
import { SessionModel } from "../models";

export class DeviceQueryRepository {
  async getAllDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices: SessionsDBType[] = await SessionModel.find({
      userId,
    }).lean();

    return devices.map((d) => DeviceDTO.transform(d));
  }
}
