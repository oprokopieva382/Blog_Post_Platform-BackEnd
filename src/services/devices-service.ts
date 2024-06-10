import { jwtTokenService } from "../features/application";
import { ApiError } from "../helper/api-errors";
import { authRepository, devicesRepository } from "../repositories";

export const devicesService = {
  async delete(deviceId: string, refreshToken: string) {
    const token = await jwtTokenService.decodeToken(refreshToken);
    const currentSession = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    const isSessionExist = await authRepository.getSessionByDeviceId(deviceId);

    if (!isSessionExist) {
      throw ApiError.NotFoundError("Session not found", [
        `The session for the searched device ID ${deviceId} does not exist.`,
      ]);
    }

    if (!currentSession) {
      throw ApiError.NotFoundError("Session not found", [
        "The session with device ID does not exist.",
      ]);
    }

    if (currentSession.deviceId !== deviceId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You are not allowed to delete this session.",
      ]);
    }
    return await devicesRepository.removeDevice(deviceId);
  },

  async deleteRest(refreshToken: string) {
    const token = await jwtTokenService.decodeToken(refreshToken);
    const currentSession = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    if (!currentSession) {
      throw ApiError.NotFoundError("Session not found", [
        "The session for the given device ID does not exist.",
      ]);
    }

    return await devicesRepository.removeDevices(currentSession.deviceId);
  },
};
