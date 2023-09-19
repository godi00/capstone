package com.monotics.app.capstone_app

import android.content.Intent
import android.graphics.Color
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.monotics.app.capstone_app.data.FindData
import kotlinx.android.synthetic.main.finditem.view.*
import kotlinx.android.synthetic.main.missitem.view.*

class FindAdapter(): RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    private val db: FirebaseFirestore = Firebase.firestore
    private val findData = db.collection("Finding")
    var findlist: ArrayList<FindData> = arrayListOf()

    class ListAdapter(val layout: View): RecyclerView.ViewHolder(layout)
    init {
        findData.orderBy("uploadTime",
            Query.Direction.DESCENDING).addSnapshotListener { querySnapshot, firebaseFirestoreException ->
            findlist.clear()

            for(snapshot in querySnapshot!!.documents){
                var item = snapshot.toObject(FindData::class.java)
                findlist.add(item!!)
            }
            notifyDataSetChanged()
        }
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        var view = LayoutInflater.from(parent.context).inflate(R.layout.finditem,parent,false)
        return ViewHolder(view)
    }
    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view){}

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        var viewHolder = (holder as ViewHolder).itemView


        if(findlist[position].img!=null){ //이미지가 한 장일때
            Glide.with(viewHolder.FindImg)
                .load(findlist[position].img)
                .into(viewHolder.FindImg)

        }else if(findlist[position].imgs!=null){ //이미지가 여러 장일 때 첫 장만 보여줌
            Glide.with(viewHolder.FindImg)
                .load(findlist[position].imgs?.get(0))
                .into(viewHolder.FindImg)

        }
        if(findlist[position].visibled==false){
            viewHolder.viewbutton2.setText("*** 찾기 완료 ***")
            viewHolder.FindImg.setColorFilter(Color.parseColor("#BF808080"))
            viewHolder.textview2.setTextColor(Color.GRAY)
            viewHolder.textview3.setTextColor(Color.GRAY)
            viewHolder.textview4.setTextColor(Color.GRAY)
            viewHolder.textview100.setTextColor(Color.GRAY)
            viewHolder.textview.setTextColor(Color.GRAY)

            viewHolder.findtuploadime.setTextColor(Color.GRAY)
            viewHolder.findcolor.setTextColor(Color.GRAY)
            viewHolder.findcolor2.setTextColor(Color.GRAY)
            viewHolder.findaddress.setTextColor(Color.GRAY)
            viewHolder.findfeature.setTextColor(Color.GRAY)
        }
        else if(findlist[position].visibled==true){
            viewHolder.viewbutton2.setText("자세히 보기")
        }

        viewHolder.findcolor.text = findlist[position].farColor1
        viewHolder.findaddress.text = findlist[position].address//주소
        viewHolder.findcolor2.text = findlist[position].farColor2
        viewHolder.findfeature.text = findlist[position].feature
        viewHolder.findtuploadime.text = findlist[position].date

        viewHolder.viewbutton2.setOnClickListener {
            Log.e("kimshinseung", "success") // 검사
            if (findlist[position].visibled == true) { //visible필드가 true이면 상세 게시물로 이동한다.
                val context = viewHolder.context
                val intent = Intent(context, DetailfindActivity::class.java)
                val findenrollinf = hashMapOf(
                    "address" to findlist[position].address,
                    "age" to findlist[position].age,
                    "date" to findlist[position].date,
                    "farColor1" to findlist[position].farColor1,
                    "farColor2" to findlist[position].farColor2,
                    "feature" to findlist[position].feature,
                    "kakaoId" to findlist[position].kakaoId,
                    "gender" to findlist[position].gender,
                    "specify" to findlist[position].specify,
                    "uid" to findlist[position].uid,
                    "id" to findlist[position].id,
                    "imgs" to ArrayList<String>(findlist[position].imgs)
                )
                intent.putExtra("findData", findenrollinf)
                context.startActivity(intent)
            }else {
                val context = viewHolder.context
                Toast.makeText(context,"가족의 품으로 돌아간 반려견입니다.",Toast.LENGTH_LONG).show()
            }
        }


    }

    override fun getItemCount(): Int {
        return findlist.size
    }
}