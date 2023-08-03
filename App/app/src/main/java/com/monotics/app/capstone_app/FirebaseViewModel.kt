package com.monotics.app.capstone_app

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.monotics.app.capstone_app.data.NotificationBody
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.io.IOException

class FirebaseViewModel(application: Application) : AndroidViewModel(application) {


    // 푸시 메세지 전송
    fun sendNotification(notification: NotificationBody) {
        val gson = Gson()
        val json = gson.toJson(notification)
        val mediaType = "application/json; charset=utf-8".toMediaType()
        val requestBody = json.toRequestBody(mediaType)

        val client = OkHttpClient()
        val request = Request.Builder()
            .url("https://fcm.googleapis.com/fcm/send")
            .addHeader("Authorization", "key=AAAAC-mhq4Q:APA91bHqDOOli5cBNlzrUAS1MiLc8Th0de_fxhf6-8TB29otvzXy9iu1JsjKoNloBVI0ejJr9CNTM0z9X_pDjnIMnFwopiJyiqoDdqm_3NPrFiD2jpB5nmsmuhCskXv2CCkFzmGI9J9D")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onResponse(call: okhttp3.Call, response: Response) {
                println(response.body?.string())
                response.close() // 수신한 response를 반드시 close 해줍니다.
            }

            override fun onFailure(call: okhttp3.Call, e: IOException) {
                e.printStackTrace()
            }
        })
//        viewModelScope.launch {
//            repository.sendNotification(notification)
//        }
    }
}