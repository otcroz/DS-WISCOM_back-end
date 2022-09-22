const express = require('express');
const router = express.Router();

const { Project } = require('../models/project.js');
const { Comment } = require('../models/comment.js');
const { default: mongoose } = require('mongoose');

// 프로젝트 전체 목록 - get, query
router.get('/total', async (req, res) => {
    try {
        //Pagenation
        const page = Number(req.query.page || 1); //1: default (1~8)
        const perPage = 8;
        const sort = Number(req.query.sort || 1); //1: defalut 이름순, 2: 인기순
        
        const projects = await Project.find({}) 
            .sort( sort == 1 ? { name : 1 } : { likes : 1 }) //-1: desc, 1: asc
            .skip(perPage * (page - 1)) //검색 시 포함하지 않을 데이터 수
            .limit(perPage);

        console.log(projects);
        res.json(projects);
      } catch (err) {
        console.error(err);
      }
})

// 프로젝트 상세 - get

// 좋아요 등록 - post

// 댓글 등록 - post
router.post('/:projectId/addComment',(req, res) => {
  const comment=new Comment(req.body);
  const projectId = mongoose.Types.ObjectId(req.params.projectId);
  console.log(projectId);
  console.log(comment._id);
  Project.updateOne({"_id":projectId},
  {
    $set:{
      comments:
        comment._id
    }
  }).then(comments=>{
    res.status(200).json({sucess:true, comments});
  }).catch(error=>{
    res.status(400).json({error:error});
  })

  comment.save((err, userInfo)=>{ 
    if(!req.body){return res.status(400).json({
      status:'error',
      error:'empty'});}
});
});


module.exports = router;