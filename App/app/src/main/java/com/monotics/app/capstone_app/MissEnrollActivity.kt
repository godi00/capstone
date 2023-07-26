package com.monotics.app.capstone_app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.Constants.MessageNotificationKeys.TAG
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.storage
import com.monotics.app.capstone_app.databinding.ActivityMissenrollBinding
import kotlinx.android.synthetic.main.activity_missenroll.recyclerView
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

class MissEnrollActivity: AppCompatActivity() {
    val binding by lazy { ActivityMissenrollBinding.inflate(layoutInflater) }
    private val imageUrls = ArrayList<String>()
    var list = ArrayList<Uri>()
    val adapter = MultiImageAdapter(list,this)

    private val PICK_IMAGE_REQUEST = 1

    private lateinit var storageRef: StorageReference
    private lateinit var db: FirebaseFirestore

    private lateinit var selectedImageUris: MutableList<Uri>
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        storageRef = Firebase.storage.reference
        db = Firebase.firestore

        selectedImageUris = mutableListOf()

        val layoutManager = LinearLayoutManager(this)
        recyclerView.layoutManager = layoutManager
        recyclerView.adapter=adapter

        binding.progressBar.setVisibility(View.INVISIBLE)

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

            if(binding.farcolorEdit.text.isBlank()||binding.nameEdit.text.isBlank()){
                Toast.makeText(this,"필수항목을 채워야 합니다", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val address = binding.addressEdit.text.toString()
            val farcolor = binding.farcolorEdit.text.toString()
            val farcolor2 = binding.farcolorEdit2.text.toString()
            val age = binding.ageEdit.text.toString()
            val neutering = binding.neuteringEdit.text.toString()
            val tel = binding.kakaoidEdit.text.toString()
            val time = binding.dateEdit.text.toString()
            val feature = binding.personalityEdit.text.toString()
            val gender = binding.genderEdit.text.toString()
            val specify = binding.specifyEdit.text.toString()
            val name = binding.nameEdit.text.toString()
            //val currentDate = Date()
            //val format = SimpleDateFormat("yyyy-MM-dd-HH:mm:ss")
            val dateString = Timestamp.now()
            if(imageUrls.size == 1){ //사진이 1장만 있을 때
                val enrollinf= hashMapOf(
                    "address" to address,
                    "farColor1" to farcolor,
                    "farColor2" to farcolor2,
                    "feature" to feature,
                    "gender" to gender,
                    "id" to "null",
                    "specify" to specify,
                    "name" to name,
                    "age" to age,
                    "date" to time,
                    "kakaoId" to tel,
                    "neutering" to neutering,
                    "uploadTime" to dateString,
                    "uid" to FirebaseAuth.getInstance().uid,
                    "visibled" to true,
                    "imgs" to ArrayList<String>(imageUrls)
                //"img" to imageUrls[0] 사진 오류 나면 이렇게 바꾸면 됨
                )
                db.collection("Missing")
                    .add(enrollinf)
                    .addOnSuccessListener { documentReference->
                        db.collection("Missing").document(documentReference.id).update("id",documentReference.id)
                        Toast.makeText(this,"게시물을 등록했습니다", Toast.LENGTH_SHORT).show()
                    }
            }else if(imageUrls.size>1){ //사진 여러장 있을 때
                val enrollinf= hashMapOf(
                    "address" to address,
                    "farColor1" to farcolor,
                    "farColor2" to farcolor2,
                    "feature" to feature,
                    "gender" to gender,
                    "id" to "null",
                    "specify" to specify,
                    "name" to name,
                    "age" to age,
                    "date" to time,
                    "kakaoId" to tel,
                    "neutering" to neutering,
                    "uploadTime" to dateString,
                    "uid" to FirebaseAuth.getInstance().uid,
                    "visibled" to true,
                    "imgs" to ArrayList<String>(imageUrls)
                )
                db.collection("Missing")
                    .add(enrollinf)
                    .addOnSuccessListener { documentReference->
                        db.collection("Missing").document(documentReference.id).update("id",documentReference.id)
                        Toast.makeText(this,"게시물을 등록했습니다", Toast.LENGTH_SHORT).show()
                    }
            }
            else{ //사진이 없을 때
                val imageUrls = ArrayList<String>()
                imageUrls.add(0, null.toString()) //0번째 값에 Null넣어놓기
                val enrollinf= hashMapOf(
                    "address" to address,
                    "farColor1" to farcolor,
                    "farColor2" to farcolor2,
                    "feature" to feature,
                    "gender" to gender,
                    "id" to "null",
                    "specify" to specify,
                    "name" to name,
                    "age" to age,
                    "date" to time,
                    "kakaoId" to tel,
                    "neutering" to neutering,
                    "uploadTime" to dateString,
                    "uid" to FirebaseAuth.getInstance().uid,
                    "visibled" to true,
                    "imgs" to ArrayList<String>(imageUrls)
                )
                db.collection("Missing")
                    .add(enrollinf)
                    .addOnSuccessListener { documentReference->
                        db.collection("Missing").document(documentReference.id).update("id",documentReference.id)
                        Toast.makeText(this,"게시물을 등록했습니다", Toast.LENGTH_SHORT).show()
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
        binding.progressBar.setVisibility(View.VISIBLE)
        for (imageUri in imageUriList) {
            val imageName = "image_${System.currentTimeMillis()}"

            val imageRef = storageRef.child("$imageName")

            val uploadTask = imageRef.putFile(imageUri)
            imageRef.putFile(imageUri)
                .addOnSuccessListener {
                    imageRef.downloadUrl.addOnSuccessListener { uri->
                        imageUrls.add(uri.toString())
                        binding.progressBar.setVisibility(View.INVISIBLE)
                        val progress = (100.0 * it.bytesTransferred / it.totalByteCount)
                        updateProgressBar(progress.toInt())
                    }
                }
                .addOnFailureListener {
                    Log.e(TAG, "Image upload failed. ${it.message}")
                }
        }
    }
    fun updateProgressBar(progress: Int) {
        // 프로그래스 바 가져오기
        val progressBar = findViewById<ProgressBar>(R.id.progress_bar)
        // 프로그래스 바 업데이트
        progressBar.progress = progress
    }


    fun uploadImageFirebase(uri: Uri, i: Int){
        var storage: FirebaseStorage? = FirebaseStorage.getInstance()   //FirebaseStorage 인스턴스 생성
        //파일 이름 생성.

        var fileName = "${i}_${SimpleDateFormat("yyyymmdd_HHmmss").format(Date())}_.png"
        //파일 업로드, 다운로드, 삭제, 메타데이터 가져오기 또는 업데이트를 하기 위해 참조를 생성.
        //참조는 클라우드 파일을 가리키는 포인터라고 할 수 있음.
        var imagesRef = storage!!.reference.child(fileName)    //기본 참조 위치/images/${fileName}
        //이미지 파일 업로드
        imagesRef.putFile(uri!!).addOnSuccessListener {
            imagesRef.downloadUrl.addOnSuccessListener { uri ->
                val url = uri.toString()
            }
        }.addOnFailureListener {
            println(it)
        }
    }

}