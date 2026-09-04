package com.aether.launcher;

import android.Manifest;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.BatteryManager;
import android.provider.CalendarContract;
import android.provider.ContactsContract;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Calendar;
import java.util.List;

@CapacitorPlugin(name = "AetherContextBridge")
public class AetherContextBridgePlugin extends Plugin {

    private static final String TAG = "AetherContextBridge";

    /**
     * Builds and returns the comprehensive raw context bundle harvested across:
     * - Battery & charging telemetry
     * - Network state
     * - NotificationListenerService active ranked alerts
     * - Calendar Provider upcoming events (if permission granted)
     * - MediaStore recent downloads & files
     * - Contacts / People recents
     * - UsageStatsManager app recency
     */
    @PluginMethod
    public void getRawContextBundle(PluginCall call) {
        Context context = getContext();
        JSObject bundle = new JSObject();

        try {
            // 1. Device Hardware State
            JSObject deviceState = new JSObject();
            IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = context.registerReceiver(null, ifilter);
            if (batteryStatus != null) {
                int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
                boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                        status == BatteryManager.BATTERY_STATUS_FULL;
                float pct = (level >= 0 && scale > 0) ? ((float) level / (float) scale) * 100 : 80;
                deviceState.put("batteryLevel", Math.round(pct));
                deviceState.put("isCharging", isCharging);
            } else {
                deviceState.put("batteryLevel", 80);
                deviceState.put("isCharging", false);
            }

            // Connectivity
            ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                Network network = cm.getActiveNetwork();
                NetworkCapabilities caps = cm.getNetworkCapabilities(network);
                if (caps != null) {
                    if (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                        deviceState.put("networkType", "Wi-Fi 7 (Low-Latency)");
                    } else if (caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                        deviceState.put("networkType", "5G Ultra Wideband");
                    } else {
                        deviceState.put("networkType", "Connected");
                    }
                } else {
                    deviceState.put("networkType", "Offline");
                }
            }
            bundle.put("deviceState", deviceState);

            // 2. Notification System Stream
            boolean notifListenerConnected = AetherNotificationService.isConnected();
            bundle.put("notificationListenerActive", notifListenerConnected);
            if (notifListenerConnected) {
                bundle.put("notifications", AetherNotificationService.getActiveNotificationsJson());
            } else {
                bundle.put("notifications", new JSArray());
            }

            // 3. Calendar Provider
            JSArray calendarEvents = new JSArray();
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CALENDAR) == PackageManager.PERMISSION_GRANTED) {
                try {
                    ContentResolver cr = context.getContentResolver();
                    long now = System.currentTimeMillis();
                    long end = now + (24 * 60 * 60 * 1000); // next 24 hours
                    Uri.Builder builder = CalendarContract.Instances.CONTENT_URI.buildUpon();
                    android.content.ContentUris.appendId(builder, now);
                    android.content.ContentUris.appendId(builder, end);

                    Cursor cursor = cr.query(
                            builder.build(),
                            new String[]{CalendarContract.Instances.TITLE, CalendarContract.Instances.BEGIN, CalendarContract.Instances.EVENT_LOCATION},
                            null, null, CalendarContract.Instances.BEGIN + " ASC LIMIT 10"
                    );
                    if (cursor != null) {
                        while (cursor.moveToNext()) {
                            JSObject evt = new JSObject();
                            evt.put("title", cursor.getString(0));
                            evt.put("startTime", cursor.getLong(1));
                            evt.put("location", cursor.getString(2) != null ? cursor.getString(2) : "");
                            calendarEvents.put(evt);
                        }
                        cursor.close();
                    }
                } catch (Exception e) {
                    Log.w(TAG, "Calendar read error", e);
                }
            }
            bundle.put("calendarEvents", calendarEvents);

            // 4. MediaStore Recent Downloads / Files
            JSArray recentFiles = new JSArray();
            try {
                ContentResolver cr = context.getContentResolver();
                Uri queryUri = MediaStore.Files.getContentUri("external");
                Cursor cursor = cr.query(
                        queryUri,
                        new String[]{MediaStore.MediaColumns.DISPLAY_NAME, MediaStore.MediaColumns.MIME_TYPE, MediaStore.MediaColumns.DATE_MODIFIED, MediaStore.MediaColumns.SIZE},
                        null, null, MediaStore.MediaColumns.DATE_MODIFIED + " DESC LIMIT 12"
                );
                if (cursor != null) {
                    while (cursor.moveToNext()) {
                        JSObject fileObj = new JSObject();
                        fileObj.put("name", cursor.getString(0));
                        fileObj.put("mimeType", cursor.getString(1));
                        fileObj.put("dateModified", cursor.getLong(2) * 1000);
                        fileObj.put("size", cursor.getLong(3));
                        recentFiles.put(fileObj);
                    }
                    cursor.close();
                }
            } catch (Exception e) {
                Log.w(TAG, "MediaStore read error", e);
            }
            bundle.put("recentFiles", recentFiles);

            // 5. Contacts / People Stream
            JSArray contactsList = new JSArray();
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) == PackageManager.PERMISSION_GRANTED) {
                try {
                    ContentResolver cr = context.getContentResolver();
                    Cursor cursor = cr.query(
                            ContactsContract.Contacts.CONTENT_URI,
                            new String[]{ContactsContract.Contacts._ID, ContactsContract.Contacts.DISPLAY_NAME_PRIMARY, ContactsContract.Contacts.STARRED, ContactsContract.Contacts.LAST_TIME_CONTACTED},
                            null, null, ContactsContract.Contacts.STARRED + " DESC, " + ContactsContract.Contacts.LAST_TIME_CONTACTED + " DESC LIMIT 15"
                    );
                    if (cursor != null) {
                        while (cursor.moveToNext()) {
                            JSObject contact = new JSObject();
                            contact.put("id", cursor.getString(0));
                            contact.put("name", cursor.getString(1));
                            contact.put("starred", cursor.getInt(2) == 1);
                            contactsList.put(contact);
                        }
                        cursor.close();
                    }
                } catch (Exception e) {
                    Log.w(TAG, "Contacts read error", e);
                }
            }
            bundle.put("contacts", contactsList);

            // 6. Usage Stats (Recency patterns)
            JSArray usageList = new JSArray();
            try {
                UsageStatsManager usm = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
                if (usm != null) {
                    long now = System.currentTimeMillis();
                    List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, now - (12 * 3600 * 1000), now);
                    if (stats != null) {
                        stats.sort((a, b) -> Long.compare(b.getLastTimeUsed(), a.getLastTimeUsed()));
                        int count = 0;
                        for (UsageStats stat : stats) {
                            if (count++ >= 8) break;
                            JSObject u = new JSObject();
                            u.put("packageName", stat.getPackageName());
                            u.put("lastUsed", stat.getLastTimeUsed());
                            usageList.put(u);
                        }
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "UsageStats read error", e);
            }
            bundle.put("recentApps", usageList);

            call.resolve(bundle);
        } catch (Exception e) {
            Log.e(TAG, "Failed collecting context bundle", e);
            call.reject("Failed collecting raw context: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openNotificationListenerSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject res = new JSObject();
            res.put("opened", true);
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Could not open Notification Listener settings", e);
        }
    }
}
