export declare const SessionPlatform: {
    readonly IOS: "ios";
    readonly ANDROID: "android";
};
export type SessionPlatform = (typeof SessionPlatform)[keyof typeof SessionPlatform];
