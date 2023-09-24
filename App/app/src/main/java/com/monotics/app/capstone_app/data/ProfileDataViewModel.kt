package com.monotics.app.capstone_app.data

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.launch

class ProfileDataViewModel : ViewModel() {
    private val db = Firebase.firestore
    private val userDataCollectionRef = db.collection("Users")
    var username = MutableLiveData<String>()
    var email = MutableLiveData<String>()
    var phoneNumber = MutableLiveData<String>()
    var address = MutableLiveData<String>()

    fun refreshData(){
        viewModelScope.launch{
            userDataCollectionRef.document(Firebase.auth.uid.toString()).get().addOnSuccessListener {
                username.value = it.get("Name").toString()
                email.value = it.get("Email").toString()
                phoneNumber.value = it.get("PhoneNumber").toString()
                address.value = it.get("Address").toString()
            }
        }
    }
}