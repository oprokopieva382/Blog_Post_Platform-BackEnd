import { ApiError } from "../helper/api-errors";
import { authRepository, devicesRepository } from "../repositories";

export const devicesService = {
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

    return await devicesRepository.removeDevice(deviceId);
  },

  async deleteRest(deviceId: string, userId: string) {
    return await devicesRepository.removeDevices(deviceId, userId);
  },
};
