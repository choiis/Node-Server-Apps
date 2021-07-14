<template>
 <div class="container">
        <header>
            <h1>404</h1>
        </header>
        <section>
            <div id="container_demo">
                <div id="wrapper">
                    <div id="404Div">
                            <h1>404 Page not found</h1>
                        </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
     
    }
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
