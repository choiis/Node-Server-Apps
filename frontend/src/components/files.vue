/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <div class="container">
            <div id="fileContainer">
                
                <div id="wrapper">
                    <h4>{{infotext}}</h4>
                       <table border="1">
                            <colgroup>
                                <col width="50">
                                <col width="100">
                                <col width="50">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col">파일명</th>
                                    <th scope="col">삭제</th>
                                </tr>
                            </thead>
                            <tbody id="viewTbody">
                                <tr v-for="(item, index) in fileLists" v-bind:key="item">
                                    <td>{{index}}</td>
                                    <td>{{item}}</td>
                                    <td><input type="button" value="삭제" @click="deleteFile(item)"></td>
                                </tr>

                            </tbody>
                        </table>
                </div>
            </div>
    </div>
</template>

<script>
  import axios from 'axios';
export default {
  name: 'File',
  props: ['fileinfotext'],
  data () {
    return {
      fileLists: [],
      infotext : this.fileinfotext
      }
  },
  created: function() {

       axios.get('/api/file').then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.fileLists = data;
          } else {
            alert(res.status);
          }
       });
  },
  methods : {
    deleteFile: function(item) {
        axios.delete('/api/fileDelete/' +  item).then(res => { 
        if (res.status == 200) {
              this.fileList();
          } else {
            alert(res.status);
          }
       })
       .catch(error => {
            if (error.response.status === 403) {
                alert("file does not exist");
            }
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
