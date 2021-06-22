<template>
<div>Class Component Message: {{ hello }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  data () {
    return {
      hello: 'test'
    }
  }
}
</script>
