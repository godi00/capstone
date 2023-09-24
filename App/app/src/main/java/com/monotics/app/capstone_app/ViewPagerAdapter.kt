package com.monotics.app.capstone_app

import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.core.content.ContextCompat
import androidx.core.content.ContextCompat.startActivity
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2

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
                val intent = Intent(holder.imageMember.context, FindEnrollActivity::class.java)
                ContextCompat.startActivity(holder.imageMember.context,intent,null)
            }
        }

    }

    override fun getItemCount(): Int = imageMembers.size



}