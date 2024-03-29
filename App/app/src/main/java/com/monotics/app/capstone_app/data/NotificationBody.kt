package com.monotics.app.capstone_app.data

data class NotificationBody(
    val to: String,
    val priority: String,
    val data: NotificationData
) {
    data class NotificationData(
        val title: String,
        val id : String,
        val message: String,
    )
}