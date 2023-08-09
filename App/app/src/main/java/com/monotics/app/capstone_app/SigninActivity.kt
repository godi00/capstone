package com.monotics.app.capstone_app

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.monotics.app.capstone_app.databinding.ActivitySigninBinding
import java.util.regex.Pattern

class SigninActivity: AppCompatActivity() {
    private val db: FirebaseFirestore = Firebase.firestore
    private val userdataCollectionRef = db.collection("Users")
    private val binding by lazy { ActivitySigninBinding.inflate(layoutInflater) }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        //프로필화면 돌아가기
        binding.HomeButton.setOnClickListener{
            val intent = Intent(this,ProfileActivity::class.java)
            startActivity(intent)
        }
        //회원가입 버튼
        binding.signinButton.setOnClickListener {
            //형식이나 올바른지 확인하는 부분 틀리면 다시 클릭리스너로 돌아감
            if (binding.emailEditText.text.isBlank() || binding.nameEditText.text.isBlank() ||
                binding.passwordEditText2.text.isBlank() || binding.passwordConfirmEditText2.text.isBlank()){
                Toast.makeText(this,"빈칸이 남아있습니다. 빈칸을 모두 채워주세요.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (!Patterns.EMAIL_ADDRESS.matcher(binding.emailEditText.text).matches()){
                Toast.makeText(this,"올바른 이메일 형태가 아닙니다.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (!Pattern.matches("^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$", binding.phoneEditText.text)){
                Toast.makeText(this,"올바른 전화번호 형태가 아닙니다.",Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (binding.passwordConfirmEditText2.text.toString() != binding.passwordEditText2.text.toString()){
                Toast.makeText(this,"비밀번호가 서로 동일 하지 않습니다. 다시 확인해주세요.",Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }


            Firebase.auth.createUserWithEmailAndPassword(binding.emailEditText.text.toString(),binding.passwordEditText2.text.toString())
                .addOnCompleteListener {
                    if(it.isSuccessful){
                        Log.d("sign in", "회원가입 성공");
                        val user = Firebase.auth.currentUser
                        var email = user!!.email
                        val uid = user.uid
                        val token = ""
                        val name = binding.nameEditText.text.toString()
                        val phoneNumber = binding.phoneEditText.text.toString()
                        val address = binding.addressEditText.text.toString()
                        val userdata = hashMapOf(
                            "Name" to name,
                            "PhoneNumber" to phoneNumber,
                            "Email" to email,
                            "Address" to address,
                            "uid" to uid,
                            "token" to token
                        )
                        userdataCollectionRef.document(uid).set(userdata).addOnFailureListener{
                            Toast.makeText(this,"유저 데이터를 초기화하는데 실패했습니다.",Toast.LENGTH_SHORT).show()
                        }
                        Toast.makeText(this,"회원가입에 성공하셨습니다.",Toast.LENGTH_SHORT).show()
                        finish()
                    }

                    else{
                        Toast.makeText(this,"회원가입에 실패하셨습니다.",Toast.LENGTH_SHORT).show()
                    }
                }
        }
    }
}