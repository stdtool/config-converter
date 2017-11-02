<style scoped>
  .editor {
    width: 100%;
  }
  @media (max-width: 767px) {
    .btn-exchange-container {
      margin-top: 8px!important;
      margin-top: .5rem!important;
      margin-bottom: 8px!important;
      margin-bottom: .5rem!important;
    }
    .btn-exchange-container > button {
      display: block;
      width: 100%;
    }
  }
</style>
<template>
  <section class="container">
    <h1>Markup Translator</h1>
    <div class="row">
      <div class="col-md-4">
        <select class="form-control" v-model="inputType">
          <option v-for="option in options" :value="option.value" :key="option.value">{{ option.name }}</option>
        </select>
      </div>
      <div class="col-md-2 text-right btn-exchange-container">
        <button type="button" class="btn btn-outline-primary" @click="switchIO"><i class="fa fa-exchange"></i></button>
      </div>
      <div class="col-md-6">
        <select class="form-control" v-model="outputType">
          <option v-for="option in options" :value="option.value" :key="option.value">{{ option.name }}</option>
        </select>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="editor" ref="inputEditor"></div>
      </div>
      <div class="col-md-6">
        <div class="editor" ref="outputEditor"></div>
      </div>
    </div>
    <div class="alert alert-danger" v-if="error">{{ error.message }}</div>
  </section>
</template>

<script>
import yaml from "js-yaml"
import yamlPkg from "js-yaml/package.json"

const ace = process.browser ? require("brace") : null
if (process.browser) {
  require("brace/mode/json")
  require("brace/mode/yaml")
  require("brace/theme/github")
}

function createEditor($elem, type) {
  const editor = ace.edit($elem)
  editor.setTheme("ace/theme/github")
  editor.getSession().setMode(`ace/mode/${type}`)
  editor.setOptions({
    maxLines: Infinity,
    fontSize: ".8rem",
  })
  editor.$blockScrolling = Infinity
  return editor
}

const DEFAULT_INPUT_CONTEXT = `object:
  foo: string!
  bar: 100
  baz: true
  qux: null
array:
  - name: cris
    email: corgidisco@gmail.com
  - name: cris2
    email: corgi.disco@gmail.com
`

export default {
  data() {
    return {
      options: [
        { name: `YAML (js-yaml@${yamlPkg.version})`, value: "yaml" },
        { name: "JSON (builtin)", value: "json" },
      ],
      inputEditor: null,
      outputEditor: null,
      inputType: "yaml",
      outputType: "json",
      error: null,
    }
  },
  mounted() {
    this.inputEditor = createEditor(this.$refs.inputEditor, this.inputType)

    this.inputEditor.setValue(DEFAULT_INPUT_CONTEXT)
    this.inputEditor.clearSelection()

    this.inputEditor.getSession().on("change", this.changeInput)
    this.$nextTick(this.changeInput)


    this.outputEditor = createEditor(this.$refs.outputEditor, this.outputType)
    this.outputEditor.setReadOnly(true)
  },
  watch: {
    inputType(to) {
      this.changeInput()
      this.inputEditor.getSession().setMode(`ace/mode/${to}`)
    },
    outputType(to) {
      this.changeInput()
      this.outputEditor.getSession().setMode(`ace/mode/${to}`)
    },
  },
  methods: {
    switchIO() {
      [this.inputType, this.outputType] = [this.outputType, this.inputType]

      this.inputEditor.getSession().setMode(`ace/mode/${this.inputType}`)
      this.outputEditor.getSession().setMode(`ace/mode/${this.outputType}`)

      this.inputEditor.setValue(this.outputEditor.getValue())
      this.inputEditor.clearSelection()
      this.changeInput()
    },
    changeInput() {
      try {
        let input = this.inputEditor.getValue()
        let medium = null
        // input
        if (this.inputType === "yaml") {
          medium = yaml.load(input)
        } else if (this.inputType === "json") {
          medium = JSON.parse(input)
        }

        // output
        let output = null
        if (this.outputType === "json") {
          output = JSON.stringify(medium, null, 2)
        } else if (this.outputType === "yaml") {
          output = yaml.dump(medium)
        }

        this.outputEditor.setValue(output + "\n")
        this.outputEditor.clearSelection()
        this.error = null
      } catch (e) {
        this.error = e
      }
    },
  },
}
</script>
