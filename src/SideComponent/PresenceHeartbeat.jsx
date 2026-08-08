import { useEffect } from 'react';
import { sendPresenceHeartbeatApi } from '../api/restApiConfig';

const HEARTBEAT_THROTTLE_MS = 60 * 1000;

const PresenceHeartbeat = () => {
  useEffect(() => {
    let lastSentAt = 0;
    let stopped = false;

    const sendHeartbeat = (force = false) => {
      const now = Date.now();
      if (stopped || document.visibilityState !== 'visible' || (!force && now - lastSentAt < HEARTBEAT_THROTTLE_MS)) return;
      lastSentAt = now;
      sendPresenceHeartbeatApi().catch(() => undefined);
    };

    const handleActivity = () => sendHeartbeat(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') sendHeartbeat(true);
    };
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }));
    window.addEventListener('focus', handleActivity);
    document.addEventListener('visibilitychange', handleVisibility);
    sendHeartbeat(true);

    return () => {
      stopped = true;
      events.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      window.removeEventListener('focus', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
};

export default PresenceHeartbeat;
