<template>
            <div id="container_demo">
                <div id="wrapper">
                    <div id="compoDiv">
                      <h5>접속자 닉네임 :
                           {{nickname}}
                        </h5>
                        <h5>최근 로그인 날짜 :
                            {{lastlogdate}}
                        </h5>
                        <h5>최근 로그인 시간 :
                            {{lastlogtime}}
                        </h5>
                    </div>
                </div>
            </div>
</template>

<script>
  import axios from 'axios';
export default {
  name: 'local-component',
  data () {
    return {
      nickname: '',
      lastlogdate: '',
      lastlogtime:''
    }
  },
   created: function(){
      axios.get('/api/session').then(res => { 
         if (res.status == 200) {
              var data = res.data;

              this.nickname = data.nickname;
              this.lastlogdate = data.lastlogdate;
              this.lastlogtime = data.lastlogtime;
          } else {
            alert(res.status);
          }
       });
  },
  methods : {
    
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
