<template>
            <div id="container_demo">
                <div id="wrapper">
                    <div id="dailyDiv">
                      <h5>날짜별 사용자수</h5>
                      <h5 id="userCount">{{userCount}}</h5>
                      <h5>날짜별 지시패킷</h5>
                      <h5 id="directionsPerDay">{{directionsPerDay}}</h5>
                      <h5>날짜별 채팅패킷</h5>
                      <h5 id="chattingsPerDay">{{chattingsPerDay}}</h5>
                    </div>
                </div>

                <h5>패킷량 통계</h5>
                        <table border="1">
                            <colgroup>
                                <col width="100">
                                <col width="200">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">시간대</th>
                                    <th scope="col">채팅량</th>
                                </tr>
                            </thead>
                            <tbody id="statisticsBody">
                                <tr v-for="chats in $props.chattingStatistics" v-bind:key="chats.cnt_hour">
                                    <td>{{chats.cnt_hour}} ~ {{chats.cnt_hour + 1}} 시</td>
                                    <td>{{chats.cnt}}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h5>닉네임별,날짜별 채팅 량 통계</h5>
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
                            <tbody id="rankingsBody">
                                <tr v-for="(item, index) in $props.chattingRanking" v-bind:key="item.nickname">
                                    <td>{{index + 1}}</td>
                                    <td>{{item.nickname}}</td>
                                    <td>{{item.chatnum}}</td>
                                </tr>
                            </tbody>
                        </table>
            </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'daily-component',
  props: ['vueDatePick','chattingStatistics','chattingRanking'],
  data () {
    return {
      chattingsPerDay: 0,
      directionsPerDay: 0,
      userCount:0
    }
  },
  created: function(){
      
  },
  mounted () {
  },
  methods : {
    childMethod: function() {
      this.chattingCountPerDay();
      this.directionCountPerDay();
      this.uniqueUser();
    },
    uniqueUser: function() {
        axios.get('/api/uniqueUser/' + this.$props.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.userCount = data[0].uniqueuser;
          } else {
            alert(res.status);
          }
       });
    },
    chattingCountPerDay: function() {
        axios.get('/api/chattingCountPerDay/' + this.$props.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.chattingsPerDay = data[0].cnt;
          } else {
            alert(res.status);
          }
       });
    },
    directionCountPerDay: function() {
      axios.get('/api/directionCountPerDay/' + this.$props.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.directionsPerDay = data[0].cnt;
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
