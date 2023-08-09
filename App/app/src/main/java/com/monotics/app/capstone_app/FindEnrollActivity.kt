package com.monotics.app.capstone_app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.Constants
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.storage
import com.monotics.app.capstone_app.data.NotificationBody
import com.monotics.app.capstone_app.databinding.ActivityFindenrollBinding
import kotlinx.android.synthetic.main.activity_missenroll.*


class FindEnrollActivity :AppCompatActivity(){
    val binding by lazy { ActivityFindenrollBinding.inflate(layoutInflater) }
    private val imageUrls = ArrayList<String>()
    var list = ArrayList<Uri>()
    val adapter = MultiImageAdapter(list,this)

    private val PICK_IMAGE_REQUEST = 1

    private lateinit var storageRef: StorageReference
    private lateinit var db: FirebaseFirestore
    private lateinit var selectedImageUris: MutableList<Uri>
    private val firebaseViewModel : FirebaseViewModel by viewModels()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        storageRef = Firebase.storage.reference
        db = Firebase.firestore

        selectedImageUris = mutableListOf()

        val layoutManager = LinearLayoutManager(this)
        recyclerView.layoutManager = layoutManager
        recyclerView.adapter=adapter

        binding.progressBar1.setVisibility(View.INVISIBLE)

        //프로필화면 돌아가기
        binding.profile.setOnClickListener{
            val intent = Intent(this,ProfileActivity::class.java)
            startActivity(intent)
        }

        //뒤로가기 버튼
        binding.backbtn.setOnClickListener{
            super.onBackPressed();
        }

        //사진업로드 버튼
        binding.findimg.setOnClickListener {

            //binding.findimg.visibility= View.INVISIBLE
            val intent = Intent(Intent.ACTION_GET_CONTENT)
            intent.type = "image/*"
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }

        //등록하기 버튼
        binding.enroll.setOnClickListener {

            if(binding.farcolorEdit.text.isBlank()||binding.addressEdit.text.isBlank()){
                Toast.makeText(this,"필수항목을 채워야 합니다", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val specify = binding.specifyEdit.text.toString()
            val farcolor = binding.farcolorEdit.text.toString()
            val farcolor2 = binding.farcolorEdit1.text.toString()
            val gender = binding.genderEdit.text.toString()
            val age = binding.ageEdit1.text.toString()
            val time = binding.dateEdit1.text.toString()
            val address = binding.addressEdit.text.toString()
            val kakaoid = binding.kakoidEdit.text.toString()
            val feature = binding.featureEdit.text.toString()
            val dateString = Timestamp.now()

            if(imageUrls.size == 1){ //사진이 1장만 있을 때
                val enrollinf= hashMapOf(
                    "address" to address,
                    "age" to age,
                    "date" to time,
                    "farColor1" to farcolor,
                    "farColor2" to farcolor2,
                    "feature" to feature,
                    "gender" to gender,
                    "id" to "null",
                    "specify" to specify,
                    "kakaoId" to kakaoid,
                    "uploadTime" to dateString,
                    "uid" to FirebaseAuth.getInstance().uid,
                    "visibled" to true,
                    "imgs" to ArrayList<String>(imageUrls)
                )
                db.collection("Finding")
                    .add(enrollinf)
                    .addOnSuccessListener { documentReference->
                        db.collection("Finding").document(documentReference.id).update("id",documentReference.id)
                        Toast.makeText(this,"게시물을 등록했습니다", Toast.LENGTH_SHORT).show()
                        findMatchingData(enrollinf,documentReference.id)
                    }

            } else if(imageUrls.size>1) { // 사진이 여러장 있을 때
                val enrollinf= hashMapOf(
                    "address" to address,
                    "age" to age,
                    "date" to time,
                    "farColor1" to farcolor,
                    "farColor2" to farcolor2,
                    "feature" to feature,
                    "gender" to gender,
                    "id" to "null",
                    "specify" to specify,
                    "kakaoId" to kakaoid,
                    "uploadTime" to dateString,
                    "uid" to FirebaseAuth.getInstance().uid,
                    "visibled" to true,
                    "imgs" to ArrayList<String>(imageUrls)
                )
                db.collection("Finding")
                    .add(enrollinf)
                    .addOnSuccessListener { documentReference->
                        db.collection("Finding").document(documentReference.id).update("id",documentReference.id)
                        Toast.makeText(this,"게시물을 등록했습니다", Toast.LENGTH_SHORT).show()
                        findMatchingData(enrollinf,documentReference.id)
                    }

            }
            else{ //사진이 없을 때
                val imageUrls = ArrayList<String>()
                imageUrls.add(0, null.toString()) //0번째 값에 Null넣어놓기
                val enrollinf= hashMapOf(
                    "address" to address,
                    "age" to age,
                    "date" to time,
                    "farColor1" to farcolor,
                    "farColor2" to farcolor2,
                    "feature" to feature,
                    "gender" to gender,
                    "id" to "null",
                    "specify" to specify,
                    "kakaoId" to kakaoid,
                    "uploadTime" to dateString,
                    "uid" to FirebaseAuth.getInstance().uid,
                    "visibled" to true,
                    "imgs" to ArrayList<String>(imageUrls)
                )
                db.collection("Finding")
                    .add(enrollinf)
                    .addOnSuccessListener { documentReference->
                        db.collection("Finding").document(documentReference.id).update("id",documentReference.id)
                        Toast.makeText(this,"게시물을 등록했습니다", Toast.LENGTH_SHORT).show()
                        findMatchingData(enrollinf,documentReference.id)
                    }
            }
            super.onBackPressed()

        }

    }
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if(resultCode== RESULT_OK && requestCode == PICK_IMAGE_REQUEST){
            val imageUriList: ArrayList<Uri> = ArrayList()

            val clipData= data?.clipData

            if(clipData != null){
                val count = data.clipData!!.itemCount
                if(count>5){
                    Toast.makeText(this,"사진은 5장까지 선택 가능합니다", Toast.LENGTH_SHORT).show()
                    return
                }

                for(i in 0 until clipData.itemCount){
                    val imageUri = clipData.getItemAt(i).uri
                    imageUriList.add(imageUri)
                    list.add(imageUri)
                    //imageUrls.add(imageUri.toString())
                }

            }else{
                val imageUri = data!!.data
                if (imageUri != null) {
                    imageUriList.add(imageUri)
                    list.add(imageUri)
                    //imageUrls.add(imageUri.toString())
                }
            }
            uploadImagesToFirebaseStorage(imageUriList)
            adapter.notifyDataSetChanged()
        }
    }
    private fun uploadImagesToFirebaseStorage(imageUriList: ArrayList<Uri>) {
        val storageRef = Firebase.storage.reference

        binding.progressBar1.setVisibility(View.VISIBLE)

        for (imageUri in imageUriList) {
            val imageName = "image_${System.currentTimeMillis()}"

            val imageRef = storageRef.child("$imageName")

            imageRef.putFile(imageUri)
                .addOnSuccessListener {
                    imageRef.downloadUrl.addOnSuccessListener { uri->
                        imageUrls.add(uri.toString())
                        binding.progressBar1.setVisibility(View.INVISIBLE)
                        val progress = (100.0 * it.bytesTransferred / it.totalByteCount)
                        updateProgressBar(progress.toInt())
                    }
                }
                .addOnFailureListener {
                    Log.e(Constants.MessageNotificationKeys.TAG, "Image upload failed. ${it.message}")
                }
        }
    }
    fun updateProgressBar(progress:Int){
        // 프로그래스 바 가져오기
        val progressBar = findViewById<ProgressBar>(R.id.progress_bar1)
        // 프로그래스 바 업데이트
        progressBar.progress = progress
    }
    // 등록한 데이터와 50% 이상 일치하는 데이터의 id를 가져오기 위한 함수
    private fun findMatchingData(enrollData: HashMap<String, Any?>, docid: String) {
        // 등록한 데이터의 필요요소들을 배열로 가져옴
        val farColor1 = enrollData["farColor1"]
        val specify = enrollData["specify"]

        //요소들이 일치하는 항목의 id를 가져옴
        val query = db.collection("Missing")
            .whereEqualTo("farColor1", farColor1)
            .whereEqualTo("specify",specify)


        //데이터 보내면 query로 반환
        db.collection("Missing").get().addOnSuccessListener { querySnapshot: QuerySnapshot? ->
            if (querySnapshot != null) {
                for (document in querySnapshot.documents) {
                    // 등록한 데이터와 40% 이상 일치하는 데이터의 id 출력
                    createMatchingQuery(document,enrollData,docid)

                    //var uid = document["uid"] as String
                }
            }
            else {
                Log.e("kimshin", "데이터 없습니다.")
            }
        }

        
    }
    //조건 만드는 함수
    private fun createMatchingQuery(
        document: DocumentSnapshot,
        enrollData: HashMap<String, Any?>,
        docid: String
    ) {
        //비교할 데이터
        val fc1 = document["farColor1"]
        val fc2 = document["farColor2"]
        val ad = document["address"]
        val ag = document["age"]
        val dt = document["date"]
        val gd = document["gender"]
        val sp = document["specify"]

        //등록할 데이터
        val farColor1 = enrollData["farColor1"]
        val farColor2 = enrollData["farColor2"]
        val address = enrollData["address"]
        val age = enrollData["age"]
        val date = enrollData["date"]
        val gender = enrollData["gender"]
        val specify = enrollData["specify"]
        var sum = 0

        //요소들이 일치하는 항목의 id를 가져옴
        if(farColor1!=null) {
           if(fc1==farColor1){
               sum+=1
           }
        }
        if(farColor2!=null) {
            if(fc2==farColor2){
                sum+=1
            }
        }
        if(address!=null) {
            if(ad==address){
                sum+=1
            }
        }
        if(age!=null) {
            if(ag==age){
                sum+=1
            }
        }
        if(date!=null) {
            if(dt==date){
                sum+=1
            }
        }
        if(gender!=null) {
            if(gd==gender){
                sum+=1
            }
        }
        if(specify!=null) {
            if(sp==specify){
                sum+=1
            }
        }
        
        //7개의 조건 중 3개 이상 만족한다면 알림 보내기
        if(sum>=3){
            val uid = document["uid"]
            Log.e("kimshin",document["uid"].toString())
            db.collection("Users").whereEqualTo("uid",uid).get()
                .addOnSuccessListener { userQuerySnapshot ->
                    if (!userQuerySnapshot.isEmpty) {
                        val userDocument = userQuerySnapshot.documents[0]
                        val token = userDocument["token"].toString()

                        val notificationData = NotificationBody.NotificationData(
                            title = "비슷한 게시물 업로드!",
                            id = docid,
                            message = "비슷한 게시물이 올라왔습니다 확인해주세요!"
                        )

                        val notificationBody = NotificationBody(
                            to = token,
                            priority = "high",
                            data = notificationData
                        )
                        firebaseViewModel.sendNotification(notificationBody)
                    }
                }
        }

    }


}