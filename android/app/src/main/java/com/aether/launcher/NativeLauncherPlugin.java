package com.aether.launcher;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(name = "NativeLauncher")
public class NativeLauncherPlugin extends Plugin {

    @PluginMethod
    public void launchApp(PluginCall call) {
        String packageName = call.getString("packageName");
        JSObject result = new JSObject();

        if (packageName == null || packageName.trim().isEmpty()) {
            result.put("opened", false);
            result.put("reason", "missing-package");
            call.resolve(result);
            return;
        }

        Intent launchIntent = getContext().getPackageManager().getLaunchIntentForPackage(packageName);
        if (launchIntent == null) {
            result.put("opened", false);
            result.put("reason", "not-launchable");
            call.resolve(result);
            return;
        }

        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        getContext().startActivity(launchIntent);
        result.put("opened", true);
        call.resolve(result);
    }

    @PluginMethod
    public void listLaunchableApps(PluginCall call) {
        PackageManager pm = getContext().getPackageManager();
        Intent query = new Intent(Intent.ACTION_MAIN, null);
        query.addCategory(Intent.CATEGORY_LAUNCHER);

        List<ResolveInfo> resolved = pm.queryIntentActivities(query, PackageManager.MATCH_ALL);
        resolved.sort((a, b) -> String.CASE_INSENSITIVE_ORDER.compare(
                String.valueOf(a.loadLabel(pm)), String.valueOf(b.loadLabel(pm))));

        JSArray apps = new JSArray();
        Set<String> seenPackages = new HashSet<>();
        String ownPackage = getContext().getPackageName();

        for (ResolveInfo info : resolved) {
            if (info.activityInfo == null) continue;
            String packageName = info.activityInfo.packageName;
            if (packageName == null || packageName.equals(ownPackage) || !seenPackages.add(packageName)) continue;

            JSObject app = new JSObject();
            app.put("packageName", packageName);
            app.put("label", String.valueOf(info.loadLabel(pm)));

            try {
                Drawable icon = info.loadIcon(pm);
                String dataUrl = drawableToDataUrl(icon);
                if (dataUrl != null) app.put("iconDataUrl", dataUrl);
            } catch (Exception ignored) {}

            apps.put(app);
        }

        JSObject result = new JSObject();
        result.put("apps", apps);
        call.resolve(result);
    }

    private String drawableToDataUrl(Drawable drawable) {
        if (drawable == null) return null;
        final int size = 72;
        Bitmap bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, size, size);
        drawable.draw(canvas);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream);
        String encoded = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP);
        return "data:image/png;base64," + encoded;
    }
}
