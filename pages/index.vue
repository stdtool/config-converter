<style scoped>
  h1 {
    color: #333;
  }
  .editor {
    width: 100%;
  }
  .github-corner:hover .octo-arm {
    animation:octocat-wave 560ms ease-in-out
  }
  .output-editor-container .ace-chrome {
    background-color: #efefef;
  }
  @keyframes octocat-wave {
    0%,100%{transform:rotate(0)}
    20%,60%{transform:rotate(-25deg)}
    40%,80%{transform:rotate(10deg)}
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
    .btn-exchange-container > button > i.fa {
      -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
      -webkit-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      transform: rotate(90deg);
    }
    .editor-container + .editor-container {
      margin-top: 8px!important;
      margin-top: .5rem!important;
    }
    .github-corner:hover .octo-arm{
      animation:none
    }
    .github-corner .octo-arm{
      animation:octocat-wave 560ms ease-in-out
    }
  }
</style>
<template>
  <section class="container">
    <a href="https://github.com/stdtool/config-converter" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#666666; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
    <h1>Config Converter</h1>
    <div class="row">
      <div class="col-md-4">
        <select class="form-control" v-model="inputType">
          <option v-for="option in inputOptions" :value="option.value" :key="option.value">{{ option.name }}</option>
        </select>
      </div>
      <div class="col-md-2 text-right btn-exchange-container">
        <button type="button" class="btn btn-outline-primary" @click="switchIO"><i class="fa fa-exchange"></i></button>
      </div>
      <div class="col-md-6">
        <select class="form-control" v-model="outputType">
          <option v-for="option in outputOptions" :value="option.value" :key="option.value">{{ option.name }}</option>
        </select>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-6 editor-container">
        <div class="editor" ref="inputEditor"></div>
      </div>
      <div class="col-md-6 editor-container output-editor-container">
        <div class="editor" ref="outputEditor"></div>
      </div>
    </div>
    <div class="alert alert-danger" v-if="error">{{ error.message }}</div>
  </section>
</template>

<script>
import yaml from "js-yaml"
import yamlPkg from "js-yaml/package.json"
import ini from "ini"
import iniPkg from "ini/package.json"
import toml from "toml"
import tomlPkg from "toml/package.json"
import * as tomlify from "tomlify"
import tomlifyPkg from "tomlify/package.json"

const ace = process.browser ? require("brace") : null
if (process.browser) {
  require("brace/mode/json")
  require("brace/mode/yaml")
  require("brace/mode/toml")
  require("brace/mode/ini")
  require("brace/theme/chrome")
}

function createEditor($elem, type) {
  const editor = ace.edit($elem)
  editor.setTheme("ace/theme/chrome")
  editor.getSession().setMode(`ace/mode/${type}`)
  editor.setOptions({
    maxLines: Infinity,
    fontSize: ".8rem",
  })
  editor.$blockScrolling = Infinity
  return editor
}

const DEFAULT_INPUT_CONTEXT = `users:
  object:
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
    let inputType
    let outputType
    if (process.browser && window && window.localStorage) {
      inputType = window.localStorage.getItem("input_type")
      outputType = window.localStorage.getItem("output_type")
    }
    return {
      inputOptions: [
        { name: `yaml (js-yaml@${yamlPkg.version})`, value: "yaml" },
        { name: "json (builtin)", value: "json" },
        { name: `ini (ini@${iniPkg.version})`, value: "ini" },
        { name: `toml (toml@${tomlPkg.version})`, value: "toml" },
      ],
      outputOptions: [
        { name: `yaml (js-yaml@${yamlPkg.version})`, value: "yaml" },
        { name: "json (builtin)", value: "json" },
        { name: `ini (ini@${iniPkg.version})`, value: "ini" },
        { name: `toml (tomlify@${tomlifyPkg.version})`, value: "toml" },
      ],
      inputEditor: null,
      outputEditor: null,
      inputType: inputType || "yaml",
      outputType: outputType || "json",
      error: null,
    }
  },
  mounted() {
    this.inputEditor = createEditor(this.$refs.inputEditor, this.inputType)

    let editorContext
    if (window && window.localStorage) {
      editorContext = window.localStorage.getItem("editor_context")
    }

    this.inputEditor.setValue(editorContext || DEFAULT_INPUT_CONTEXT)
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
      if (window && window.localStorage) {
        this.$nextTick(() => window.localStorage.setItem("input_type", to))
      }
    },
    outputType(to) {
      this.changeInput()
      this.outputEditor.getSession().setMode(`ace/mode/${to}`)
      if (window && window.localStorage) {
        this.$nextTick(() => window.localStorage.setItem("output_type", to))
      }
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
        if (window && window.localStorage) {
          this.$nextTick(() => window.localStorage.setItem("editor_context", input))
        }
        let medium = null
        // input
        if (this.inputType === "yaml") {
          medium = yaml.load(input)
        } else if (this.inputType === "json") {
          medium = JSON.parse(input)
        } else if (this.inputType === "ini") {
          medium = ini.decode(input)
        } else if (this.inputType === "toml") {
          medium = toml.parse(input)
        }

        // output
        let output = null
        if (this.outputType === "json") {
          output = JSON.stringify(medium, null, 2)
        } else if (this.outputType === "yaml") {
          output = yaml.dump(medium)
        } else if (this.outputType === "ini") {
          output = ini.encode(medium)
        } else if (this.outputType === "toml") {
          output = tomlify(medium)
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
