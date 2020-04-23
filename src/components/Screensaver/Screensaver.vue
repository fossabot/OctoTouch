<style lang="sass">
  @import "Screensaver.scss"
</style>

<template>
  <div fill-height fluid class="screensaver__container">
    <img @click="screenWake()" class="screensaver__logo" :src="require('@/assets/logo.svg')">
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Screensaver',
    data: () => ({
      
    }),
    methods: {
      screenWake() {
        this.$router.push("/");
      }
    }
  })
</script>
