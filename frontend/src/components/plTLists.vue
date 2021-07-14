/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <div class="container">
        <section>
            <div id="plContainer">
                <div id="wrapper">
                    <div id="wrapper">
                        <h4>인기도 리스트</h4>
                        <table border="1">
                            <colgroup>
                                <col width="50">
                                <col width="100">
                                <col width="50">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">등수</th>
                                    <th scope="col">닉네임</th>
                                    <th scope="col">좋아요</th>
                                </tr>
                            </thead>
                            <tbody id="plTbody">
                                <tr v-for="(item, index) in plTLists" v-bind:key="index">
									<td>{{index}}</td>
									<td>{{item.key}}</td>
									<td>{{item.value}}</td>
								</tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
  import axios from 'axios';
export default {
  name: 'Index',
  data () {
    return {
	plTLists:{}
    }
  },
  created: function(){
    const vm = this;
      axios.get('/api/session')
      .catch(error => {
        if (error.response.status === 401) {
            vm.$router.push({name: 'Index'});
        }
       });
       
      axios.get('/api/zrevrange/pl/10').then(res => { 
         if (res.status == 200) {
              var data = res.data;
              this.plTLists = data;
          } else {
            alert(res.status);
          }
       });

    },
  methods : {
  },
  props: {
    msg: String
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
