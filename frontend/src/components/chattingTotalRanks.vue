/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <div class="container">
        <section>
            <div id="chattingTotalContainer">
                <div id="wrapper">
                      <h5>닉네임별 전체 채팅 량 통계</h5>
                        페이지<input type="number" id="offset" name="offset" v-model="offset" v-on:change="chattingTotalRanking">
                        <table border="1">
                            <colgroup>
                                <col width="100">
                                <col width="200">
                                <col width="200">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">랭킹</th>
                                    <th scope="col">닉네임</th>
                                    <th scope="col">채팅수</th>
                                </tr>
                            </thead>
                            <tbody id="totalRankingsBody">
                                <tr v-for="(item, index) in chattingTotalRanks" v-bind:key="item.nickname">
                                    <td>{{10 * (offset - 1) + (index + 1)}} 등</td>
                                    <td>{{item.nickname}}</td>
                                    <td>{{item.chatnum}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </div>
        </section>
    </div>
</template>

<script>
  import axios from 'axios';
export default {
  name: 'ChattingTotalRanks',
  data () {
    return {
    chattingTotalRanks:{},
      offset: 0
    }
  },
  created: function(){
    
    },
  methods : {
    chattingTotalRanking:function() {
      axios.get('/api/chattingTotalRanking/' + this.offset).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.chattingTotalRanks = data;
          } else {
            alert(res.status);
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
