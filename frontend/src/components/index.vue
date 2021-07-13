<template>
 <div class="container">
        <header>
            <h1>관리콘솔 로그인 화면</h1>
        </header>
        <section>
            <div id="container_demo">
                <div id="wrapper">
                    <div id="loginDiv">
                        <form id="form" method="post">
                            <h1>Log in</h1>
                            <p>
                                <label for="userId" class="userId" data-icon="u"> 아이디를
                    입력하세요 </label> <input id="userid" name="userid" v-model="userid" required="required" type="text" placeholder="id 입력" />
                            </p>
                            <p>
                                <label for="password" class="youpasswd" data-icon="p">
                    비밀번호를 입력하세요 </label> <input id="passwd" name="passwd" v-model="password" v-on:keyup="loginKeyup" required="required" type="password" placeholder="pw 입력" />
                            </p>
                            <p class="login button">
                                <button id="login_button" type="button" v-on:click="loginButton">로그인</button>
                            </p>
                        </form>
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
      userid: '',
      password: ''
    }
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
    fn_PreLogin: function() {
        if (this.gfn_isNull(this.userid)) {
            alert("아이디를 입력하세요");
            return false;
        }
        if (this.gfn_isNull(this.password)) {
            alert("비밀번호를 입력하세요");
            return false;
        }
        if (this.password.length < 4) {
            alert("비밀번호는 네자리 이상 입력해 주세요");
            return false;
        }
        return true;
    },
    login : function() {
      var jsonData = {
        userid : this.userid,
        password : this.password,
      }
      const vm = this;
      axios.post('/api/login', JSON.stringify(jsonData),
        { headers: { 'Content-Type': 'application/json' } })
        .then(function(response) {
          
          if (response.status == 200) {
              var data = response.data;
              if(data.length >= 1) {
                vm.$router.push({name: 'Main'});
              } else {
                alert('아이디와 비밀번호를 확인해 주세요');
              }
          } else {
            alert(response.status);
          }
      });

    },
    loginKeyup: function(e) {
        if (e.keyCode === 13) {
            this.login();
        }
    },
    loginButton: function() {
        this.login();
    }
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
