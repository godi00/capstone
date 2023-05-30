package com.monotics.app.capstone_app

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.MenuItem
import android.widget.TextView
import androidx.core.text.HtmlCompat
import androidx.core.view.GravityCompat
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.navigation.NavigationView
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.monotics.app.capstone_app.data.ProfileDataViewModel
import com.monotics.app.capstone_app.databinding.ActivityMainBinding
import com.monotics.app.capstone_app.databinding.NavheaderBinding
import kotlinx.android.synthetic.main.activity_main.recyclerHorizon

class MainActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }
    private val binding2 by lazy { NavheaderBinding.inflate(layoutInflater)}
    lateinit var profileDataViewModel: ProfileDataViewModel
    private val db: FirebaseFirestore = Firebase.firestore
    private val missData = db.collection("Missing")
    lateinit var viewPager: ViewPager2
    var currentPosition = 0
    val handler= Handler(Looper.getMainLooper()){
        setPage()
        true
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        //배너 부분
        viewPager = binding.pager
        viewPager.adapter = ViewPagerAdapter(getImages()) //어댑터 생성
        viewPager.orientation = ViewPager2.ORIENTATION_HORIZONTAL //방향 가로로
        //5초마다 자동으로 페이지 넘어가기
        val thread=Thread(PagerRunnable())
        thread.start()

        //하이퍼링크
        val linktext= "- 참고 사이트"
        val linkUrl = "http://www.angel.or.kr/missing.php"
        val hyperLink = "<a href=\"$linkUrl\">$linktext</a>"
        binding.hyperlink.text = HtmlCompat.fromHtml(hyperLink, HtmlCompat.FROM_HTML_MODE_COMPACT)
        binding.hyperlink.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(linkUrl))
            startActivity(intent)
        }

        //총 실종 수
        missData.whereEqualTo("visibled", true).addSnapshotListener{querySnapshot, firebaseFirestoreException ->
            val totalmiss = querySnapshot?.count()
            binding.totalmiss.text = totalmiss.toString()
        }
        //총 찾은 수
        missData.whereEqualTo("visibled", false).addSnapshotListener{querySnapshot, firebaseFirestoreException ->
            val totalfind = querySnapshot?.count()
            binding.misscomplete.text = totalfind.toString()
        }

//        맵실현은 되는데 에뮬레이터에서는 안됨
//        val mapView = MapView(this)
//        val mapViewContainer = map_View
//        mapViewContainer.addView(mapView)


        //실종게시물 부분
        var manager02 = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        var adapter02 = MissboardAdapter()

        var RecyclerView02 = recyclerHorizon.apply {
            adapter = adapter02
            layoutManager = manager02
        }


        //메뉴 버튼 누르면 drawerlayout실행됨
        binding.menu.setOnClickListener{
            profileDataViewModel = ViewModelProvider(this).get(ProfileDataViewModel::class.java)
            profileDataViewModel.refreshData()

            profileDataViewModel.address.observeForever {
                val textView: TextView = findViewById(R.id.address)
                textView.text= it
            }
            profileDataViewModel.email.observeForever {
                val textView: TextView = findViewById(R.id.email)
                textView.text= it
            }
            profileDataViewModel.phoneNumber.observeForever {
                val textView: TextView = findViewById(R.id.phone)
                textView.text= it
            }

            binding.layoutDrawer.openDrawer(GravityCompat.START)
        }
        // 네비게이션 메뉴 아이템에 클릭 속성 부여
        binding.naviView.setNavigationItemSelectedListener(this)



        //프로필화면 돌아가기
        binding.profile.setOnClickListener{
            val intent = Intent(this,ProfileActivity::class.java)
            startActivity(intent)
        }

        //로고화면 누르면 메인액티비티로
        binding.logo.setOnClickListener {
            val intent = Intent(this,MainActivity::class.java)
            startActivity(intent)
        }
    }

    inner class PagerRunnable:Runnable{
        override fun run(){
            while(true){
                Thread.sleep(5000)
                handler.sendEmptyMessage(0)
            }
        }
    }
    fun setPage(){
        if(currentPosition==3) currentPosition=0
        binding.pager.setCurrentItem(currentPosition,true)
        currentPosition+=1
    }


    //네비게이션 메뉴 아이템 클릭시 수행
    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.miss -> startActivity(Intent(this,MissActivity::class.java))
            R.id.find -> startActivity(Intent(this,FindActivity::class.java))
            //R.id.hospital-> startActivity(Intent(this,HospitalActivity::class.java))
            R.id.search-> startActivity(Intent(this,SearchActivity::class.java))
        }

        //close navigation view
        binding.layoutDrawer.closeDrawers()
        return false
    }
    //drawer가 열려 있을 때, 뒤로가기 버튼 누르면 drawer 먼저 닫아줌
    override fun onBackPressed() {
        if(binding.layoutDrawer.isDrawerOpen(GravityCompat.START)) {
            binding.layoutDrawer.closeDrawers()
        }else {
            super.onBackPressed()
        }
    }
    private  fun getImages(): ArrayList<Int>{
        return arrayListOf<Int>(
            R.drawable.banner1,
            R.drawable.banner2,
            R.drawable.banner3
        )
    }
}