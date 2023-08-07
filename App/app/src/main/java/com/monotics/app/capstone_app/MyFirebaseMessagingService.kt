package com.monotics.app.capstone_app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent

import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build

import android.util.Log

import androidx.core.app.NotificationCompat

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.monotics.app.capstone_app.data.FindData

class MyFirebaseMessagingService : FirebaseMessagingService() {
    /** 푸시 알림으로 보낼 수 있는 메세지는 2가지
     * 1. Notification: 앱이 실행중(포그라운드)일 떄만 푸시 알림이 옴
     * 2. Data: 실행중이거나 백그라운드(앱이 실행중이지 않을때) 알림이 옴 -> TODO: 대부분 사용하는 방식 */

    private val TAG = "FirebaseService"
    private val db: FirebaseFirestore = Firebase.firestore
    private val findData = db.collection("Finding")
    var findlist: ArrayList<FindData> = arrayListOf()


    /** Token 생성 메서드(FirebaseInstanceIdService 사라짐) */
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        var user = FirebaseAuth.getInstance().currentUser
        if(user != null){
            saveTokenToDatebase(user.uid,token)
        }
        Log.d(TAG, "new Token: $token")

    }
    private fun saveTokenToDatebase(uid: String, token: String){
        val databaseRef = FirebaseDatabase.getInstance().getReference("Users")
        databaseRef.child(uid).child("token").setValue(token)
    }

    /** 메시지 수신 메서드(포그라운드) */
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(TAG, "From: " + remoteMessage!!.from)

        //받은 remoteMessage의 값 출력해보기. 데이터메세지 / 알림메세지
        Log.d(TAG, "Message data : ${remoteMessage.data}")
        Log.d(TAG, "Message noti : ${remoteMessage.notification}")

        if(remoteMessage.data.isNotEmpty()){
        sendNotification(remoteMessage)
        }
        else {
            Log.e(TAG, "data가 비어있습니다. 메시지를 수신하지 못했습니다.")
        }
    }

    /** 알림 생성 메서드 */
    private fun sendNotification(
        remoteMessage: RemoteMessage, ) {
        // RequestCode, Id를 고유값으로 지정하여 알림이 개별 표시
        val uniId: Int = (System.currentTimeMillis() / 7).toInt()
        val intent = Intent(this, DetailfindActivity::class.java)
        if(remoteMessage.data["id"]!=null) {
            findData.whereEqualTo("id", remoteMessage.data["id"].toString())
                .addSnapshotListener { querySnapshot, firebaseFirestoreException ->
                    for (snapshot in querySnapshot!!.documents) {
                        var item = snapshot.toObject(FindData::class.java)
                        findlist.add(item!!)
                        val findenrollinf = hashMapOf(
                            "address" to findlist[0].address,
                            "age" to findlist[0].age,
                            "date" to findlist[0].date,
                            "farColor1" to findlist[0].farColor1,
                            "farColor2" to findlist[0].farColor2,
                            "feature" to findlist[0].feature,
                            "kakaoId" to findlist[0].kakaoId,
                            "gender" to findlist[0].gender,
                            "specify" to findlist[0].specify,
                            "uid" to findlist[0].uid,
                            "id" to findlist[0].id,
                            "imgs" to ArrayList<String>(findlist[0].imgs)
                        )
                        //Log.d("kimshin", findenrollinf.toString())
                        intent.putExtra("findData",findenrollinf)
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP) // Activity Stack 을 경로만 남김(A-B-C-D-B => A-B)

                        //23.05.22 Android 최신버전 대응 (FLAG_MUTABLE, FLAG_IMMUTABLE)
                        //PendingIntent.FLAG_MUTABLE은 PendingIntent의 내용을 변경할 수 있도록 허용, PendingIntent.FLAG_IMMUTABLE은 PendingIntent의 내용을 변경할 수 없음
                        val pendingIntent = PendingIntent.getActivity(this, uniId, intent, PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_MUTABLE)
                        // 알림 채널 이름
                        val channelId = "my_channel"
                        // 알림 소리
                        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

                        // 알림에 대한 UI 정보, 작업
                        val notificationBuilder = NotificationCompat.Builder(this, channelId)
                            .setSmallIcon(R.mipmap.ic_launcher) // 아이콘 설정
                            .setContentTitle(remoteMessage.data["title"].toString()) // 제목
                            .setContentText(remoteMessage.data["message"].toString()) // 메시지 내용
                            .setAutoCancel(true) // 알람클릭시 삭제여부
                            .setSound(soundUri)  // 알림 소리
                            .setContentIntent(pendingIntent) // 알림 실행 시 Intent

                        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

                        // 오레오 버전 이후에는 채널이 필요
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            val channel = NotificationChannel(channelId, "Notice", NotificationManager.IMPORTANCE_DEFAULT)
                            notificationManager.createNotificationChannel(channel)
                        }

                        // 알림 생성
                        notificationManager.notify(uniId, notificationBuilder.build())
                    }
                }
        }
        else {

        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP) // Activity Stack 을 경로만 남김(A-B-C-D-B => A-B)

        //23.05.22 Android 최신버전 대응 (FLAG_MUTABLE, FLAG_IMMUTABLE)
        //PendingIntent.FLAG_MUTABLE은 PendingIntent의 내용을 변경할 수 있도록 허용, PendingIntent.FLAG_IMMUTABLE은 PendingIntent의 내용을 변경할 수 없음
        val pendingIntent = PendingIntent.getActivity(this, uniId, intent, PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_MUTABLE)
        Log.d("kimshin", "a")
        // 알림 채널 이름
        val channelId = "my_channel"
        // 알림 소리
        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        // 알림에 대한 UI 정보, 작업
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher) // 아이콘 설정
            .setContentTitle(remoteMessage.data["title"].toString()) // 제목
            .setContentText(remoteMessage.data["message"].toString()) // 메시지 내용
            .setAutoCancel(true) // 알람클릭시 삭제여부
            .setSound(soundUri)  // 알림 소리
            .setContentIntent(pendingIntent) // 알림 실행 시 Intent

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // 오레오 버전 이후에는 채널이 필요
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Notice", NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        // 알림 생성
        notificationManager.notify(uniId, notificationBuilder.build())
        }
    }

    /** Token 가져오기 */
    fun getFirebaseToken() {
        //비동기 방식
        FirebaseMessaging.getInstance().token.addOnSuccessListener {
            Log.d(TAG, "token=${it}")
        }

//		  //동기방식
//        FirebaseMessaging.getInstance().token.addOnCompleteListener(OnCompleteListener { task ->
//                if (!task.isSuccessful) {
//                    Log.d(TAG, "Fetching FCM registration token failed ${task.exception}")
//                    return@OnCompleteListener
//                }
//                var deviceToken = task.result
//                Log.e(TAG, "token=${deviceToken}")
//            })
    }
}