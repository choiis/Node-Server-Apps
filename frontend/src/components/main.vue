/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <div class="container">
        <header>
            <h1>관리콘솔</h1>
        </header>
        <section>
            <div id="mainContainer">
                <div id="wrapper">
                    <div class="animate form">
                        <button id="logout" type="button" v-on:click="logoutButton">로그아웃</button>
                        <local-component v-bind:sessionname="nicknames" v-bind:sessionlastlogdate="lastlogdate" v-bind:sessionlastlogtime="lastlogtime" ></local-component>
                        <p class="login button">
                            <button id="serverSwitch" type="button" v-on:click="serverSwitchButton">{{serverSwitch}}</button>
                            <input id="switchNumber" name="switchNumber" v-model="switchNumber" type="text" style="display:none;" />
                        </p>
                        <form id=" chatting_data " class="animate form ">
                            <div v-show="switchNumber == 0">
                            <h5>접속자 수</h5>
                            <h5 id="members ">{{members}}명</h5>
                            <h5>1초당 패킷 수</h5>
                            <h5 id="chattings">{{chattings}}</h5>

                            <h5>메모리</h5>
                            <h5 id="memory">{{memory}}</h5>
                            <h5>CPU</h5>
                            <h5 id="cpu">{{cpu}}</h5>
                            </div>
                            <h5>강퇴시킬 닉네임</h5>
                            <input id="banName" v-bind:disabled="switchNumber == 1" name="banName" v-model="banName" type="text " />
                            <button id="banButton" v-bind:disabled="switchNumber == 1" v-on:click="banUserButton" type="button">강퇴</button> 날짜 선택<input type="text" v-model="vueDatePick" v-on:keyup="vueDatePickKeyup" id="datePick" name="datePick" maxlength="8">
                            <button id="datePickButton" v-on:click="datePickButton" type="button">날짜별 조회</button>

                            <h5>날짜별 사용자수</h5>
                            <h5 id="userCount">{{userCount}}</h5>
                            <h5>날짜별 지시패킷</h5>
                            <h5 id="directionsPerDay">{{directionsPerDay}}</h5>
                            <h5>날짜별 채팅패킷</h5>
                            <h5 id="chattingsPerDay">{{chattingsPerDay}}</h5>
                        </form>
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
                                <tr v-for="chats in chattingStatistics" v-bind:key="chats.cnt_hour">
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
                                <tr v-for="(item, index) in chattingRanking" v-bind:key="item.nickname">
                                    <td>{{index + 1}}</td>
                                    <td>{{item.nickname}}</td>
                                    <td>{{item.chatnum}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div id="subapp">
                            <li>
                                <router-link to="/files">서버 파일 목록</router-link>
                            </li>
                            <li>
                                <router-link to="/plTLists">인기도 리스트</router-link>
                            </li>
                            <li>
                                <router-link to="/chattingTotalRanks">닉네임별 전체 채팅</router-link>
                            </li>
                        <router-view></router-view>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<script>
  import axios from 'axios';
  import LoginInfo from './logininfo';
export default {
  name: 'Index',
  data () {
    return {
      switchNumber: 1,
      members: 0,
      chattings: 0,
      memory: 0,
      cpu: 0,
      banName: "",
      vueDatePick: "",
      userCount: 0,
      directionsPerDay: 0,
      chattingsPerDay: 0,
      chattingStatistics: [],
      chattingRanking: [],
      serverSwitch: "서버켜기",
      nicknames: "",
      lastlogdate: "",
      lastlogtime: "",
    }
  },
  components: function() {LoginInfo},
  created: function(){
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) {
          month = "0" + month;
      }
      if (day < 10) {
          day = "0" + day;
      }
      this.vueDatePick = year + month + day;
       
      const vm = this;
      axios.get('/api/session')
       .catch(error => {
            if (error.response.status === 401) {
                vm.$router.push({name: 'Index'});
            }
        });
      this.callInfo();
      axios.get('/api/session').then(res => { 
         if (res.status == 200) {
              var data = res.data;

              this.nicknames = data.nickname;
              this.lastlogdate = data.lastlogdate;
              this.lastlogtime = data.lastlogtime;
          } else {
            alert(res.status);
          }
       });
      
  },
  methods : {
    gfn_isNull: function(obj) {
        if (obj == undefined) {
            return true;
        } else if (obj == null) {
            return true;
        } else if (obj === null) {
            return true;
        } else if (typeof obj === 'string' && obj === '') {
            return true;
        } 
        return false;
    },
    gfn_IsDate: function(date) {
        var nYear = date.substr(0, 4);
        var nMonth = date.substr(4, 2);
        var nDay = date.substr(6, 2);
        if (nYear < 1900 || nYear > 3000) { // 사용가능 하지 않은 년도 체크
            return false;
        }
        if (nMonth < 1 || nMonth > 12) { // 사용가능 하지 않은 달 체크
            return false;
        }
        var nMaxDay = new Date(new Date(nYear, nMonth, 1) - 86400000).getDate();
        if (nDay < 1 || nDay > nMaxDay) { // 사용가능 하지 않은 날자 체크
            return false;
        }
        return true;
    },
    callCount: function() {
       axios.get('/api/callCount').then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.members = data.cnt;
							var packetCnt = parseInt(data.packet);
							if (isNaN(packetCnt)) {
								this.chattings = "0";
							} else {
								this.chattings = packetCnt;
							}
          } else {
            alert(res.status);
          }
       });
    },
    monitor: function() {
      axios.get('/api/monitor').then(res => { 
        if (res.status == 200) {
            var data = res.data;
            this.memory = (data[0].monit.memory / 1024) + " K";
			this.cpu = Math.floor(data[0].monit.cpu / 10) + " %";
        } else {
            alert(res.status);
        }
      });
    },
    callInfo: function() {
        const vm = this;		
        setInterval(function() {
            if(vm.switchNumber == 0) {
                vm.callCount()
                vm.monitor()
            }
        }, 1000);
	},
    logoutButton:function() {

        const vm = this;
        axios.post('/api/logout', JSON.stringify({}),
            { headers: { 'Content-Type': 'application/json' } })
            .then(function(response) {
                if (response.status == 200) {
                  vm.$router.push({name: 'Index'});
                } else {
                    alert('아이디와 비밀번호를 확인해 주세요');
                }
        });

    },
    serverSwitchButton:function() {
      var jsonData = {
         off: String(this.switchNumber)
      }
      const vm = this;
      axios.put('/api/serverSwitch', JSON.stringify(jsonData),
        { headers: { 'Content-Type': 'application/json' } })
        .then(function(res) {
            var data = res.data;
            if (res.status == 200) {
                if (data.flag === 0) {
                    vm.switchNumber = 0;
                    vm.serverSwitch = "서버끄기";
                } else {
                    vm.serverSwitch = "서버켜기";
                    vm.switchNumber = 1;
                    vm.members = 0;
                    vm.chattings = 0;
                    vm.memory = 0;
                    vm.cpu = 0;
                }
          } else {
            alert(res.status);
          }
      });
    },
     banUser: function() {
       axios.delete('/api/ban/' +  this.banName).then(res => { 
         if (res.status == 200) {
              this.banName = "";
              alert("강퇴!");
          } else {
            alert(res.status);
          }
       });
    },
    banUserButton: function() {
        this.banUser();
    },
    datePickButton:function() {
        if (!this.gfn_IsDate(this.vueDatePick)) {
            alert("정확한 날짜를 입력해주세요!");
            return;
        }
        this.chattingStatisticsFunc();
        this.chattingCountPerDay();
        this.directionCountPerDay();
        this.chattingRankingFunc();
        this.uniqueUser();
    },
    vueDatePickKeyup: function(e) {
        if (e.keyCode === 13) {
            this.datePickButton();
        }
    },
    uniqueUser: function() {
        axios.get('/api/uniqueUser/' + this.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.userCount = data[0].uniqueuser;
          } else {
            alert(res.status);
          }
       });
    },
    chattingStatisticsFunc: function() {
        axios.get('/api/chattingStatistics/' + this.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.chattingStatistics = data;
          } else {
            alert(res.status);
          }
       });
    },
    chattingCountPerDay: function() {
        axios.get('/api/chattingCountPerDay/' + this.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.chattingsPerDay = data[0].cnt;
          } else {
            alert(res.status);
          }
       });
    },
    directionCountPerDay: function() {
      axios.get('/api/directionCountPerDay/' + this.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.directionsPerDay = data[0].cnt;
          } else {
            alert(res.status);
          }
       });
    },
    chattingRankingFunc: function() {
      axios.get('/api/chattingRanking/' + this.vueDatePick).then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.chattingRanking = data;
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
