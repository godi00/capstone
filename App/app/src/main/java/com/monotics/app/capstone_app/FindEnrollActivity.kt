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
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.Constants
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.storage
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

}