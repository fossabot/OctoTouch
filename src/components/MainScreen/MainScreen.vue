<style lang="sass">
  @import "MainScreen.scss"
</style>

<template>
  <div fill-height fluid class="main-menu__container">
    <v-row class="main-menu__header" align="center" justify="center">
      <v-col class="main-menu__header-item" align="start">
        ATOM 2.5 EX
      </v-col>
      <v-col class="main-menu__header-item" align="center">
        200°C / 59°C
      </v-col>
      <v-col class="main-menu__header-item" align="end">
        operatio
      </v-col>
    </v-row>
    <v-row class="main-menu__row" align="center" justify="center">
      <v-col v-ripple class="main-menu__item">
        <img class="main-menu__item-icon" :src="require('@/assets/folder.svg')"><br>
        <span style="margin-left: 0.5vw;" class="main-menu__item-title">files</span>
      </v-col>
      <v-col v-ripple class="main-menu__item">
        <img class="main-menu__item-icon" :src="require('@/assets/filament.svg')"><br>
        <span class="main-menu__item-title">filament</span>
      </v-col>
    </v-row>
    <v-row class="main-menu__row" align="center" justify="center">
      <v-col v-ripple class="main-menu__item">
        <img style="margin-left: 0vw; width: 8vw;" class="main-menu__item-icon" :src="require('@/assets/control.svg')"><br>
        <span class="main-menu__item-title">control</span>
      </v-col>
      <v-col v-ripple class="main-menu__item">
        <img class="main-menu__item-icon" :src="require('@/assets/utilities.svg')"><br>
        <span class="main-menu__item-title">utilities</span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'MainScreen',

    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/layout/pre-defined',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  })
</script>
