package com.monotics.app.capstone_app

import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.content.ContextCompat.startActivity
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.google.firebase.auth.FirebaseAuth

class ViewPagerAdapter(
    var imageMembers: ArrayList<Int>
): RecyclerView.Adapter<ViewPagerAdapter.ViewPagerViewHolder>() {
    inner class ViewPagerViewHolder(parent: ViewGroup): RecyclerView.ViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.pager, parent, false)) {
        val imageMember = itemView.findViewById<ImageView>(R.id.slide_imageView)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ) = ViewPagerViewHolder((parent))


    override fun onBindViewHolder(holder: ViewPagerViewHolder, position: Int) {
        holder.imageMember.setImageResource(imageMembers[position])
        if(position == 1){

            holder.imageMember.setOnClickListener {
                //로그인되어있어야 게시물 등록할 수 있다.
                if(FirebaseAuth.getInstance().uid != null){
                    val intent = Intent(holder.imageMember.context, FindEnrollActivity::class.java)
                    ContextCompat.startActivity(holder.imageMember.context,intent,null)
                }
                else{
                    Toast.makeText(holder.imageMember.context,"게시물 등록권한이 없습니다, 로그인 해주세요", Toast.LENGTH_LONG).show()
                }

            }
        }

    }

    override fun getItemCount(): Int = imageMembers.size



}