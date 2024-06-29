import { ApiError } from "../helper/api-errors";
import { AuthRepository, DeviceRepository } from "../repositories";

export class DeviceService {
  constructor(
    protected authRepository: AuthRepository,
    protected deviceRepository: DeviceRepository
  ) {}

  async delete(deviceId: string, userId: string) {
    const dbSession = await this.authRepository.getSessionByDeviceId(deviceId);

    if (!dbSession) {
      throw ApiError.NotFoundError("Session not found", [
        `The session for the searched device ID ${deviceId} does not exist.`,
      ]);
    }

    if (userId !== dbSession.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You are not allowed to delete this session.",
      ]);
    }

    return await this.deviceRepository.removeDevice(deviceId);
  }

  async deleteRest(deviceId: string, userId: string) {
    return await this.deviceRepository.removeDevices(deviceId, userId);
  }
}
