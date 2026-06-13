interface JwtPayload {
  sub: string;
  exp: number;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);

    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenRemainingSeconds(token: string): number {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return 0;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  return Math.max(payload.exp - currentTimeInSeconds, 0);
}

export function formatRemainingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(
    2,
    "0",
  )}`;
}
