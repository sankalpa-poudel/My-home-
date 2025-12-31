import React, { useState } from 'react';
import { FiBell, FiVolume2, FiVolumeX } from 'react-icons/fi';
import useStore from '../store/useStore';

const NotificationManager = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Using Web Audio API or simple beep
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      }
    }
  };

  const sendBrowserNotification = (title, options) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '💬',
        ...options
      });
      playNotificationSound();
    }
  };

  return {
    notificationsEnabled,
    soundEnabled,
    setNotificationsEnabled,
    setSoundEnabled,
    requestNotificationPermission,
    sendBrowserNotification,
    playNotificationSound
  };
};

export default NotificationManager;
