<template>
  <section class="container">
    <div class="row">
      <div class="col-md-6">

        <textarea class="form-control" @input="input" ref="inputTextarea"></textarea>
      </div>
      <div class="col-md-6">
        <textarea class="form-control" :value="output" readonly ref="outputTextarea"></textarea>
      </div>
    </div>
    <div class="alert alert-danger" v-if="error">{{ error.message }}</div>

    <ul>
      <li>js-yaml : <code>{{ yamlVersion }}</code></li>
    </ul>
  </section>
</template>

<script>
import autosize from "autosize"
import yaml from "js-yaml"
import yamlPkg from "js-yaml/package.json"

export default {
  data() {
    return {
      yamlVersion: yamlPkg.version,
      output: null,
      error: null,
    }
  },
  mounted() {
    autosize(this.$refs.inputTextarea)
    autosize(this.$refs.outputTextarea)
  },
  methods: {
    input(e) {
      try {
        this.output = JSON.stringify(yaml.load(e.target.value), null, 2)
        this.error = null
        this.$nextTick(() => autosize.update(this.$refs.outputTextarea))
      } catch (e) {
        this.error = e
      }
    },
  },
}
</script>
