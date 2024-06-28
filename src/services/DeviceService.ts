import { ApiError } from "../helper/api-errors";
import { authRepository, deviceRepository } from "../repositories";

class DeviceService {
  async delete(deviceId: string, userId: string) {
    const dbSession = await authRepository.getSessionByDeviceId(deviceId);

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

    return await deviceRepository.removeDevice(deviceId);
  }

  async deleteRest(deviceId: string, userId: string) {
    return await deviceRepository.removeDevices(deviceId, userId);
  }
}
export const deviceService = new DeviceService();
