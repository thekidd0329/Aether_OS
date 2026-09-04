package com.aether.launcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * AetherNotificationService collects live active notifications from Android's
 * NotificationListenerService so Aether's Context Index can rank urgency and relevance.
 */
public class AetherNotificationService extends NotificationListenerService {

    private static final String TAG = "AetherNotifService";
    private static AetherNotificationService instance;
    private static final List<NotificationEntry> activeNotifications = Collections.synchronizedList(new ArrayList<>());

    public static class NotificationEntry {
        public String id;
        public String packageName;
        public String title;
        public String text;
        public String subText;
        public long postTime;
        public boolean isOngoing;
        public int importance;
        public String category;
    }

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        instance = this;
        Log.i(TAG, "Aether NotificationListenerService connected");
        refreshNotifications();
    }

    @Override
    public void onListenerDisconnected() {
        super.onListenerDisconnected();
        if (instance == this) {
            instance = null;
        }
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;
        addOrUpdateNotification(sbn);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        if (sbn == null) return;
        removeNotification(sbn.getKey());
    }

    public static boolean isConnected() {
        return instance != null;
    }

    public static void refreshNotifications() {
        if (instance == null) return;
        try {
            StatusBarNotification[] sbns = instance.getActiveNotifications();
            activeNotifications.clear();
            if (sbns != null) {
                for (StatusBarNotification sbn : sbns) {
                    if (sbn != null) {
                        NotificationEntry entry = sbnToEntry(sbn);
                        if (entry != null) {
                            activeNotifications.add(entry);
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to read active notifications", e);
        }
    }

    private static void addOrUpdateNotification(StatusBarNotification sbn) {
        NotificationEntry entry = sbnToEntry(sbn);
        if (entry == null) return;
        removeNotification(entry.id);
        activeNotifications.add(0, entry);
        if (activeNotifications.size() > 50) {
            activeNotifications.remove(activeNotifications.size() - 1);
        }
    }

    private static void removeNotification(String key) {
        synchronized (activeNotifications) {
            for (int i = 0; i < activeNotifications.size(); i++) {
                if (activeNotifications.get(i).id.equals(key)) {
                    activeNotifications.remove(i);
                    break;
                }
            }
        }
    }

    private static NotificationEntry sbnToEntry(StatusBarNotification sbn) {
        try {
            NotificationEntry entry = new NotificationEntry();
            entry.id = sbn.getKey();
            entry.packageName = sbn.getPackageName();
            entry.postTime = sbn.getPostTime();
            entry.isOngoing = sbn.isOngoing();

            if (sbn.getNotification() != null) {
                android.os.Bundle extras = sbn.getNotification().extras;
                if (extras != null) {
                    CharSequence titleSeq = extras.getCharSequence(android.app.Notification.EXTRA_TITLE);
                    CharSequence textSeq = extras.getCharSequence(android.app.Notification.EXTRA_TEXT);
                    CharSequence subSeq = extras.getCharSequence(android.app.Notification.EXTRA_SUB_TEXT);
                    entry.title = titleSeq != null ? titleSeq.toString() : "";
                    entry.text = textSeq != null ? textSeq.toString() : "";
                    entry.subText = subSeq != null ? subSeq.toString() : "";
                }
                entry.category = sbn.getNotification().category != null ? sbn.getNotification().category : "";
            }
            return entry;
        } catch (Exception e) {
            return null;
        }
    }

    public static JSArray getActiveNotificationsJson() {
        refreshNotifications();
        JSArray arr = new JSArray();
        synchronized (activeNotifications) {
            for (NotificationEntry entry : activeNotifications) {
                JSObject obj = new JSObject();
                obj.put("id", entry.id);
                obj.put("packageName", entry.packageName);
                obj.put("title", entry.title != null ? entry.title : "");
                obj.put("text", entry.text != null ? entry.text : "");
                obj.put("subText", entry.subText != null ? entry.subText : "");
                obj.put("postTime", entry.postTime);
                obj.put("isOngoing", entry.isOngoing);
                obj.put("category", entry.category != null ? entry.category : "");
                arr.put(obj);
            }
        }
        return arr;
    }
}
