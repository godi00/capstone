package com.monotics.app.capstone_app

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.monotics.app.capstone_app.MainActivity

class ForegroundMessagingService : Service() {

    companion object {
        const val NOTIFICATION_CHANNEL_ID = "MyForegroundMessagingServiceChannel"
        const val NOTIFICATION_ID = 101
    }

    override fun onCreate() {
        super.onCreate()
        Log.d("kimshins","fore")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // FCM 메시지 처리 및 알림 생성 로직을 여기에 추가하세요.
        // MyFirebaseMessagingService에서 처리했던 코드를 여기에 추가합니다.
        // 이 때, 알림을 생성하고 화면에 표시할 필요가 있습니다.
        // 알림을 표시하는 코드는 createNotification 메서드를 활용하면 됩니다.

        // FCM 메시지의 데이터를 가져옵니다.
        val title = intent?.getStringExtra("title")
        val body = intent?.getStringExtra("body")

        // 알림 생성
        createNotification(title, body)
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Foreground Messaging Service"
            val descriptionText = "Foreground Service for FCM messages"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(title: String?, body: String?) {
        Log.d("kimshins","create")
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT)

        val notification = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.banner1) // 알림 아이콘 설정
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        // Foreground Service로 실행
        startForeground(NOTIFICATION_ID, notification)
    }
}
