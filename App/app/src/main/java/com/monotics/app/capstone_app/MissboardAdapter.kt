package com.monotics.app.capstone_app

import android.content.Intent
import android.graphics.Color
import android.graphics.PorterDuff
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.monotics.app.capstone_app.data.MissData
import kotlinx.android.synthetic.main.missboard.view.detail_img
import kotlinx.android.synthetic.main.missboard.view.textImg
import kotlinx.android.synthetic.main.missitem.view.*

class MissboardAdapter(): RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    private val db: FirebaseFirestore = Firebase.firestore
    private val missData = db.collection("Missing")
    var misslist: ArrayList<MissData> = arrayListOf()


    class ListAdapter(val layout: View): RecyclerView.ViewHolder(layout)
    init {
        missData.orderBy("uploadTime",Query.Direction.DESCENDING).addSnapshotListener { querySnapshot, firebaseFirestoreException ->
            misslist.clear()

            for(snapshot in querySnapshot!!.documents){
                var item = snapshot.toObject(MissData::class.java)
                misslist.add(item!!)
            }
            notifyDataSetChanged()
        }
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        var view = LayoutInflater.from(parent.context).inflate(R.layout.missboard,parent,false)
        return ViewHolder(view)
    }
    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view){}

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        var viewHolder = (holder as ViewHolder).itemView



        if(misslist[position].img!=null){ //이미지가 한 장일때
            Glide.with(viewHolder.detail_img)
                .load(misslist[position].img)
                .into(viewHolder.detail_img)

        }else if(misslist[position].imgs!=null){ //이미지가 여러 장일 때 첫 장만 보여줌
            Glide.with(viewHolder.detail_img)
                .load(misslist[position].imgs?.get(0))
                .into(viewHolder.detail_img)
        }
        if(misslist[position].visibled==false){
            viewHolder.textImg.text = "*** 찾기 완료 ***"
            viewHolder.detail_img.setColorFilter(Color.parseColor("#BF808080"))
        }else if(misslist[position].visibled==true){
            viewHolder.textImg.text = misslist[position].address//주소
        }


        viewHolder.detail_img.setOnClickListener {
            if(misslist[position].visibled==true){ //visible필드가 true이면 상세 게시물로 이동한다.
            Log.e("kimshinseung","success") // 검사

            val context = viewHolder.context
            val intent = Intent(context,DetailActivity::class.java)
            val missenrollinf = hashMapOf(
                "name" to misslist[position].name,
                "address" to misslist[position].address,
                "age" to misslist[position].age,
                "date" to misslist[position].date,
                "farColor1" to misslist[position].farColor1,
                "farColor2" to misslist[position].farColor2,
                "feature" to misslist[position].feature,
                "kakaoId" to misslist[position].kakaoId,
                "gender" to misslist[position].gender,
                "neutering" to misslist[position].neutering,
                "specify" to misslist[position].specify,
                "uid" to misslist[position].uid,
                "id" to misslist[position].id,
                "imgs" to ArrayList<String>(misslist[position].imgs)
            )
            intent.putExtra("missData",missenrollinf)
            context.startActivity(intent)
        } else{
                Log.e("kimshinseung","susss") // 검사
                val context = viewHolder.context
                Toast.makeText(context,"가족의 품으로 돌아간 반려견입니다.", Toast.LENGTH_LONG).show()
            }

        }

    }

    override fun getItemCount(): Int {
        return misslist.size
    }
}