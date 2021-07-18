<template>
            <div id="container_demo">
                <div id="wrapper">
                    <div id="compoDiv">
                      로그인 정보
                      <h5>접속자 닉네임 :
                           {{$props.sessionname}}
                        </h5>
                        <h5>최근 로그인 날짜 :
                            {{$props.sessionlastlogdate}}
                        </h5>
                        <h5>최근 로그인 시간 :
                            {{$props.sessionlastlogtime}}
                        </h5>
                    </div>
                </div>
            </div>
</template>

<script>
  //import axios from 'axios';
export default {
  name: 'local-component',
  props: ['sessionname','sessionlastlogdate','sessionlastlogtime'],
  data () {
    return {
    }
  },
  created: function(){
      
  },
  mounted () {
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
