export type DeviceViewModel = {
  /**
   * ip (required field, string. IP address of device during signing in)
   * title (required field, string. Device name: for example Chrome 105)
   * lastActiveDate (required field, string. Date of the last generating of refresh/access tokens)
   * Blog websiteUrl (required field, string. Id of connected device session)
   */
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
